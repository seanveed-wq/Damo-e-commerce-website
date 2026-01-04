// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhkAK_nInQsjiw5xn-oIhXSQLEF16mRWo",
  authDomain: "website-1a304.firebaseapp.com",
  projectId: "website-1a304",
  storageBucket: "website-1a304.firebasestorage.app",
  messagingSenderId: "952343359450",
  appId: "1:952343359450:web:dcf0d553bd780eea505ae3",
  measurementId: "G-04YE09J0G6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
