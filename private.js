// Example firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

apiKey: "AIzaSyAcM6iATwM70jFkYXRb6bT7KXLGZrgai6E",
  authDomain: "futurex2-a8030.firebaseapp.com",
  databaseURL: "https://futurex2-a8030-default-rtdb.firebaseio.com",
  projectId: "futurex2-a8030",
  storageBucket: "futurex2-a8030.firebasestorage.app",
  messagingSenderId: "772713861227",
  appId: "1:772713861227:web:ab4cde62c1cc33121a212e"


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
