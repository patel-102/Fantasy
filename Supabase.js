// 🦋 KING Supabase Engine v3.1 - Enhanced Auth Guard
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

// 2. AUTH LISTENER
supabase.auth.onAuthStateChange((event, session) => {
    // If the user logs out from any tab, boot them to login
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

// 4. CORE ENGINE
const KING = {
    /**
     * AUTH GUARD: Essential for preventing logged-in users 
     * from seeing the login page and vice-versa.
     */
    async checkAuth(isLoginPage = true) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isLoginPage) {
            // User is logged in but trying to access Login Page -> Redirect to Profile
            window.location.replace("profile.html"); 
            return session;
        } 
        
        if (!session && !isLoginPage) {
            // User is NOT logged in but trying to access Profile -> Redirect to Login
            window.location.replace("login.html");
            return null;
        }

        return session;
    },

    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    // Shortcut for getting the current logged in user object
    async getUser() {
        const session = await this.getSession();
        return session ? session.user : null;
    },

    async loadProfile(userId) {
        let cached = await cacheGet(userId);
        if (cached) {
            this.refreshProfile(userId); 
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

    // 5. MEDIA ENGINE
    async uploadAvatar(file, userId, oldUrl) {
        const path = `avatar/${userId}_${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

        if (oldUrl && oldUrl.includes(BUCKET)) {
            const oldPath = oldUrl.split(`${BUCKET}/`)[1];
            await supabase.storage.from(BUCKET).remove([oldPath]);
        }

        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
        return publicUrl;
    },

    // 6. AUTH HELPERS
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
        // Clear local cache on logout for security
        let db = await openDB();
        let tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear();
        
        await supabase.auth.signOut();
        window.location.replace("login.html");
    }
};

window.KING = KING;
