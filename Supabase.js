// Load Supabase from CDN
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ===============================
// 🔐 Your Supabase Public Config
// ===============================
const SUPABASE_URL = "https://czqlzbimlypiaveacped.supabase.co";
const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cWx6YmltbHlwaWF2ZWFjcGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDY1MDAsImV4cCI6MjA4MDc4MjUwMH0.k-Vp_NL9pQBk1PuZMpdDB54FaWAhEPatGFb3GRhinYU";

// ===============================
// 🚀 Create Supabase Client
// ===============================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// 📦 Storage Helper Functions
// ===============================

// Upload file to a bucket
export async function uploadFile(bucket, path, file) {
  return await supabase.storage.from(bucket).upload(path, file, { upsert: true });
}

// Get public URL of a file
export function getPublicUrl(bucket, path) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

// Delete file
export async function deleteFile(bucket, path) {
  return await supabase.storage.from(bucket).remove([path]);
}

// List files in folder
export async function listFiles(bucket, folder) {
  return await supabase.storage.from(bucket).list(folder);
}
