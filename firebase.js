// =========================================================
// 🔌 Import Supabase client from CDN
// =========================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// =========================================================
// 🔐 Supabase Config
// =========================================================
const SUPABASE_URL = "https://ghxjxziiuxvutevkelet.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeGp4emlpdXh2dXRldmtlbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzY0MjAsImV4cCI6MjA4MDgxMjQyMH0.93O4ROK8G84wYuqfGUrmCxvcA3LvcIRwDoL4SVJv7eE";

const bucketName = "Future";

// Create Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =========================================================
// 🔥 UI Loader Functions
// =========================================================
export function showLoader() {
  const loader = document.getElementById("app-loader");
  if (loader) loader.classList.remove("hidden");
}

export function hideLoader() {
  const loader = document.getElementById("app-loader");
  if (loader) loader.classList.add("hidden");
}

export function updateLoaderProgress(percent) {
  const percentEl = document.getElementById("loader-percent");
  if (percentEl) percentEl.innerText = percent + "%";
}

// =========================================================
// 🚀 Upload With Progress (Supabase Signed URL Upload)
// =========================================================
export async function uploadWithProgress(path, file, onProgress) {
  try {
    // Step 1: Create Signed Upload URL
    const { data: signData, error: signError } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(path);

    if (signError) throw signError;
    if (!signData?.signedUrl || !signData?.token) {
      throw new Error("Failed to receive signed URL and token from Supabase.");
    }

    const { signedUrl, token } = signData;

    // Step 2: Upload using XHR for progress tracking
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);

      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Step 3: Final commit
          const { error: commitError } = await supabase.storage
            .from(bucketName)
            .uploadToSignedUrl(token, path, file, { upsert: true });

          if (commitError) reject(new Error(commitError.message));
          else resolve({ success: true, path });
        } else {
          reject(
            new Error(
              `Upload failed with status ${xhr.status}: ${xhr.responseText}`
            )
          );
        }
      };

      xhr.onerror = () => reject(new Error("Network or Transfer error"));
      xhr.send(file);
    });
  } catch (err) {
    console.error("Supabase Upload Error:", err);
    return { success: false, error: err.message };
  }
}

// =========================================================
// ⭐ Wrapper: Upload Profile Picture
// =========================================================
export async function uploadProfilePicture(userId, file) {
  // Use user ID to ensure path uniqueness
  const filePath = `profile/${userId}/${Date.now()}_${file.name}`; 

  showLoader();

  const result = await uploadWithProgress(filePath, file, (percent) => {
    updateLoaderProgress(percent);
  });

  hideLoader();

  return result;
}

// =========================================================
// ⭐ Firebase Imports (Unified)
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// =========================================================
// ⭐ Firebase Configuration (Unified)
// =========================================================
const firebaseConfig = {
  apiKey: "AIzaSyC-_Fz9GQ5zqj5p_mLLIyQpsq4gyhG_FqI",
  authDomain: "futurex-1e0ae.firebaseapp.com",
  databaseURL: "https://futurex-1e0ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "futurex-1e0ae",
  storageBucket: "futurex-1e0ae.appspot.com",
  messagingSenderId: "872630439870",
  appId: "1:872630439870:web:3c7e98b9157ffa684733ef"
};


// =========================================================
// ⭐ Initialize Firebase App and Export Services (Unified)
// =========================================================
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getDatabase(firebaseApp);
export const firebaseFS = getFirestore(firebaseApp); // Firestore service

// Export helper functions
export { 
  ref, // Realtime DB
  set, // Realtime DB
  doc, // Firestore
  setDoc, // Firestore
  getDoc, // Firestore
  updateDoc, // Firestore
  collection, // Firestore
  addDoc, // Firestore
  query, // Firestore
  where, // Firestore
  getDocs // Firestore
};


// =========================================================
// ⭐ Save Uploaded Image URL to Firebase (Uses firebaseDB)
// =========================================================
export async function saveProfileURL(userId, filePath) {
  const publicURL = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`;

  // Save the URL to Realtime Database
  await set(ref(firebaseDB, `users/${userId}/photoURL`), publicURL); // Changed key to photoURL for consistency

  return publicURL;
}
