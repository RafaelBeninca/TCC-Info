import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { setLogLevel } from "firebase/firestore";
// setLogLevel("debug")

const firebaseConfig = {
  databaseURL: "https://tccinfo-82f7e-default-rtdb.firebaseio.com",//import.meta.env.VITE_FIREBASE_DATABASE_URL,
  apiKey: "AIzaSyBg_k99WrFQJH1BTmH5IFnmW-9ELFlAzKE",//import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "tccinfo-82f7e.firebaseapp.com",//import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "tccinfo-82f7e",//import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "tccinfo-82f7e.appspot.com",//import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "90127709635",//import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: "1:90127709635:web:f99143aa015ddd4519b976",//import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-7078SDCDQ6",//import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const auth = getAuth();
// const analytics = getAnalytics(app);
const db = getFirestore(app)

export {app, auth, db, storage}