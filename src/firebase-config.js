// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB6YF6QpG7QOSIIZ_x-hu9BJKZ55rRKZ1Y",
  authDomain: "chat-app-3b327.firebaseapp.com",
  projectId: "chat-app-3b327",
  storageBucket: "chat-app-3b327.appspot.com",
  messagingSenderId: "651776899759",
  appId: "1:651776899759:web:20bb4348cb57b49d6fb25a",
  measurementId: "G-Q873F3N760"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = 'it';
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);