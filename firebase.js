// =========================================================
// ⭐ Firebase Imports (Unified)
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { // Added Firestore imports
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// =========================================================
// ⭐ Firebase Configuration (Unified)
// =========================================================
const firebaseConfig = {
  apiKey: "AIzaSyC-_Fz9GQ5zqj5p_mLLIyQpsq4gyhG_FqI",
  authDomain: "futurex-1e0ae.firebaseapp.com",
  databaseURL: "https://futurex-1e0ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "futurex-1e0ae",
  storageBucket: "futurex-1e0ae.appspot.com", // Used the correct storageBucket
  messagingSenderId: "872630439870",
  appId: "1:872630439870:web:3c7e98b9157ffa684733ef"
};


// =========================================================
// ⭐ Initialize Firebase App and Export Services (Unified)
// =========================================================
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getDatabase(firebaseApp);
export const firebaseFS = getFirestore(firebaseApp); // Firestore service

// Export helper functions
export { 
  ref, 
  set, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
};
