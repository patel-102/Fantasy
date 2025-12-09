// =========================================================
// ⭐ Firebase Imports
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import {
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
// ⭐ Supabase Imports
// =========================================================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.44.0/dist/module/supabase-js.mjs";


// =========================================================
// ⭐ Firebase Config
// =========================================================
const firebaseConfig = {
  apiKey: "AIzaSyC-_Fz9GQ5zqj5p_mLLIyQpsq4gyhG_FqI",
  authDomain: "futurex-1e0ae.firebaseapp.com",
  databaseURL: "https://futurex-1e0ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "futurex-1e0ae",
  messagingSenderId: "872630439870",
  appId: "1:872630439870:web:3c7e98b9157ffa684733ef"
};


// =========================================================
// ⭐ Supabase Config
// =========================================================
const SUPABASE_URL = "https://ghxjxziiuxvutevkelet.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeGp4emlpdXh2dXRldmtlbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzY0MjAsImV4cCI6MjA4MDgxMjQyMH0.93O4ROK8G84wYuqfGUrmCxvcA3LvcIRwDoL4SVJv7eE";

export const bucketName = "Future";


// =========================================================
// ⭐ Initialize Firebase & Supabase
// =========================================================
const firebaseApp = initializeApp(firebaseConfig);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// =========================================================
// ⭐ Export Firebase Services
// =========================================================
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getDatabase(firebaseApp);
export const firebaseFS = getFirestore(firebaseApp);


// =========================================================
// ⭐ Export Supabase Services
// =========================================================
export const supabaseClient = supabase;
export const supabaseStorage = supabase.storage;


// =========================================================
// ⭐ Re-export Firebase helpers
// =========================================================
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
