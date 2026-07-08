import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx_9uSJmE0sQ02EKUPa0f8FcPTf6LLGtw",
  authDomain: "aireportgenrator.firebaseapp.com",
  projectId: "aireportgenrator",
  storageBucket: "aireportgenrator.firebasestorage.app",
  messagingSenderId: "195686243319",
  appId: "1:195686243319:web:41f4ad98a3e0c9c0fd6cf2",
  measurementId: "G-MRY1484W99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authenticate anonymously immediately
signInAnonymously(auth).catch((error) => {
  console.error("Firebase Anonymous Auth failed:", error);
});

export default app;
