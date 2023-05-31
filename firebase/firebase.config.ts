import { initializeApp } from "firebase/app";
import  {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDji1j6DJN_7qmf0H7J3yBkyAHaHAr288k",
  authDomain: "house-marketplace-7c620.firebaseapp.com",
  projectId: "house-marketplace-7c620",
  storageBucket: "house-marketplace-7c620.appspot.com",
  messagingSenderId: "1023028555824",
  appId: "1:1023028555824:web:916845686baf7d526bfdf5"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db,auth};