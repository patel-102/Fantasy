// Use the Compatibility Script for WebView Stability
const firebaseConfig = {
  apiKey: "AIzaSyAAxA2Paas-tT0R2SHcoHZWmX_IaT92CsA",
  authDomain: "moon-2263a.firebaseapp.com",
  projectId: "moon-2263a",
  storageBucket: "moon-2263a.firebasestorage.app",
  messagingSenderId: "6395103280",
  appId: "1:6395103280:web:f4a0f0141936dc968805f5"
};

// Initialize Firebase using the global window object
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

window.registerUser = function(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then(function(user) { Android.onSuccess("Success!"); })
        .catch(function(error) { Android.onError(error.message); });
};

window.loginUser = function(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(function(user) { Android.onLoginSuccess("Welcome!"); })
        .catch(function(error) { Android.onLoginError(error.message); });
};
