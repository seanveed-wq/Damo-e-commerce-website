<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA6GabKbTOKrF5do3O_KVqHi_S7lqq7nas",
    authDomain: "website-83fc1.firebaseapp.com",
    projectId: "website-83fc1",
    storageBucket: "website-83fc1.firebasestorage.app",
    messagingSenderId: "732646646510",
    appId: "1:732646646510:web:25aa2b8b68265f4751c9ff",
    measurementId: "G-7N6DYXSZ9J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
