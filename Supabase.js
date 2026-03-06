/**
 * KING ENGINE v2.0 - Centralized Storage & Auth 
 * Dependencies: Supabase JS CDN
 */

const SUPABASE_URL = 'https://labfqhcwiukvdxxqpqbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYmZxaGN3aXVrdmR4eHFwcWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzUwOTIsImV4cCI6MjA4ODM1MTA5Mn0.LMw7GeTsUQqP_drUJzU5LRz6mv0Cm3caGld9SFtmUjk';

window.king = {
  bucket: 'king',

  // 1. Initialize Supabase
  init() {
    if (!window.supabase?.createClient) return false;
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("👑 KING Engine: Online");
    window.dispatchEvent(new CustomEvent('KingReady'));
    return true;
  },

  // 2. Secure Upload (Handles Pathing & Auth Check)
  async upload(file, folder = 'mail') {
    try {
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      if (!user) throw new Error("Auth Required");

      const ext = file.name.split('.').pop();
      const path = `${user.id}/${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const { error } = await window.supabaseClient.storage
        .from(this.bucket)
        .upload(path, file);

      if (error) throw error;

      // Returns the internal path. Use getLink(path) to view.
      return { success: true, path };
    } catch (err) {
      console.error("Upload Error:", err.message);
      return { success: false, error: err.message };
    }
  },

  // 3. Get Temporary Access Link (For Private Folders)
  async getLink(path, expires = 3600) {
    const { data, error } = await window.supabaseClient.storage
      .from(this.bucket)
      .createSignedUrl(path, expires);
    return error ? null : data.signedUrl;
  },

  // 4. Permanent Shred (DB + Physical)
  async shred(messageId, storagePath = null) {
    try {
      // Delete DB record first
      const { error: dbErr } = await window.supabaseClient
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (dbErr) throw dbErr;

      // If physical file exists, remove it
      if (storagePath) {
        await window.supabaseClient.storage.from(this.bucket).remove([storagePath]);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

// Auto-boot sequence
const bootTimer = setInterval(() => {
  if (window.king.init()) clearInterval(bootTimer);
}, 100);

