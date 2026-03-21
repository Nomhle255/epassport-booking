import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyBPwfyXtG2bI5c4mFkdMFCczGjzx1PJvIg",
  authDomain: "epassport-booking.firebaseapp.com",
  projectId: "epassport-booking",
  storageBucket: "epassport-booking.firebasestorage.app",
  messagingSenderId: "535174493271",
  appId: "1:535174493271:web:7f75751b5f2285c3f51f12",
  measurementId: "G-863VJXVN2T"

};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
