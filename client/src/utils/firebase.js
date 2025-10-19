// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskmanager-de40c.firebaseapp.com",
  projectId: "taskmanager-de40c",
  storageBucket: "taskmanager-de40c.firebasestorage.app",
  messagingSenderId: "1090518056397",
  appId: "1:1090518056397:web:72083a5947a40f15cad884"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);