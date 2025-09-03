// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-2f481.firebaseapp.com",
  projectId: "mern-estate-2f481",
  storageBucket: "mern-estate-2f481.appspot.com",
  messagingSenderId: "508294994456",
  appId: "1:508294994456:web:356408f9c81ecba9d5c16d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);