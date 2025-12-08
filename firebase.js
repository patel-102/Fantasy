import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3A3UMK41OJa8nB_ZfCDzuuOBnV8GEw44",
  authDomain: "future-7cd4d.firebaseapp.com",
  projectId: "future-7cd4d",
  storageBucket: "future-7cd4d.firebasestorage.app",
  messagingSenderId: "134358915216",
  appId: "1:134358915216:web:72c425a3fac47d5e60a015"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);   // <<--- REALTIME DATABASE
