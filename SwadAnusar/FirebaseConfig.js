// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALMMs85m1Y1_JPfF-LudyyGEn2h6yRY-c",
  authDomain: "swad-anusar.firebaseapp.com",
  projectId: "swad-anusar",
  storageBucket: "swad-anusar.appspot.com", // Changed to standard format
  messagingSenderId: "69748885362",
  appId: "1:69748885362:web:75d7acba691e90019dffeb",
  measurementId: "G-E8312J24LX"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

// Optional: Enable persistence for Firestore
async function enableFirestorePersistence() {
  try {
    await enableIndexedDbPersistence(FIREBASE_DB);
    console.log("Firestore persistence enabled");
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable persistence.");
    }
  }
}

// Call this if you want offline persistence
// enableFirestorePersistence();

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE };