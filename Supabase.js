// =========================================================
// 🔌 Import Supabase client from CDN
// =========================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// =========================================================
// 🔐 Supabase Config
// =========================================================
// NOTE: Ensure these keys are correct for your project. 
// For production, these should ideally be loaded from a secure environment 
// variable or configuration, not hardcoded.
const SUPABASE_URL = "https://paaeauzshsqzgbbbarhb.supabase.co";
const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYWVhdXpzaHNxemdiYmJhcmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjEzNjUsImV4cCI6MjA4MTAzNzM2NX0.5OuGwnO9gBwC-BCZTshxigvvfgWVjFmPdUJX7z1dqZU";
const bucketName = "Future";

// =========================================================
// 🚀 Create Supabase Client (EXPORTED for use in forum.html)
// =========================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// =========================================================
// 🔥 UI LOADER HANDLERS (NOTE: Assumes an element with id="app-loader" exists)
// =========================================================

/** Shows the application-wide loading overlay. */
export function showLoader() {
  const loader = document.getElementById("app-loader");
  if (loader) loader.classList.remove("hidden");
}

/** Hides the application-wide loading overlay. */
export function hideLoader() {
  const loader = document.getElementById("app-loader");
  if (loader) loader.classList.add("hidden");
}

/** Updates the text displaying the loading percentage. */
export function updateLoaderProgress(percent) {
  const percentEl = document.getElementById("loader-percent");
  if (percentEl) percentEl.innerText = percent + "%";
}

// =========================================================
// 🚀 Upload With Progress (Uses XHR for detailed progress tracking)
// =========================================================

/**
 * Uploads a file to Supabase Storage with progress tracking.
 * @param {string} path - The full path/filename for the storage object (e.g., 'avatars/user-id.jpg').
 * @param {File} file - The file object to upload.
 * @param {function(number): void} onProgress - Callback function called with the percentage (0-100).
 * @returns {Promise<{success: boolean, path?: string, error?: string}>}
 */
export async function uploadWithProgress(path, file, onProgress) {
  try {
    // 1️⃣ Create signed upload URL
    const { data: signData, error: signError } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(path);

    if (signError) throw signError;
    if (!signData || !signData.signedUrl || !signData.token) {
        throw new Error("Failed to receive signed URL and token from Supabase.");
    }

    const { signedUrl, token } = signData;

    // 2️⃣ Use XHR to send file with progress tracking
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);

      // Add the required Authorization header for the final commit step
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });

      xhr.onload = async () => {
        // HTTP 200/201 indicates a successful transfer to the signed URL
        if (xhr.status >= 200 && xhr.status < 300) { 
          // 3️⃣ Final commit: Use the token and path to officially commit the upload
          const { error: commitError } = await supabase.storage
            .from(bucketName)
            .uploadToSignedUrl(token, path, file, { upsert: true });

          if (commitError) {
             reject(new Error(`Commit failed: ${commitError.message}`));
          } else {
             resolve({ success: true, path });
          }
        } else {
            // Transfer error
            reject(new Error(`Upload transfer failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network or Transfer error during upload."));
      xhr.send(file);
    });
  } catch (err) {
    console.error("Supabase Upload Error:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
