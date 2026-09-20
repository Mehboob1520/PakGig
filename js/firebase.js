/* PakGig — Firebase setup (single place for your config)
   These values are NOT secret; security comes from Authentication + Firestore rules (see firestore.rules). */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyC-LIs3mU7VV5RLnd6Rcs1dQ6_sTrmwyvw",
  authDomain: "pakgig.firebaseapp.com",
  projectId: "pakgig",
  storageBucket: "pakgig.firebasestorage.app",
  messagingSenderId: "514548687774",
  appId: "1:514548687774:web:2bb8190255f32d3c2e6c8f",
  measurementId: "G-DF2T7BLRH3"
};

export const isConfigured = !Object.values(firebaseConfig).some((v) => String(v).includes("PASTE_"));

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
