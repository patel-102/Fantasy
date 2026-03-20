// 🦋 KING Supabase Engine v3.3 - Presence & SQL v2.0 Optimized
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = 'https://zwdjytpnmenywzzuexjd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3ZGp5dHBubWVueXd6enVleGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTQ4MjIsImV4cCI6MjA4OTU5MDgyMn0.RofipnAgWyr0qE9vQCoYKvioIS-fKRP0zDTTS35E4uI';

const BUCKET = "king";

// 1. INITIALIZE CLIENT
window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// 2. CACHE SYSTEM (IndexedDB)
const DB_NAME = "KING_DB";
const STORE_NAME = "profiles";

async function openDB() {
    return new Promise((resolve, reject) => {
        let req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => {
            if (!e.target.result.objectStoreNames.contains(STORE_NAME)) {
                e.target.result.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e);
    });
}

async function cacheSet(key, value) {
    try {
        let db = await openDB();
        let tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(value, key);
    } catch (e) { console.error("Cache Set Fail", e); }
}

async function cacheGet(key) {
    try {
        let db = await openDB();
        return new Promise(resolve => {
            let tx = db.transaction(STORE_NAME, "readonly");
            let req = tx.objectStore(STORE_NAME).get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    } catch (e) { return null; }
}

// 3. CORE ENGINE
const KING = {
    // --- AUTH & HEARTBEAT ---
    async checkAuth(isLoginPage = true) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isLoginPage) {
            window.location.replace("profile.html"); 
            return session;
        } 
        if (!session && !isLoginPage) {
            window.location.replace("login.html");
            return null;
        }

        if (session) {
            this.startHeartbeat(session.user.id);
            return session;
        }
        return null;
    },

    startHeartbeat(userId) {
        if (!userId || window.presenceInterval) return;

        const pulse = async () => {
            await supabase.from("profiles").update({ 
                last_active: new Date().toISOString() 
            }).eq('id', userId);
        };

        pulse(); 
        window.presenceInterval = setInterval(pulse, 90000); // 90s pulse for 120s SQL window
    },

    // --- PROFILE FETCHING ---
    async loadProfile(userId) {
        if (!userId) return null;
        
        // Return cached for speed, refresh in background
        const cached = await cacheGet(userId);
        const refreshPromise = this.refreshProfile(userId);
        
        return cached || await refreshPromise;
    },

    async refreshProfile(userId) {
        // Querying the VIEW for computed fields like 'age' and 'online'
        let { data, error } = await supabase
            .from("profiles_view")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (data && !error) {
            await cacheSet(userId, data);
            // Trigger UI update event
            window.dispatchEvent(new CustomEvent('profileFresh', { detail: data }));
            return data;
        }
        return null;
    },

    // --- UPDATE PROFILE ---
    async updateProfile(userId, updates) {
        // Always update the TABLE, not the view
        const { data, error } = await supabase
            .from("profiles")
            .update({ ...updates, last_active: new Date().toISOString() })
            .eq('id', userId)
            .select();

        if (!error) await this.refreshProfile(userId);
        return { data, error };
    },

    // --- MEDIA ENGINE ---
    async uploadAvatar(file, userId, oldUrl) {
        const fileExt = file.name.split('.').pop();
        const storagePath = `avatar/${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

        // Cleanup old file from storage if exists
        if (oldUrl && oldUrl.includes(BUCKET)) {
            try {
                const oldPath = oldUrl.split(`${BUCKET}/`)[1];
                await supabase.storage.from(BUCKET).remove([oldPath]);
            } catch (e) { console.warn("Old avatar cleanup skipped"); }
        }

        await this.updateProfile(userId, { avatar_url: publicUrl });
        return publicUrl;
    },

    async uploadToGallery(file, userId, isPublic = true) {
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const storagePath = `gallery/${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

        const { error: dbError } = await supabase.from("gallery").insert({
            user_id: userId,
            image_url: publicUrl,
            storage_path: storagePath,
            is_public: isPublic
        });

        if (dbError) throw dbError;
        return publicUrl;
    },

    async toggleGalleryPrivacy(userId, isPublic) {
        return await supabase
            .from("gallery")
            .update({ is_public: isPublic })
            .eq('user_id', userId);
    },

    // --- LOGOUT ---
    async logout() {
        if (window.presenceInterval) clearInterval(window.presenceInterval);
        
        // Clear Cache
        try {
            let db = await openDB();
            let tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).clear();
        } catch (e) {}

        await supabase.auth.signOut();
        window.location.replace("login.html");
    }
};

window.KING = KING;
export default KING;
