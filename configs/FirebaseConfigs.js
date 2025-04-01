// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Import getAuth
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJymHzaxsSZBiErJj5CsEawvtrz3f1bMk",
  authDomain: "minor-4a596.firebaseapp.com",
  projectId: "minor-4a596",
  storageBucket: "minor-4a596.appspot.com", // ✅ Corrected storage bucket domain
  messagingSenderId: "39932075492",
  appId: "1:39932075492:web:f0769f40c05ab594c73bf1",
  measurementId: "G-PL2NXP5179"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);