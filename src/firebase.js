import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJXVAcwZ5Xdp4P01IOPUitqkL1YO54AXc",
  authDomain: "x-ray-booking-system.firebaseapp.com",
  projectId: "x-ray-booking-system",
  storageBucket: "x-ray-booking-system.firebasestorage.app",
  messagingSenderId: "243527174518",
  appId: "1:243527174518:web:22fd4f7358715f38ef9257",
  measurementId: "G-5PC9LE3RG7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;