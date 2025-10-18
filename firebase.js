// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// --- Primary Firebase Project (Public) ---
const firebaseConfigPublic = {
  apiKey: "AIzaSyAQLK28ZvU2L09u1OIHlBlrGZZ7TPXEF8g",
  authDomain: "futurex-9a2e9.firebaseapp.com",
  projectId: "futurex-9a2e9",
  storageBucket: "futurex-9a2e9.appspot.com",
  messagingSenderId: "82126141815",
  appId: "1:82126141815:web:20fcd85f32feac7553c972"
};

// --- Secondary Firebase Project (Private) ---
const firebaseConfigPrivate = {
  apiKey: "AIzaSyAcM6iATwM70jFkYXRb6bT7KXLGZrgai6E",
  authDomain: "futurex2-a8030.firebaseapp.com",
  databaseURL: "https://futurex2-a8030-default-rtdb.firebaseio.com",
  projectId: "futurex2-a8030",
  storageBucket: "futurex2-a8030.appspot.com",
  messagingSenderId: "772713861227",
  appId: "1:772713861227:web:ab4cde62c1cc33121a212e"
};

// --- Initialize both Firebase apps ---
const publicApp = initializeApp(firebaseConfigPublic, "publicApp");
const privateApp = initializeApp(firebaseConfigPrivate, "privateApp");

// --- Export Public Firebase Services ---
export const publicAuth = getAuth(publicApp);
export const publicDB = getFirestore(publicApp);
export const publicStorage = getStorage(publicApp);

// --- Export Private Firebase Services ---
export const privateAuth = getAuth(privateApp);
export const privateDB = getFirestore(privateApp);
export const privateStorage = getStorage(privateApp);
