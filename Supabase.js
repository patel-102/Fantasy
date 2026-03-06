/**
 * 👑 KING ENGINE v2.1
 * Centralized Supabase Storage + Auth
 * Private Mail Media System
 */

const SUPABASE_URL = 'https://labfqhcwiukvdxxqpqbw.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

window.king = {

  bucket: 'king',
  client: null,

  // =========================
  // INIT ENGINE
  // =========================
  init() {

    if (!window.supabase?.createClient) {
      console.error("Supabase not loaded");
      return false;
    }

    this.client = supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );

    console.log("👑 KING Engine Online");
    window.dispatchEvent(new CustomEvent("KingReady"));
    return true;
  },


  // =========================
  // AUTH USER
  // =========================
  async user() {
    const { data } = await this.client.auth.getUser();
    return data.user;
  },


  // =========================
  // SECURE FILE UPLOAD
  // =========================
  async upload(file, folder = "mail") {

    try {

      const user = await this.user();
      if (!user) throw new Error("Login required");

      const ext = file.name.split('.').pop();

      const filename =
        Date.now() +
        "_" +
        crypto.randomUUID().slice(0, 8) +
        "." +
        ext;

      const path = `${user.id}/${folder}/${filename}`;

      const { error } = await this.client.storage
        .from(this.bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) throw error;

      return {
        success: true,
        path,
        owner: user.id
      };

    } catch (err) {

      console.error("Upload Failed:", err.message);

      return {
        success: false,
        error: err.message
      };

    }
  },


  // =========================
  // PRIVATE MEDIA LINK
  // =========================
  async getLink(path, expire = 3600) {

    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expire);

    if (error) return null;

    return data.signedUrl;
  },


  // =========================
  // DELETE FOR EVERYONE
  // =========================
  async deleteForEveryone(messageId) {

    try {

      const user = await this.user();
      if (!user) throw new Error("Auth required");

      // fetch message
      const { data: msg, error } = await this.client
        .from("messages")
        .select("id, sender_id, receiver_id, media_path")
        .eq("id", messageId)
        .single();

      if (error) throw error;

      if (
        msg.sender_id !== user.id &&
        msg.receiver_id !== user.id
      ) {
        throw new Error("Not allowed");
      }

      // delete storage file
      if (msg.media_path) {
        await this.client.storage
          .from(this.bucket)
          .remove([msg.media_path]);
      }

      // delete message record
      const { error: dbError } = await this.client
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (dbError) throw dbError;

      return { success: true };

    } catch (err) {

      return {
        success: false,
        error: err.message
      };

    }

  }

};


// =========================
// AUTO BOOT
// =========================

const KING_BOOT = setInterval(() => {

  if (window.king.init()) {
    clearInterval(KING_BOOT);
  }

}, 100);
