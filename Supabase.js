
/* =========================================================
   🟣 SUPABASE IMPORT
   ========================================================= */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/* =========================================================
   🟣 SUPABASE CONFIG
   ========================================================= */
const SUPABASE_URL = "https://mlnpuxwceqvhldpypeep.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbnB1eHdjZXF2aGxkcHlwZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MDQ4NzMsImV4cCI6MjA4MTE4MDg3M30.mECAhFkUBHsyh7plEgGKTGgAkgHbht7jRnZgFON-zPc";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const bucketName = "Future"; // must match exactly

/* =========================================================
   🚀 SUPABASE UPLOAD – 100% WORKING, CORS SAFE
   ========================================================= */
export async function uploadWithProgress(path, file, onProgress) {
  try {
    const xhr = new XMLHttpRequest();

    // Correct upload URL for Supabase Storage
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucketName}/${path}`;

    xhr.open("POST", uploadUrl);

    // Required headers
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("Apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_ANON_KEY}`);
    xhr.setRequestHeader("x-upsert", "true");

    // Progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
        console.log("📤 Supabase Progress:", pct + "%");
      }
    };

    // Upload handler
    return await new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          console.log("🎉 Supabase Upload Complete");
          resolve({ success: true, path });
        } else {
          console.error("❌ Upload failed:", xhr.responseText);
          reject("Upload failed with status " + xhr.status);
        }
      };

      xhr.onerror = () => reject("❌ XHR upload failed.");
      xhr.send(file);
    });

  } catch (err) {
    console.error("❌ Supabase Upload Error:", err);
    return { success: false, error: err.message };
  }
}
