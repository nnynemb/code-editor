// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAtVdLI2oZYBHhsqdYc1Hs3S8-8-AuD_Mw",
    authDomain: "nnynemb-editor.firebaseapp.com",
    databaseURL: "https://nnynemb-editor-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nnynemb-editor",
    storageBucket: "nnynemb-editor.firebasestorage.app",
    messagingSenderId: "914615412826",
    appId: "1:914615412826:web:4c4a2982ab7714e6a0d063"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
