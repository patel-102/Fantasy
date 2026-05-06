// Import Firebase SDK v12.12.1
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// --- REGISTER FUNCTION ---
window.registerUser = function(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (typeof Android !== 'undefined') {
                // Calls onSuccess in RegisterActivity.java
                Android.onSuccess("Account created: " + email);
            }
        })
        .catch((error) => {
            if (typeof Android !== 'undefined') {
                Android.onError(error.message);
            }
        });
};

// --- LOGIN FUNCTION ---
window.loginUser = function(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (typeof Android !== 'undefined') {
                // Calls onLoginSuccess in LoginActivity.java
                Android.onLoginSuccess("Welcome back: " + email);
            }
        })
        .catch((error) => {
            if (typeof Android !== 'undefined') {
                Android.onLoginError(error.message);
            }
        });
};
