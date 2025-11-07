import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQLK28ZvU2L09u1OIHlBlrGZZ7TPXEF8g",
  authDomain: "futurex-9a2e9.firebaseapp.com",
  databaseURL: "https://futurex-9a2e9-default-rtdb.firebaseio.com",
  projectId: "futurex-9a2e9",
  storageBucket: "futurex-9a2e9.firebasestorage.app",
  messagingSenderId: "82126141815",
  appId: "1:82126141815:web:20fcd85f32feac7553c972"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
