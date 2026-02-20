/**
 * KING - Centralized Supabase & Storage Engine
 */

const SUPABASE_URL = 'https://bqqrqwihewcpirhtqqde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXJxd2loZXdjcGlyaHRxcWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Njk0MzEsImV4cCI6MjA4NzE0NTQzMX0.XuuUAyyNqCUQWDXB5ejovNahVScB9j4jWw6l9Hjb3ic';

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
  async upload(file, folder = 'general') {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      if (!user) throw new Error("Authentication required for upload.");

      // Create a unique file path: userId/folder/timestamp_random.ext
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileName = `${user.id}/${folder}/${timestamp}_${randomStr}.${fileExt}`;

      const { data, error } = await window.supabase.storage
        .from(this.bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Generate and return the Public URL
      const { data: { publicUrl } } = window.supabase.storage
        .from(this.bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error("👑 KING Storage Error:", err.message);
      return null;
    }
  },

  /**
   * Deletes a file from storage using its Public URL
   * @param {string} url - Full public URL of the image
   */
  async delete(url) {
    try {
      // Extracts the relative path from the full URL by splitting at the bucket name
      const path = url.split(`${this.bucket}/`)[1];
      if (!path) return false;

      const { error } = await window.supabase.storage
        .from(this.bucket)
        .remove([path]);

      return !error;
    } catch (err) {
      console.error("👑 KING Delete Error:", err.message);
      return false;
    }
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
    window.dispatchEvent(new CustomEvent('KingReady'));
    
    console.log("👑 KING: Engine Started & Storage Initialized");
  } catch (error) {
    console.error("👑 KING: Boot Error", error);
  }
};

// Polling to wait for the CDN script to be fully parsed
const checkLibrary = setInterval(() => {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    initSupabase();
    clearInterval(checkLibrary);
  }
}, 50);

