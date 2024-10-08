import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDs03lvgxfWoPgqK2rnOQYvqXm2AITDI8s",
    authDomain: "health-charity-website.firebaseapp.com",
    projectId: "health-charity-website",
    storageBucket: "health-charity-website.appspot.com",
    messagingSenderId: "496053558128",
    appId: "1:496053558128:web:1c062d5a1cbc60e6e1cdb5",
    measurementId: "G-292PD3LR5D"
};

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export const auth = firebase.auth();