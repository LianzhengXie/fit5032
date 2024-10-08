// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMDjQNeNyiY_cL56SlaDsg3VRI54Tq594",
    authDomain: "health-charity-website-a761c.firebaseapp.com",
    projectId: "health-charity-website-a761c",
    storageBucket: "health-charity-website-a761c.appspot.com",
    messagingSenderId: "763169968626",
    appId: "1:763169968626:web:f66167223d28e83da29b6b"
  };
  
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);
export default db;