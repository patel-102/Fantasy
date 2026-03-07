
/**
 * KING - Centralized Supabase & Storage Engine
 * KING - Centralized Supabase & Multi-Table Storage Engine
 */

const SUPABASE_URL = 'https://usclxowxelrwbymhxdsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2x4b3d4ZWxyd2J5bWh4ZHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk4MDIsImV4cCI6MjA4ODM1NTgwMn0.uGqNEmZMo3zJJRUNZUpXVnDZy_YysVK9M6NJtmGDv_M';

// 1. Dynamic Library Loader: Ensures Supabase is loaded before execution
if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  document.head.appendChild(script);
}

/**
 * Global Storage Controller
 * Centralizes all Bucket operations for the 'king' bucket.
 */
window.kingStorage = {
  bucket: 'king',

  /**
   * Uploads a file to a specific folder
   * @param {File} file - The file object from input
   * @param {string} folder - 'avatars' or 'gallery'
   * @returns {string|null} - The Public URL of the uploaded image
   */
  // 1. Storage Part: Handles physical file uploads
  async upload(file, folder = 'general') {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      if (!user) throw new Error("Authentication required for upload.");
      if (!user) throw new Error("Auth required.");

      // Create a unique file path: userId/folder/timestamp_random.ext
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileName = `${user.id}/${folder}/${timestamp}_${randomStr}.${fileExt}`;
      const fileName = `${user.id}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await window.supabase.storage
        .from(this.bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        .upload(fileName, file);

      if (error) throw error;

      // Generate and return the Public URL
      const { data: { publicUrl } } = window.supabase.storage
        .from(this.bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error("👑 KING Storage Error:", err.message);
      console.error("Storage Error:", err.message);
      return null;
    }
  },

  /**
   * Deletes a file from storage using its Public URL
   * @param {string} url - Full public URL of the image
   */
  async delete(url) {
  // 2. Multi-Table Sync: Saves text to 'profiles' and media to 'profile_media'
  async saveFullProfile(textData, mediaData) {
    try {
      // Extracts the relative path from the full URL by splitting at the bucket name
      const path = url.split(`${this.bucket}/`)[1];
      if (!path) return false;
      const { error } = await window.supabase.storage
        .from(this.bucket)
        .remove([path]);
      return !error;
      const { data: { user } } = await window.supabase.auth.getUser();
      
      // Update Part 1: Profiles (Text/Docs)
      const p1 = window.supabase
        .from('profiles')
        .update(textData)
        .eq('id', user.id);
      // Update Part 2: Profile Media (Links)
      const p2 = window.supabase
        .from('profile_media')
        .update(mediaData)
        .eq('profile_id', user.id);
      const [res1, res2] = await Promise.all([p1, p2]);
      
      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;
      return { success: true };
    } catch (err) {
      console.error("👑 KING Delete Error:", err.message);
      return false;
      console.error("Sync Error:", err.message);
      return { success: false, error: err.message };
    }
  },
  // Helper to fetch joined data
  async getCombinedProfile(targetId) {
    const { data, error } = await window.supabase
      .from('profiles')
      .select(`
        *,
        profile_media (avatar_url, gallery)
      `)
      .eq('id', targetId)
      .single();
    
    return { data, error };
  }
};

/**
 * Initialization Engine
 * Sets up the client and dispatches the Ready event.
 */
const initSupabase = () => {
  try {
    const { createClient } = window.supabase;
    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    };
    // Instantiate Global Client
    window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
    
    // Notify all active pages that Supabase is ready to use
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.dispatchEvent(new CustomEvent('KingReady'));
    
    console.log("👑 KING: Engine Started & Storage Initialized");
    console.log("👑 KING Engine: Triple-Split Architecture Online");
  } catch (error) {
    console.error("👑 KING: Boot Error", error);
    console.error("Boot Error", error);
  }
};

// Polling to wait for the CDN script to be fully parsed
const checkLibrary = setInterval(() => {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
  if (window.supabase?.createClient) {
    initSupabase();
    clearInterval(checkLibrary);
  }
}, 50);