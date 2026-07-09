// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ecommerce-3-ac730.firebaseapp.com",
  projectId: "ecommerce-3-ac730",
  storageBucket: "ecommerce-3-ac730.firebasestorage.app",
  messagingSenderId: "105155621053",
  appId: "1:105155621053:web:cf460af5a427cdea3787d4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);