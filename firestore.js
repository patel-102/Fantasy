import { db, storage } from './firebase.js';
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

// 🧩 Create a user document when a new user registers
export async function createUserProfile(uid, email, displayName = "") {
  const refUser = doc(db, "users", uid);
  const payload = {
    uid,
    email: email || "",
    displayName: displayName || "",
    photoURL: "",
    gender: "",
    bio: "",
    createdAt: serverTimestamp()
  };
  await setDoc(refUser, payload, { merge: true });
  return payload;
}

// 📖 Get user profile
export async function getUserProfile(uid) {
  const refUser = doc(db, "users", uid);
  const snap = await getDoc(refUser);
  if (!snap.exists()) return null;
  return snap.data();
}

// ✏️ Update user profile fields (e.g., displayName, gender, bio)
export async function updateUserProfile(uid, updates) {
  const refUser = doc(db, "users", uid);
  await setDoc(refUser, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
  const snap = await getDoc(refUser);
  return snap.exists() ? snap.data() : null;
}

// 🖼️ Upload profile photo to Firebase Storage and return URL
export async function uploadProfilePhoto(uid, file) {
  const photoRef = ref(storage, `profile_photos/${uid}_${Date.now()}.jpg`);
  await uploadBytes(photoRef, file);
  const url = await getDownloadURL(photoRef);

  // Save photoURL to Firestore immediately after upload
  await updateUserProfile(uid, { photoURL: url });
  return url;
}
