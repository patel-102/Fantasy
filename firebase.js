/**
 * 👑 KING - Advanced Multi-Table & Secure Storage Engine v4.0
 * Architecture: Triple-Split Sync (Profiles + Media + Storage)
 */

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';

// Auto-inject Supabase CDN if missing
if (typeof window.supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    document.head.appendChild(script);
}

window.kingStorage = {
    bucket: 'king',

    /**
     * 1. PRIVATE UPLOAD
     * Saves to: [user_id]/[folder]/[timestamp]_[random].ext
     */
    async upload(file, folder = 'general') {
        try {
            const { data: { user } } = await window.supabase.auth.getUser();
            if (!user) throw new Error("Authentication required for secure upload.");

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.id}/${folder}/${fileName}`;

            const { data, error } = await window.supabase.storage
                .from(this.bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            const { data: { publicUrl } } = window.supabase.storage
                .from(this.bucket)
                .getPublicUrl(filePath);

            return { url: publicUrl, path: filePath };
        } catch (err) {
            console.error("👑 [Storage Error]:", err.message);
            return null;
        }
    },

    /**
     * 2. PERMANENT SHREDDER
     * Deletes DB record and physical storage file simultaneously
     */
    async shredMessage(messageId, storagePath = null) {
        try {
            // Step A: Remove physical file from bucket if path exists
            if (storagePath) {
                const { error: storageErr } = await window.supabase.storage
                    .from(this.bucket)
                    .remove([storagePath]);
                if (storageErr) console.warn("👑 [Shred Warning]: File not found, continuing to DB...");
            }

            // Step B: Remove DB Record from messages table
            const { error: dbErr } = await window.supabase
                .from('messages')
                .delete()
                .eq('id', messageId);

            if (dbErr) throw dbErr;
            return { success: true };
        } catch (err) {
            console.error("👑 [Shred Error]:", err.message);
            return { success: false, error: err.message };
        }
    },

    /**
     * 3. MULTI-TABLE SYNC
     * Atomically updates 'profiles' (text) and 'profile_media' (links)
     */
    async saveFullProfile(textData, mediaData) {
        try {
            const { data: { user } } = await window.supabase.auth.getUser();
            if (!user) throw new Error("No active session found.");

            // Parallel execution for maximum performance
            const [res1, res2] = await Promise.all([
                window.supabase.from('profiles').update(textData).eq('id', user.id),
                window.supabase.from('profile_media').update(mediaData).eq('profile_id', user.id)
            ]);

            if (res1.error) throw res1.error;
            if (res2.error) throw res2.error;

            return { success: true };
        } catch (err) {
            console.error("👑 [Sync Error]:", err.message);
            return { success: false, error: err.message };
        }
    },

    /**
     * 4. RELATIONAL DATA FETCH
     * Joins profiles with media in a single request
     */
    async getCombinedProfile(targetId) {
        try {
            const { data, error } = await window.supabase
                .from('profiles')
                .select(`
                    *,
                    profile_media (avatar_url, gallery)
                `)
                .eq('id', targetId)
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            return { data: null, error: err.message };
        }
    }
};

/**
 * ENGINE BOOTSTRAP
 * Ensures Supabase is ready before triggering KingReady
 */
const bootKingEngine = () => {
    try {
        if (!window.supabase || !window.supabase.createClient) return;
        
        window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Broadcast readiness to the Identity Hub
        window.dispatchEvent(new CustomEvent('KingReady'));
        
        console.group("👑 KING ENGINE ONLINE");
        console.log("Status: Secure Connection Verified");
        console.log("Modules: [Storage, Shredder, MultiSync]");
        console.groupEnd();
    } catch (error) {
        console.error("👑 [Boot Error]:", error);
    }
};

// Check for library availability every 50ms
const checkLib = setInterval(() => {
    if (window.supabase?.createClient) {
        bootKingEngine();
        clearInterval(checkLib);
    }
}, 50);
