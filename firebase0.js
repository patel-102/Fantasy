// firebase.js — Public Firebase Setup
// Using Firebase v12 modular SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

// 🔹 Public Firebase Config
const firebasePublicConfig = {
  apiKey: "AIzaSyAQLK28ZvU2L09u1OIHlBlrGZZ7TPXEF8g",
  authDomain: "futurex-9a2e9.firebaseapp.com",
  projectId: "futurex-9a2e9",
  storageBucket: "futurex-9a2e9.appspot.com",
  messagingSenderId: "82126141815",
  appId: "1:82126141815:web:20fcd85f32feac7553c972"
};

// Initialize with a unique name to avoid clashes
const publicApp = initializeApp(firebasePublicConfig, "publicApp");

// 🔹 Export Firebase services
export const auth = getAuth(publicApp);
export const db = getFirestore(publicApp);
export const storage = getStorage(publicApp);