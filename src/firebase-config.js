// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { getFirestore } from '@firebase/firestore'
import {getStorage} from '@firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDYErlxbG633MNxKS6YRJMkpqVP0fBDl5s",
  authDomain: "chattybox-fec19.firebaseapp.com",
  projectId: "chattybox-fec19",
  storageBucket: "chattybox-fec19.appspot.com",
  messagingSenderId: "251676718375",
  appId: "1:251676718375:web:b577824c3363ca4750a502"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
auth.languageCode = 'it';
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);