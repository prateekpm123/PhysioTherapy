// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBPAoo2DaZihmLiIyyC5xBMOsxxMWS5M50",
    authDomain: "physiotherapy-24e38.firebaseapp.com",
    projectId: "physiotherapy-24e38",
    storageBucket: "physiotherapy-24e38.firebasestorage.app",
    messagingSenderId: "899378308952",
    appId: "1:899378308952:web:5d4ce8783561627d8b272d",
    measurementId: "G-F49PS4JQDP"
  };  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export const storage = getStorage(app);