import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_VSDTWYSz-HbVEc8jIiRDgJeTC2v6cNw",
  authDomain: "inter-4fdff.firebaseapp.com",
  projectId: "inter-4fdff",
  storageBucket: "inter-4fdff.firebasestorage.app",
  messagingSenderId: "96590914046",
  appId: "1:96590914046:web:8baffb33be76a5470e60af",
  measurementId: "G-Q8LX2JZCPH"
};

// Initialize Firebase (Singleton pattern to prevent multiple instances)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Prevent `getAnalytics` from running during SSR
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
