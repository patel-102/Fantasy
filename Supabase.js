/* =========================================================
   🔥 FIREBASE IMPORTS
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

/* =========================================================
   🔥 FIREBASE CONFIG
   ========================================================= */
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_KEY",
  authDomain: "future-7cd4d.firebaseapp.com",
  projectId: "future-7cd4d",
  storageBucket: "future-7cd4d.appspot.com",
  messagingSenderId: "134358915216",
  appId: "1:134358915216:web:72c425a3fac47d5e60a015"
};

const firebaseApp = initializeApp(firebaseConfig);
const fbStorage = getStorage(firebaseApp);

/* =========================================================
   📤 FIREBASE UPLOAD (WORKING)
   ========================================================= */
const fileButton = document.getElementById("fileButton");
const uploader = document.getElementById("uploader");

if (fileButton) {
  fileButton.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(fbStorage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (uploader) uploader.value = pct;
        console.log("🔥 Firebase Progress:", pct + "%");
      },
      (err) => console.error("❌ Firebase Error:", err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("✅ Firebase URL:", url);
        });
      }
    );
  });
}

/* =========================================================
   🟣 SUPABASE IMPORT
   ========================================================= */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/* =========================================================
   🟣 SUPABASE CONFIG
   ========================================================= */
const SUPABASE_URL = "https://heukxyddtnqgydxhuwzq.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldWt4eWRkdG5xZ3lkeGh1d3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjYzODAsImV4cCI6MjA4MTA0MjM4MH0.VGSOjh3rp0ZeEH55RaYsRZ--mjyKcYSTNsvmNZQwfDA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const bucketName = "future"; // must match exactly

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
