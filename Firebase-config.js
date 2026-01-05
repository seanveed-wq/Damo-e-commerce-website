// Firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Replace this with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBN8-fk1vNioM13QCYoHujzbD6Ax4Zb5-U",
  authDomain: "damo-e-commerce-website-6a685.firebaseapp.com",
  projectId: "damo-e-commerce-website-6a685",
  storageBucket: "damo-e-commerce-website-6a685.appspot.com",
  messagingSenderId: "377864917220",
  appId: "1:377864917220:web:8ca3e87c37761bb0b4dcf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
