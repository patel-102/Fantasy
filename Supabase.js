/**
 * KING ENGINE v4.0 - CORE STORAGE & AUTHENTICATION
 * Architecture: Singleton Pattern with Reactive State
 * Capabilities: Auth, CRUD, Real-time, Storage, and Global Error Catching
 */

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';

window.king = {
    client: null,
    isReady: false,
    bucket: 'king',
    session: null,

    // =========================
    // 1. ENGINE INITIALIZATION
    // =========================
    async init() {
        if (this.isReady) return true;

        if (typeof supabase === 'undefined') {
            console.error("👑 KING: Supabase CDN not found. Retrying...");
            return false;
        }

        try {
            this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });

            // Global Alias for UI Components
            window.supabaseClient = this.client;
            
            // Sync initial session
            const { data } = await this.client.auth.getSession();
            this.session = data.session;

            // Setup Auth Listener
            this.client.auth.onAuthStateChange((_event, session) => {
                this.session = session;
                window.dispatchEvent(new CustomEvent("KingAuthChanged", { detail: { event: _event, session } }));
                console.log(`👑 KING Auth: ${_event}`);
            });

            this.isReady = true;
            window.dispatchEvent(new CustomEvent("KingReady"));
            return true;
        } catch (err) {
            this.logError("Boot Failure", err);
            return false;
        }
    },

    // =========================
    // 2. DATA OPERATIONS (CRUD)
    // =========================
    
    /**
     * Fetch records from any table with optional filters
     * @param {string} table - Table name
     * @param {object} match - Filter criteria (e.g., { id: 5 })
     */
    async select(table, match = {}, order = { column: 'created_at', ascending: false }) {
        const { data, error } = await this.client
            .from(table)
            .select('*')
            .match(match)
            .order(order.column, { ascending: order.ascending });

        if (error) throw error;
        return data;
    },

    /**
     * Upsert data (Insert or Update if ID exists)
     */
    async save(table, payload) {
        const { data, error } = await this.client
            .from(table)
            .upsert({ ...payload, updated_at: new Date() })
            .select();

        if (error) throw error;
        return data[0];
    },

    /**
     * Delete record from table
     */
    async wipe(table, id) {
        const { error } = await this.client
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // =========================
    // 3. STORAGE & MEDIA
    // =========================

    async uploadFile(file, folder = 'general') {
        const user = this.session?.user;
        if (!user) throw new Error("Unauthorized: King requires a subject.");

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${folder}/${fileName}`;

        const { data, error } = await this.client.storage
            .from(this.bucket)
            .upload(filePath, file);

        if (error) throw error;
        
        // Return both path and public/signed URL access logic
        return { 
            path: data.path, 
            fullPath: filePath 
        };
    },

    async getSecureURL(path, expires = 3600) {
        const { data, error } = await this.client.storage
            .from(this.bucket)
            .createSignedUrl(path, expires);

        if (error) throw error;
        return data.signedUrl;
    },

    // =========================
    // 4. REAL-TIME SYNC
    // =========================

    subscribe(table, callback) {
        return this.client
            .channel(`realtime:${table}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: table }, (payload) => {
                callback(payload);
            })
            .subscribe();
    },

    // =========================
    // 5. UTILITIES
    // =========================

    logError(context, err) {
        console.error(`%c 👑 KING ERROR [%c${context}%c]:`, 
            "color: #FFD700; font-weight: bold;", 
            "color: #ff4d4d;", 
            "color: #FFD700;", 
            err.message || err);
    }
};

// Auto-Boot Sequence with Exponential Backoff
(function boot() {
    let attempts = 0;
    const max = 20;
    const timer = setInterval(() => {
        attempts++;
        if (window.king.init() || attempts > max) {
            clearInterval(timer);
            if (attempts > max) console.error("👑 KING: Engine Timeout.");
        }
    }, 200);
})();
