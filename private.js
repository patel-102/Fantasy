// private.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// 🔒 Private Chat Firebase configuration
// Replace the values below with your new Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyAcM6iATwM70jFkYXRb6bT7KXLGZrgai6E",
  authDomain: "futurex2-a8030.firebaseapp.com",
  databaseURL: "https://futurex2-a8030-default-rtdb.firebaseio.com",
  projectId: "futurex2-a8030",
  storageBucket: "futurex2-a8030.firebasestorage.app",
  messagingSenderId: "772713861227",
  appId: "1:772713861227:web:ab4cde62c1cc33121a212e"
};

// ✅ Initialize Firebase for Private Chat
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export for other scripts (chat, inbox, etc.)
export { app, auth, db, storage };
