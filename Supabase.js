/**
 * KING - Centralized Supabase & Multi-Table Storage Engine
 * Updated for Private Folders & Permanent Deletion
 */

const SUPABASE_URL = 'https://bqqrqwihewcpirhtqqde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXJxd2loZXdjcGlyaHRxcWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Njk0MzEsImV4cCI6MjA4NzE0NTQzMX0.XuuUAyyNqCUQWDXB5ejovNahVScB9j4jWw6l9Hjb3ic';

window.kingStorage = {
  bucket: 'king',

  // 1. Private Upload: Saves to [user_id]/[folder]/[filename]
  async upload(file, folder = 'mail') {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      if (!user) throw new Error("Auth required.");

      const fileExt = file.name.split('.').pop();
      // Pathing: UserID/Folder/Timestamp_Random.ext
      const filePath = `${user.id}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await window.supabase.storage
        .from(this.bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = window.supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      return { url: publicUrl, path: filePath }; // Return path for future deletion
    } catch (err) {
      console.error("Storage Error:", err.message);
      return null;
    }
  },

  // 2. Permanent Delete: Removes from DB and physical Storage
  async shredMessage(messageId, storagePath = null) {
    try {
      // Step A: Remove physical file if path exists
      if (storagePath) {
        await window.supabase.storage
          .from(this.bucket)
          .remove([storagePath]);
      }

      // Step B: Remove DB Record
      const { error } = await window.supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Shred Error:", err.message);
      return { success: false };
    }
  },

  async saveFullProfile(textData, mediaData) {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      const p1 = window.supabase.from('profiles').update(textData).eq('id', user.id);
      const p2 = window.supabase.from('profile_media').update(mediaData).eq('profile_id', user.id);
      const [res1, res2] = await Promise.all([p1, p2]);
      if (res1.error || res2.error) throw new Error("Sync Failed");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

// Initialization Logic
const initSupabase = () => {
  try {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.dispatchEvent(new CustomEvent('KingReady'));
    console.log("👑 KING Engine: Secure Storage & Shredding Online");
  } catch (error) {
    console.error("Boot Error", error);
  }
};

// Wait for CDN script to load
const checkLibrary = setInterval(() => {
  if (window.supabase?.createClient) {
    initSupabase();
    clearInterval(checkLibrary);
  }
}, 50);

