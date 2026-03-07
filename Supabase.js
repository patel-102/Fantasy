// 🦋 KING Supabase Engine v3.1 - Fixed RLS & Auth Guard
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
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
        // Background refresh
        this.refreshProfile(userId); 
        return cached || this.refreshProfile(userId);
    },

    async refreshProfile(userId) {
        let { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle(); // Better than .single() to avoid 406 errors

        if (data) cacheSet(userId, data);
        return data;
    },

    subscribeProfile(userId, callback) {
        return supabase.channel(`profile:${userId}`)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${userId}`
            }, payload => {
                const newData = payload.new || payload.old;
                cacheSet(userId, newData);
                if (callback) callback(newData);
            })
            .subscribe();
    },

    // 4. MEDIA ENGINE - Fixed RLS for Storage
    async uploadAvatar(file, userId, oldUrl) {
        // 1. Upload new file
        const fileExt = file.name.split('.').pop();
        const fileName = `avatar/${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

        // 3. Delete old file if exists
        if (oldUrl && oldUrl.includes(BUCKET)) {
            try {
                const oldPath = oldUrl.split(`${BUCKET}/`)[1];
                await supabase.storage.from(BUCKET).remove([oldPath]);
            } catch (e) { console.warn("Old avatar cleanup failed"); }
        }

        // 4. Update Profile DB (Crucial: Use .update().eq() for RLS)
        const { error: dbError } = await supabase
            .from("profiles")
            .update({ avatar_url: publicUrl, last_active: new Date().toISOString() })
            .eq('id', userId);

        if (dbError) throw dbError;
        
        return publicUrl;
    },

    async login(email, password) {
        return await supabase.auth.signInWithPassword({ email, password });
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
