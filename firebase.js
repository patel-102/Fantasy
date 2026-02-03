// Import Firebase SDK (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgauezxBjk7w6hf_gNvv0O2xGBB7yNdTk",
    authDomain: "myshop-4a2f3.firebaseapp.com",
    projectId: "myshop-4a2f3",
    storageBucket: "myshop-4a2f3.firebasestorage.app",
    messagingSenderId: "732248120499",
    appId: "1:732248120499:web:73809ec93ba0f530b1a4c6"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Export services
export { auth, db, rtdb };
