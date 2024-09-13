// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUQI8TIJP0U4tSWzCVGP_tGGPqVt6AEpo",
    authDomain: "vue-firebase-auth-w7-e8b7b.firebaseapp.com",
    projectId: "vue-firebase-auth-w7-e8b7b",
    storageBucket: "vue-firebase-auth-w7-e8b7b.appspot.com",
    messagingSenderId: "579432180968",
    appId: "1:579432180968:web:696576b8775cf05d7d2d5d"
  };  
  
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);
export default db;