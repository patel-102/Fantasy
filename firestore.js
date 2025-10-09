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


// -------------------- Chat helpers --------------------
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

/**
 * sendMessage(payload)
 * payload: { uid, text, displayName, photoURL }
 */
export async function sendMessage(payload) {
  const col = collection(db, "messages");
  await addDoc(col, {
    uid: payload.uid,
    text: payload.text,
    displayName: payload.displayName || null,
    photoURL: payload.photoURL || null,
    createdAt: serverTimestamp()
  });
}

/**
 * listenMessages(callback)
 * subscribes to latest messages (limit 200) and calls callback for each new message
 */
export function listenMessages(callback) {
  const q = query(collection(db, "messages"), orderBy("createdAt"), limit(200));
  const unsub = onSnapshot(q, (snap) => {
    // clear and send all for simplicity
    document.getElementById('messages').innerHTML = '';
    snap.forEach(doc => {
      const data = doc.data();
      callback({ id: doc.id, ...data });
    });
  });
  return unsub;
}

/**
 * listUsers()
 * returns array of user profiles from 'users' collection
 */
export async function listUsers() {
  const col = collection(db, "users");
  const snaps = await getDocs(col);
  const arr = [];
  snaps.forEach(d => arr.push({ uid: d.id, ...d.data() }));
  return arr;
}

/**
 * getUserById(uid)
 */
export async function getUserById(uid) {
  return await getUserProfile(uid); // uses existing function in file
}
