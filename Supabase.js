// =========================================================
// 🔌 Import Supabase client from CDN
// =========================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// =========================================================
// 🔐 Supabase Config
// =========================================================
const SUPABASE_URL = "https://czqlzbimlypiaveacped.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cWx6YmltbHlwaWF2ZWFjcGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDY1MDAsImV4cCI6MjA4MDc4MjUwMH0.k-Vp_NL9pQBk1PuZMpdDB54FaWAhEPatGFb3GRhinYU";

// =========================================================
// 🚀 Create Supabase Client
// =========================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const bucketName = "Future";

// =========================================================
// 🔥 UI LOADER HANDLERS
// =========================================================
export function showLoader() {
  document.getElementById("app-loader").classList.remove("hidden");
}

export function hideLoader() {
  document.getElementById("app-loader").classList.add("hidden");
}

export function updateLoaderProgress(percent) {
  document.getElementById("loader-percent").innerText = percent + "%";
}

// =========================================================
// 🚀 Upload With Progress
// =========================================================
export async function uploadWithProgress(path, file, onProgress) {
  try {
    // 1️⃣ Create signed upload URL
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(path);

    if (error) throw error;

    const { signedUrl, token } = data;

    // 2️⃣ Use XHR to send file with progress tracking
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });

      xhr.onload = async () => {
        if (xhr.status === 200) {
          // 3️⃣ Final commit
          await supabase.storage
            .from(bucketName)
            .uploadToSignedUrl(token, path, file, { upsert: true });

          resolve({ success: true, path });
        } else reject(xhr.responseText);
      };

      xhr.onerror = () => reject("Upload failed");
      xhr.send(file);
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
}
