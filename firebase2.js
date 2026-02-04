// Import Firebase SDK (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAxA2Paas-tT0R2SHcoHZWmX_IaT92CsA",
  authDomain: "moon-2263a.firebaseapp.com",
  projectId: "moon-2263a",
  storageBucket: "moon-2263a.firebasestorage.app",
  messagingSenderId: "6395103280",
  appId: "1:6395103280:web:f4a0f0141936dc968805f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Export services
export { auth, db, rtdb };
