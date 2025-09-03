// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "shelter-33d11.firebaseapp.com",
  databaseURL: "https://shelter-33d11-default-rtdb.firebaseio.com",
  projectId: "shelter-33d11",
  storageBucket: "shelter-33d11.firebasestorage.app",
  messagingSenderId: "949363239239",
  appId: "1:949363239239:web:f3506e5ecbb36c4b36c462",
  measurementId: "G-JQG6VFE6GW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);