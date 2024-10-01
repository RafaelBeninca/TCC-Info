import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBg_k99WrFQJH1BTmH5IFnmW-9ELFlAzKE",
  authDomain: "tccinfo-82f7e.firebaseapp.com",
  databaseURL: "https://tccinfo-82f7e-default-rtdb.firebaseio.com",
  projectId: "tccinfo-82f7e",
  storageBucket: "tccinfo-82f7e.appspot.com",
  messagingSenderId: "90127709635",
  appId: "1:90127709635:web:f99143aa015ddd4519b976",
  measurementId: "G-7078SDCDQ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export {app, auth, db}