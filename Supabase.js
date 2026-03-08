// 🦋 KING Supabase Engine v3.2 - Presence & Heartbeat Fixed
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = 'https://hmuylzufwphaaftyhhxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdXlsenVmd3BoYWFmdHloaHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDE5MjIsImV4cCI6MjA4ODQ3NzkyMn0.1lpVqMl1IRG1OP_juJwnmY4OeXNzeUpe3-sj9W8PWk0';
const BUCKET = "king";

window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
});

const DB_NAME = "KING_DB";
const STORE_NAME = "profiles";

async function openDB() {
    return new Promise((resolve) => {
        let req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME);
        req.onsuccess = e => resolve(e.target.result);
    });
}

async function cacheSet(key, value) {
    let db = await openDB();
    db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(value, key);
}

async function cacheGet(key) {
    let db = await openDB();
    return new Promise(resolve => {
        let req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result);
    });
}

const KING = {
    async checkAuth(isLoginPage = true) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isLoginPage) window.location.replace("profile.html"); 
        if (!session && !isLoginPage) window.location.replace("login.html");
        return session;
    },

    async loadProfile(userId) {
        let cached = await cacheGet(userId);
        this.refreshProfile(userId); 
        return cached || this.refreshProfile(userId);
    },

    async refreshProfile(userId) {
        // We fetch from the VIEW to get the calculated 'online' status
        let { data } = await supabase.from("profiles_view").select("*").eq("id", userId).maybeSingle();
        if (data) cacheSet(userId, data);
        return data;
    },

    // --- PRESENCE SYSTEM ---
    async startHeartbeat(userId) {
        if (!userId) return;
        const pulse = async () => {
            await supabase.from("profiles").update({ last_active: new Date().toISOString() }).eq('id', userId);
        };
        pulse(); // Initial pulse
        return setInterval(pulse, 60000); // Pulse every 60 seconds
    },

    async getLiveStatus(userId) {
        const { data } = await supabase.from("profiles_view").select("online").eq("id", userId).single();
        return data?.online || false;
    },

    async uploadAvatar(file, userId, oldUrl) {
        const storagePath = `avatar/${userId}/${Date.now()}.${file.name.split('.').pop()}`;
        await supabase.storage.from(BUCKET).upload(storagePath, file, { upsert: true });
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        
        if (oldUrl && oldUrl.includes(BUCKET)) {
            const oldPath = oldUrl.split(`${BUCKET}/`)[1];
            await supabase.storage.from(BUCKET).remove([oldPath]);
        }

        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq('id', userId);
        return publicUrl;
    },

    async logout() {
        let db = await openDB();
        db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).clear();
        await supabase.auth.signOut();
        window.location.replace("login.html");
    }
};

window.KING = KING;
