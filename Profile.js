import { db, storage, auth } from './firebase.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// 🔹 Function to upload a profile image and save URL to Firestore
async function uploadProfilePhoto(file) {
  try {
    // Ensure a user is logged in
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first!");
      return;
    }

    // Reference to Firebase Storage
    const fileRef = ref(storage, `profile_photos/${user.uid}.jpg`);

    // Upload the file
    await uploadBytes(fileRef, file);

    // Get the public URL
    const downloadURL = await getDownloadURL(fileRef);

    // Save the photo URL to Firestore
    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, {
      photoURL: downloadURL,
      updatedAt: serverTimestamp()
    }, { merge: true });

    alert("✅ Profile photo uploaded successfully!");
    console.log("Photo URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("❌ Upload error:", error);
    alert("Upload failed: " + error.message);
  }
}

// 🔹 Function to load a user’s profile photo
async function loadProfilePhoto(imgElement) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().photoURL) {
      imgElement.src = userDoc.data().photoURL;
    } else {
      imgElement.src = "default-avatar.png"; // fallback
    }
  } catch (error) {
    console.error("❌ Error loading photo:", error);
  }
}

// 🔹 Example usage (in HTML file)
document.getElementById("photoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    await uploadProfilePhoto(file);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const profileImg = document.getElementById("profileImage");
  loadProfilePhoto(profileImg);
});
