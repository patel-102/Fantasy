// Import Firebase SDK (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Your actual Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA3A3UMK41OJa8nB_ZfCDzuuOBnV8GEw44",
  authDomain: "future-7cd4d.firebaseapp.com",
  projectId: "future-7cd4d",
  messagingSenderId: "134358915216",
  appId: "1:134358915216:web:72c425a3fac47d5e60a015"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Export services
export { auth, db, rtdb };
