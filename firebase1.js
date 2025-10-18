// firebase2.js — Private Firebase Setup
// Using Firebase v12 modular SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

// 🔹 Private Firebase Config
const firebasePrivateConfig = {
  apiKey: "AIzaSyAcM6iATwM70jFkYXRb6bT7KXLGZrgai6E",
  authDomain: "futurex2-a8030.firebaseapp.com",
  databaseURL: "https://futurex2-a8030-default-rtdb.firebaseio.com",
  projectId: "futurex2-a8030",
  storageBucket: "futurex2-a8030.appspot.com",
  messagingSenderId: "772713861227",
  appId: "1:772713861227:web:ab4cde62c1cc33121a212e"
};

// Initialize with a different unique name
const privateApp = initializeApp(firebasePrivateConfig, "privateApp");

// 🔹 Export Firebase services
export const auth2 = getAuth(privateApp);
export const db2 = getFirestore(privateApp);
export const storage2 = getStorage(privateApp);