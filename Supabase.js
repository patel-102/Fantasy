// Load Supabase from CDN
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ===============================
// 🔐 Your Supabase Public Config
// ===============================
const SUPABASE_URL = "https://chqtivbtyixwtsqwezqb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocXRpdmJ0eWl4d3RzcXdlenFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODUwMzQsImV4cCI6MjA4MDc2MTAzNH0.D0f49ElnV894qvnQDPWlSC81g6r3sZ1zJ4DaFhhUyzw";

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
