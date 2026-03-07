// 🦋 KING Supabase Engine v3.1 - Enhanced for SQL Schema v2.0
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = 'https://hmuylzufwphaaftyhhxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdXlsenVmd3BoYWFmdHloaHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDE5MjIsImV4cCI6MjA4ODQ3NzkyMn0.1lpVqMl1IRG1OP_juJwnmY4OeXNzeUpe3-sj9W8PWk0';
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
    let db = await openDB();
    let tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, key);
}

async function cacheGet(key) {
    let db = await openDB();
    return new Promise(resolve => {
        let tx = db.transaction(STORE_NAME, "readonly");
        let req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });
}

// 3. CORE ENGINE
const KING = {
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
        return session;
    },

    async loadProfile(userId) {
        if (!userId) return null;
        let cached = await cacheGet(userId);
        this.refreshProfile(userId); 
        return cached || this.refreshProfile(userId);
    },

    async refreshProfile(userId) {
        let { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (data) cacheSet(userId, data);
        return data;
    },

    // 4. MEDIA ENGINE - Optimized for your SQL storage_path logic
    async uploadAvatar(file, userId, oldUrl) {
        const fileExt = file.name.split('.').pop();
        const storagePath = `avatar/${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

        // Delete old file from storage if it exists
        if (oldUrl && oldUrl.includes(BUCKET)) {
            try {
                const oldPath = oldUrl.split(`${BUCKET}/`)[1];
                await supabase.storage.from(BUCKET).remove([oldPath]);
            } catch (e) { console.warn("Cleanup failed"); }
        }

        // Update DB - matches your profiles table schema
        const { error: dbError } = await supabase
            .from("profiles")
            .update({ 
                avatar_url: publicUrl, 
                last_active: new Date().toISOString() 
            })
            .eq('id', userId);

        if (dbError) throw dbError;
        return publicUrl;
    },

    async uploadToGallery(file, userId) {
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const storagePath = `gallery/${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

        // Matches your gallery table schema exactly
        const { error: dbError } = await supabase.from("gallery").insert({
            user_id: userId,
            image_url: publicUrl,
            storage_path: storagePath, // Required for your RLS policy
            is_public: true
        });

        if (dbError) throw dbError;
        return publicUrl;
    },

    async logout() {
        let db = await openDB();
        let tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear();
        await supabase.auth.signOut();
        window.location.replace("login.html");
    }
};

window.KING = KING;
