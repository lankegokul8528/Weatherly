import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDVL8cds09TdTcHHRFvQcCb6tRPZcI5v8w",
  authDomain: "weatherly-007.firebaseapp.com",
  projectId: "weatherly-007",
  storageBucket: "weatherly-007.firebasestorage.app",
  messagingSenderId: "162007854580",
  appId: "1:162007854580:web:e99456cedecfe32128dda1",
  measurementId: "G-L1LJFZVGZF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // Export Firestore instance