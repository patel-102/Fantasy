import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-_Fz9GQ5zqj5p_mLLIyQpsq4gyhG_FqI",
  authDomain: "futurex-1e0ae.firebaseapp.com",
  databaseURL: "https://futurex-1e0ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "futurex-1e0ae",
  storageBucket: "futurex-1e0ae.firebasestorage.app",
  messagingSenderId: "872630439870",
  appId: "1:872630439870:web:3c7e98b9157ffa684733ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);   // <<--- REALTIME DATABASE
