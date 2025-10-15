import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
import { getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";

const firebaseConfig = {
  apiKey: "AIzaSyAQLK28ZvU2L09u1OIHlBlrGZZ7TPXEF8g",
  authDomain: "futurex-9a2e9.firebaseapp.com",
  projectId: "futurex-9a2e9",
  storageBucket: "futurex-9a2e9.appspot.com",
  messagingSenderId: "82126141815",
  appId: "1:82126141815:web:20fcd85f32feac7553c972"
};
const db = getFirestore();
export const cleanupOldMessages = onSchedule("every 1 hours", async () => {
  const cutoff = Date.now() - 12 * 60 * 60 * 1000; // 12 hours
  const snapshot = await db.collection("messages").where("timestamp", "<", new Date(cutoff)).get();
  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`Deleted ${snapshot.size} expired messages.`);
});
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
