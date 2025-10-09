import { db } from './firebase.js';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Create user document when a new user registers
export async function createUserProfile(uid, email, displayName = "") {
  const ref = doc(db, "users", uid);
  const payload = {
    uid,
    email: email || "",
    displayName: displayName || "",
    createdAt: serverTimestamp()
  };
  await setDoc(ref, payload, { merge: true });
  return payload;
}

// Get user profile
export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}

// Update user profile fields (e.g., displayName)
export async function updateUserProfile(uid, updates) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, updates);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
