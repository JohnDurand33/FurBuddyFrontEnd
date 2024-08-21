import { initializeApp, getStorage } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyChuUW0G-sc0dzg90PvcipwYzPs4v_y9XU",
    authDomain: "furbuddy-b79c3.firebaseapp.com",
    projectId: "furbuddy-b79c3",
    storageBucket: "furbuddy-b79c3.appspot.com",
    messagingSenderId: "310547829146",
    appId: "1:310547829146:web:fb9e016fcea5038239ea23",
    measurementId: "G-Q7J0399752",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { firebaseApp, storage, auth, googleProvider };