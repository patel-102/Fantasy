// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1270K5HA3GnbizEfmQ4e65VbMJSlH1gY",
  authDomain: "private-5b36a.firebaseapp.com",
  databaseURL: "https://private-5b36a-default-rtdb.firebaseio.com",
  projectId: "private-5b36a",
  storageBucket: "private-5b36a.firebasestorage.app",
  messagingSenderId: "929389405583",
  appId: "1:929389405583:web:277f2ac3d5bc7ee543d7fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for other scripts
export { app, auth, db, storage };