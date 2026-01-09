/* =============================================
   FIREBASE.JS - Firebase Configuration & Initialization
   ============================================= */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

/* =============================================
   FIREBASE CONFIGURATION
   Replace with your actual Firebase config
   ============================================= */
const firebaseConfig = {
    apiKey: "AIzaSyBN8-fk1vNioM13QCYoHujzbD6Ax4Zb5-U",
  authDomain: "damo-e-commerce-website-6a685.firebaseapp.com",
  projectId: "damo-e-commerce-website-6a685",
  storageBucket: "damo-e-commerce-website-6a685.appspot.com",
  messagingSenderId: "377864917220",
  appId: "1:377864917220:web:8ca3e87c37761bb0b4dcf1"
};

/* =============================================
   INITIALIZE FIREBASE
   ============================================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/* =============================================
   EXPORT FIREBASE SERVICES
   ============================================= */
export { 
    auth, 
    db, 
    storage,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL
};

/* =============================================
   HELPER FUNCTIONS
   ============================================= */

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Check if user is admin
export async function isAdmin(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().role === 'admin';
        }
        return false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Format price
export function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

// Format date
export function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate order ID
export function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Show notification
export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Firebase initialized successfully');
