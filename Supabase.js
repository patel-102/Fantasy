// 🦋 KING Supabase Engine v3 - Optimized for Butterfly UI
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';
const BUCKET = "king";

// 1. INITIALIZE CLIENT
// Fixed: Using the correct Anon Key variable
window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// 2. AUTH LISTENER
supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
        location.href = "login.html";
    }
});

// 3. CACHE SYSTEM (IndexedDB)
const DB_NAME = "KING_DB";
const STORE_NAME = "profiles";

async function openDB() {
    return new Promise((resolve, reject) => {
        let req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME);
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

// 4. PROFILE ENGINE
const KING = {
    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    async loadProfile(userId) {
        // Load from local memory first for instant "Butterfly" feel
        let cached = await cacheGet(userId);
        if (cached) {
            this.refreshProfile(userId); // Background update
            return cached;
        }
        return this.refreshProfile(userId);
    },

    async refreshProfile(userId) {
        let { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (data) cacheSet(userId, data);
        return data;
    },

    subscribeProfile(userId, callback) {
        return supabase.channel(`profile:${userId}`)
            .on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${userId}`
            }, payload => {
                cacheSet(userId, payload.new);
                if (callback) callback(payload.new);
            })
            .subscribe();
    },

    // 5. PRESENCE & ACTIVITY
    async startPresence() {
        const session = await this.getSession();
        if (!session) return;

        const channel = supabase.channel("online-users");
        channel.on("presence", { event: "sync" }, () => {
            // Logic for showing who else is online if needed
        }).subscribe(async status => {
            if (status === "SUBSCRIBED") {
                await channel.track({
                    user_id: session.user.id,
                    online_at: new Date().toISOString()
                });
            }
        });

        // Heartbeat for "Last Active"
        setInterval(async () => {
            await supabase.from("profiles")
                .update({ last_active: new Date().toISOString(), online: true })
                .eq("id", session.user.id);
        }, 30000);
    },

    // 6. MEDIA ENGINE (Avatar & Gallery)
    async uploadAvatar(file, userId, oldUrl) {
        const path = `avatar/${userId}_${Date.now()}`;
        
        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, file);
        
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

        // Cleanup old image to save space
        if (oldUrl && oldUrl.includes(BUCKET)) {
            const oldPath = oldUrl.split(`${BUCKET}/`)[1];
            await supabase.storage.from(BUCKET).remove([oldPath]);
        }

        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
        return publicUrl;
    },

    async uploadGallery(file, userId, isPublic = true) {
        const path = `gallery/${userId}_${Date.now()}`;
        await supabase.storage.from(BUCKET).upload(path, file);
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

        await supabase.from("gallery").insert({
            user_id: userId,
            image_url: publicUrl,
            is_public: isPublic
        });
        return publicUrl;
    },

    async deleteGallery(id, url) {
        const path = url.split(`${BUCKET}/`)[1];
        await supabase.storage.from(BUCKET).remove([path]);
        await supabase.from("gallery").delete().eq("id", id);
    },

    // 7. AUTH HELPERS
    async login(email, password) {
        return await supabase.auth.signInWithPassword({ email, password });
    },

    async register(email, password, metadata) {
        return await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }
        });
    },

    async logout() {
        await supabase.auth.signOut();
        location.href = "login.html";
    }
};

window.KING = KING;

