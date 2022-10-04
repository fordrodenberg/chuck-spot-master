// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCW8KvtGYLTLNg8p4PqbZRcIChsLPU0zWE",
    authDomain: "chuck-spot.firebaseapp.com",
    projectId: "chuck-spot",
    storageBucket: "chuck-spot.appspot.com",
    messagingSenderId: "1058164991309",
    appId: "1:1058164991309:web:7bff5b7e4e2a003db34304"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);



export const storage = getStorage(app);
export const db = getFirestore();
