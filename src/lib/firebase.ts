import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJNnssDjKbztqNlwvz5fyk3XXGpRPvBcY",
  authDomain: "intelligent-planet.firebaseapp.com",
  projectId: "intelligent-planet",
  storageBucket: "intelligent-planet.firebasestorage.app",
  messagingSenderId: "576055382292",
  appId: "1:576055382292:web:ea551c81219f274587b201",
  measurementId: "G-2F9RQX2D2F",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Long polling fixes “hanging / stuck” Firestore requests in some environments.
 * If you later confirm everything is stable, you can switch back to getFirestore(app).
 */
export const db =
  typeof window !== "undefined"
    ? initializeFirestore(app, { experimentalForceLongPolling: true })
    : getFirestore(app);
