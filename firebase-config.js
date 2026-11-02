
/* ==========================================
   ALFRED AUTOMOTIVE
   FIREBASE CONFIGURATION
========================================== */

// Firebase App
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

// Firebase Authentication
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Firebase Firestore Database
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase Analytics
import {
    getAnalytics,
    isSupported
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyBL1VEo142E-694msGG97PMdC0vVB0Kwc8",
    authDomain: "mywebsite123-123.firebaseapp.com",
    projectId: "mywebsite123-123",
    storageBucket: "mywebsite123-123.firebasestorage.app",
    messagingSenderId: "833556534310",
    appId: "1:833556534310:web:d4c55904d3da48436602e7",
    measurementId: "G-TEZJW8L0G6"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

export const app = initializeApp(firebaseConfig);


// ==========================================
// INITIALIZE AUTHENTICATION
// ==========================================

export const auth = getAuth(app);


// ==========================================
// INITIALIZE CLOUD FIRESTORE
// ==========================================

export const db = getFirestore(app);


// ==========================================
// INITIALIZE ANALYTICS
// ==========================================

export let analytics = null;

isSupported()
    .then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
            console.info("Firebase Analytics initialized.");
        } else {
            console.info(
                "Firebase Analytics is not supported in this browser."
            );
        }
    })
    .catch((error) => {
        console.warn(
            "Firebase Analytics could not initialize:",
            error
        );
    });


// ==========================================
// FIREBASE CONNECTION MESSAGE
// ==========================================

console.info("ALFRED Firebase initialized.");
console.info("Cloud Firestore initialized.");
console.info("Firebase Authentication initialized.");
