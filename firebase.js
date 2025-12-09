// Import Firebase SDK (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// Your actual Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC-_Fz9GQ5zqj5p_mLLIyQpsq4gyh_G_FqI",
  authDomain: "futurex-1e0ae.firebaseapp.com",
  databaseURL: "https://futurex-1e0ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "futurex-1e0ae",
  storageBucket: "futurex-1e0ae.appspot.com",
  messagingSenderId: "872630439870",
  appId: "1:872630439870:web:3c7e98b9157ffa684733ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

// Export services
export { auth, db, rtdb, storage };
