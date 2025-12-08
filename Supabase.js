// =========================================================
// 🔌 Import Supabase client from CDN
// =========================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// =========================================================
// 🔐 Supabase Config
// =========================================================
const SUPABASE_URL = "https://czqlzbimlypiaveacped.supabase.co";

// ❗ DO NOT expose ANON key in production frontend.
// For dev it's okay. Move this to env if possible.
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cWx6YmltbHlwaWF2ZWFjcGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDY1MDAsImV4cCI6MjA4MDc4MjUwMH0.k-Vp_NL9pQBk1PuZMpdDB54FaWAhEPatGFb3GRhinYU";

// =========================================================
// 🚀 Create Supabase Client
// =========================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =========================================================
// 📦 Storage Helpers
// =========================================================
const bucketName = "Future";

// -----------------------------
// 📤 Upload File
// -----------------------------
export async function uploadFile(path, file) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    return { success: true, path: data.path };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// -----------------------------
// 🔗 Create Signed URL
// -----------------------------
export async function getSignedUrl(path, expiresIn = 60) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return { success: true, url: data.signedUrl };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// -----------------------------
// ❌ Delete File
// -----------------------------
export async function deleteFile(path) {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([path]);
    if (error) throw error;

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// -----------------------------
// 📁 List Files in folder
// -----------------------------
export async function listFiles(folder = "") {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder);

    if (error) throw error;

    return { success: true, files: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
