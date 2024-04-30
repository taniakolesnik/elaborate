import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZg3JHS_BNP53PBUsMd9oDj7bJnI1r6F4",
    authDomain: "elaborate-1fff7.firebaseapp.com",
    projectId: "elaborate-1fff7",
    storageBucket: "elaborate-1fff7.appspot.com",
    messagingSenderId: "463657752185",
    appId: "1:463657752185:web:83f066b66aeed5a23be6a8",
    measurementId: "G-SW371ZQ1EC"
  };

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
  
export { db };