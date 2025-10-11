import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCS4-Oc9jeWaQGQMRYoIL_2y2O5nrKZ6gM",
  authDomain: "fantasy-41fc9.firebaseapp.com",
  projectId: "fantasy-41fc9",
  storageBucket: "fantasy-41fc9.appspot.com",
  messagingSenderId: "431557761003",
  appId: "1:431557761003:web:375881a847d1d8b9506bae"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
