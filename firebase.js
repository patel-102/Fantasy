// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { 
  getAuth as getAuth1, 
  getFirestore as getFirestore1, 
  getStorage as getStorage1 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase.js";

import { 
  getAuth as getAuth2, 
  getFirestore as getFirestore2, 
  getStorage as getStorage2 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase.js";

/* 
------------------------------------------------------------
  🔹 PUBLIC FIREBASE PROJECT (Main app for dashboard & users)
------------------------------------------------------------
*/
const publicConfig = {
  apiKey: "AIzaSyAQLK28ZvU2L09u1OIHlBlrGZZ7TPXEF8g",
  authDomain: "futurex-9a2e9.firebaseapp.com",
  projectId: "futurex-9a2e9",
  storageBucket: "futurex-9a2e9.appspot.com",
  messagingSenderId: "82126141815",
  appId: "1:82126141815:web:20fcd85f32feac7553c972"
};

// Initialize Public Firebase app
const publicApp = initializeApp(publicConfig, "publicApp");

// Export public Firebase services
export const publicAuth = getAuth1(publicApp);
export const publicDB = getFirestore1(publicApp);
export const publicStorage = getStorage1(publicApp);

/* 
------------------------------------------------------------
  🔒 PRIVATE FIREBASE PROJECT (1/1 chat, private messages)
------------------------------------------------------------
*/
const privateConfig = {
  apiKey: "AIzaSyAcM6iATwM70jFkYXRb6bT7KXLGZrgai6E",
  authDomain: "futurex2-a8030.firebaseapp.com",
  databaseURL: "https://futurex2-a8030-default-rtdb.firebaseio.com",
  projectId: "futurex2-a8030",
  storageBucket: "futurex2-a8030.firebasestorage.app",
  messagingSenderId: "772713861227",
  appId: "1:772713861227:web:ab4cde62c1cc33121a212e"
};

// Initialize Private Firebase app
const privateApp = initializeApp(privateConfig, "privateApp");

// Export private Firebase services
export const privateAuth = getAuth2(privateApp);
export const privateDB = getFirestore2(privateApp);
export const privateStorage = getStorage2(privateApp);

/* 
------------------------------------------------------------
  ✅ USAGE EXAMPLES:
------------------------------------------------------------

  // For Public (Global)
  import { publicDB, publicAuth } from './firebase.js';
  const user = await createUserWithEmailAndPassword(publicAuth, email, password);

  // For Private (1:1 Chat)
  import { privateDB } from './firebase.js';
  await setDoc(doc(privateDB, "privateChats", chatId), { ... });
------------------------------------------------------------
*/
