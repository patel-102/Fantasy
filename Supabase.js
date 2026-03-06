/**
 * 👑 KING ENGINE v2.2 - OPTIMIZED
 * Centralized Supabase Storage + Auth + Media
 * Fix: Global Alias & Async Boot Protection
 */

const SUPABASE_URL = 'https://labfqhcwiukvdxxqpqbw.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // Ensure this is replaced with your actual key

window.king = {
  bucket: 'king',
  client: null,
  isReady: false,

  // =========================
  // INIT ENGINE
  // =========================
  init() {
    // 1. Check if Supabase library is actually loaded in the browser
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      return false; 
    }

    try {
      this.client = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );

      // 2. CRITICAL FIX: Create a global alias for your UI scripts
      window.supabaseClient = this.client; 

      this.isReady = true;
      console.log("👑 KING Engine Online & Global Alias Set");
      
      // Dispatch event for UI listeners
      window.dispatchEvent(new CustomEvent("KingReady"));
      return true;
    } catch (err) {
      console.error("KING Engine Boot Failure:", err.message);
      return false;
    }
  },

  // =========================
  // AUTH HELPERS (Optimized)
  // =========================
  async user() {
    if (!this.client) return null;
    const { data: { user }, error } = await this.client.auth.getUser();
    if (error) return null;
    return user;
  },

  async getSession() {
    if (!this.client) return { data: { session: null } };
    return await this.client.auth.getSession();
  },

  // =========================
  // SECURE FILE UPLOAD
  // =========================
  async upload(file, folder = "mail") {
    try {
      const user = await this.user();
      if (!user) throw new Error("Unauthorized: Identity required");

      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`;
      
      // Pathing: user_id/folder/filename
      const path = `${user.id}/${folder}/${filename}`;

      const { data, error } = await this.client.storage
        .from(this.bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) throw error;

      return {
        success: true,
        path: data.path,
        fullPath: path,
        owner: user.id
      };
    } catch (err) {
      console.error("Upload Failed:", err.message);
      return { success: false, error: err.message };
    }
  },

  // =========================
  // PRIVATE MEDIA LINK
  // =========================
  async getLink(path, expire = 3600) {
    if (!path) return null;
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expire);

    if (error) {
      console.error("Link Generation Error:", error.message);
      return null;
    }
    return data.signedUrl;
  },

  // =========================
  // DELETE FOR EVERYONE (Optimized)
  // =========================
  async deleteForEveryone(messageId) {
    try {
      const user = await this.user();
      if (!user) throw new Error("Auth required");

      // 1. Atomic Fetch
      const { data: msg, error } = await this.client
        .from("messages")
        .select("id, sender_id, receiver_id, media_path")
        .eq("id", messageId)
        .single();

      if (error || !msg) throw new Error("Message not found");

      // 2. Permission Check (Sender or Receiver only)
      if (msg.sender_id !== user.id && msg.receiver_id !== user.id) {
        throw new Error("Permission Denied");
      }

      // 3. Parallel Cleanup
      const tasks = [];
      
      // Remove from Storage
      if (msg.media_path) {
        tasks.push(this.client.storage.from(this.bucket).remove([msg.media_path]));
      }
      
      // Remove from Database
      tasks.push(this.client.from("messages").delete().eq("id", messageId));

      const results = await Promise.all(tasks);
      const hasError = results.some(res => res.error);
      
      if (hasError) throw new Error("Partial deletion failure");

      return { success: true };
    } catch (err) {
      console.error("Purge Error:", err.message);
      return { success: false, error: err.message };
    }
  }
};

// =========================
// SAFE AUTO BOOT SEQUENCE
// =========================
(function() {
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds total

  const KING_BOOT = setInterval(() => {
    attempts++;
    if (window.king.init()) {
      clearInterval(KING_BOOT);
    } else if (attempts >= maxAttempts) {
      clearInterval(KING_BOOT);
      console.error("KING ENGINE: Critical Load Timeout. Check script order.");
    }
  }, 100);
})();

