// src/firebase-config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Firestore example
import { getDatabase } from 'firebase/database';  // Realtime Database example

// Firebase configuration
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAtVdLI2oZYBHhsqdYc1Hs3S8-8-AuD_Mw",
    authDomain: "nnynemb-editor.firebaseapp.com",
    projectId: "nnynemb-editor",
    storageBucket: "nnynemb-editor.firebasestorage.app",
    messagingSenderId: "914615412826",
    appId: "1:914615412826:web:4c4a2982ab7714e6a0d063"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);  // Authentication
const db = getFirestore(app);  // Firestore
const realTimeDB = getDatabase(app);  // Realtime Database

export { auth, db, realTimeDB };
