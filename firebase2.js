<!-- index.html -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

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

  // Ensure Android bridge exists before calling it
  function callAndroid(method, msg) {
    if (window.Android && typeof window.Android[method] === "function") {
      window.Android[method](msg);
    } else {
      console.log("Android bridge not ready:", method, msg);
    }
  }

  // Expose functions to WebView
  window.loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => callAndroid("onLoginSuccess", "Welcome!"))
      .catch(err => callAndroid("onLoginError", err.message));
  };

  window.registerUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => callAndroid("onSuccess", "Account Created!"))
      .catch(err => callAndroid("onError", err.message));
  };

  // Optional: tell Android that JS is ready
  window.addEventListener("load", () => {
    callAndroid("onJsReady", "ready");
  });
</script>