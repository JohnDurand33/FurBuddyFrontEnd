// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";
// import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
//     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const storage = getStorage(firebaseApp);
// const auth = getAuth(firebaseApp);
// const googleProvider = new GoogleAuthProvider();

// export { firebaseApp, storage, auth, googleProvider };

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const Firebase = initializeApp(firebaseConfig);
export const auth = getAuth();
export const Providers = { google: new GoogleAuthProvider() };
export const storage = getStorage(Firebase);