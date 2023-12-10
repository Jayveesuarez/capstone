// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBHQrTqANV6j331DlsTJ_nI5dLDwmzCCqU",
  authDomain: "angkas-ec78f.firebaseapp.com",
  projectId: "angkas-ec78f",
  storageBucket: "angkas-ec78f.appspot.com",
  messagingSenderId: "679380073951",
  appId: "1:679380073951:web:069b7f28a00ca57ac1586a",
  measurementId: "G-Q80ZH5DZPR"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const provider = new GoogleAuthProvider()

export { app, provider, auth, db }
