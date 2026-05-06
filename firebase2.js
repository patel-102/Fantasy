import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAxA2Paas-tT0R2SHcoHZWmX_IaT92CsA",
  authDomain: "moon-2263a.firebaseapp.com",
  projectId: "moon-2263a",
  storageBucket: "moon-2263a.firebasestorage.app",
  messagingSenderId: "6395103280",
  appId: "1:6395103280:web:f4a0f0141936dc968805f5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.registerUser = function(email, password) {
    console.log("Attempting Register...");
    createUserWithEmailAndPassword(auth, email, password)
        .then((user) => { Android.onSuccess("Success!"); })
        .catch((error) => { Android.onError(error.message); });
};

window.loginUser = function(email, password) {
    console.log("Attempting Login...");
    signInWithEmailAndPassword(auth, email, password)
        .then((user) => { Android.onLoginSuccess("Welcome!"); })
        .catch((error) => { Android.onLoginError(error.message); });
};
