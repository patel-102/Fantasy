import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAftYyISYOLUVI7X5mLrYQOBGpSNOBgD7M",
    authDomain: "moon-4fe47.firebaseapp.com",
    projectId: "moon-4fe47",
    storageBucket: "moon-4fe47.firebasestorage.app",
    messagingSenderId: "948677739672",
    appId: "1:948677739672:web:26921c43fb6731cb737ced"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Export services
export { auth, db, rtdb };