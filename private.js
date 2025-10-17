import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo6Sz7bIhdYPFKxpy---q8_s0m__GN3_E",
  authDomain: "system-2-2c3c4.firebaseapp.com",
  databaseURL: "https://system-2-2c3c4-default-rtdb.firebaseio.com",
  projectId: "system-2-2c3c4",
  storageBucket: "system-2-2c3c4.appspot.com",
  messagingSenderId: "308422442069",
  appId: "1:308422442069:web:eed6c628239ffed3dd68dc",
  measurementId: "G-6EP3E503HX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
