import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTmFX50hEV3uCCD8BHcONfUPvDCr9pGxQ",
  authDomain: "legapro-93f13.firebaseapp.com",
  projectId: "legapro-93f13",
  storageBucket: "legapro-93f13.firebasestorage.app",
  messagingSenderId: "520453436213",
  appId: "1:520453436213:web:cd5c9bf1b2ace0ed07527c",
  measurementId: "G-MRQ5RZH5R2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
