import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvq4Dna2lLcxT_K4T2bH5UoE_S3ojGgTM",
  authDomain: "london-x-rays.firebaseapp.com",
  projectId: "london-x-rays",
  storageBucket: "london-x-rays.firebasestorage.app",
  messagingSenderId: "164051064622",
  appId: "1:164051064622:web:e9bbba86ba7645a0564cbf",
  measurementId: "G-MQVNQ31B75"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;