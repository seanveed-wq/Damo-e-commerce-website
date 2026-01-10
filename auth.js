/* =============================================
   AUTH.JS - Authentication Management
   ============================================= */

import { 
    auth, 
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from './firebase.js';
import { showNotification } from './firebase.js';

/* =============================================
   LOGIN PAGE
   ============================================= */
if (window.location.pathname.includes('login.html')) {
    initLoginPage();
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const authMessage = document.getElementById('authMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                showNotification('Login successful!', 'success');
                
                // Check for redirect parameter
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                
                setTimeout(() => {
                    window.location.href = redirect ? `${redirect}.html` : 'index.html';
                }, 1000);
                
            } catch (error) {
                console.error('Login error:', error);
                showMessage(getErrorMessage(error.code), 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        });
    }
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                
                // Create user document if it doesn't exist
                await createUserDocument(user);
                
                showNotification('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } catch (error) {
                console.error('Google login error:', error);
                showMessage(getErrorMessage(error.code), 'error');
            }
        });
    }
    
    function showMessage(message, type) {
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = `auth-message ${type}`;
            authMessage.style.display = 'block';
        }
    }
}

/* =============================================
   REGISTER PAGE
   ============================================= */
if (window.location.pathname.includes('register.html')) {
    initRegisterPage();
}

function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    const googleRegisterBtn = document.getElementById('googleRegisterBtn');
    const authMessage = document.getElementById('authMessage');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            const registerBtn = document.getElementById('registerBtn');
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showMessage('Please accept the terms and conditions', 'error');
                return;
            }
            
            registerBtn.disabled = true;
            registerBtn.textContent = 'Creating account...';
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Update profile with name
                await updateProfile(user, {
                    displayName: name
                });
                
                // Create user document
                await createUserDocument(user);
                
                showNotification('Account created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } catch (error) {
                console.error('Registration error:', error);
                showMessage(getErrorMessage(error.code), 'error');
                registerBtn.disabled = false;
                registerBtn.textContent = 'Create Account';
            }
        });
    }
    
    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                
                await createUserDocument(user);
                
                showNotification('Account created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } catch (error) {
                console.error('Google registration error:', error);
                showMessage(getErrorMessage(error.code), 'error');
            }
        });
    }
    
    function showMessage(message, type) {
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = `auth-message ${type}`;
            authMessage.style.display = 'block';
        }
    }
}

/* =============================================
   PROFILE PAGE
   ============================================= */
if (window.location.pathname.includes('profile.html')) {
    initProfilePage();
}

function initProfilePage() {
    const authPrompt = document.getElementById('authPrompt');
    const profileSection = document.querySelector('.profile-section');
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if (authPrompt) authPrompt.style.display = 'none';
            if (profileSection) profileSection.style.display = 'block';
            
            loadUserProfile(user);
            loadUserOrders(user.uid);
            
        } else {
            if (authPrompt) authPrompt.style.display = 'flex';
            if (profileSection) profileSection.style.display = 'none';
        }
    });
    
    // Tab navigation
    const tabLinks = document.querySelectorAll('.profile-nav-link');
    const tabs = document.querySelectorAll('.profile-tab');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.dataset.tab;
            
            if (!tabName) return;
            
            tabLinks.forEach(l => l.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            link.classList.add('active');
            const targetTab = document.getElementById(`${tabName}Tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
    
    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                showNotification('Logged out successfully', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Error logging out', 'error');
            }
        });
    }
    
    // Account form handler
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const user = auth.currentUser;
            if (!user) return;
            
            const name = document.getElementById('profileName').value;
            const phone = document.getElementById('profilePhone').value;
            
            try {
                await updateProfile(user, {
                    displayName: name
                });
                
                await setDoc(doc(db, 'users', user.uid), {
                    name: name,
                    phone: phone
                }, { merge: true });
                
                showNotification('Profile updated successfully!', 'success');
            } catch (error) {
                console.error('Profile update error:', error);
                showNotification('Error updating profile', 'error');
            }
        });
    }
}

/* =============================================
   LOAD USER PROFILE
   ============================================= */
async function loadUserProfile(user) {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userInitialsElement = document.getElementById('userInitials');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    
    if (userNameElement) {
        userNameElement.textContent = user.displayName || 'User';
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = user.email;
    }
    
    if (userInitialsElement) {
        const initials = user.displayName 
            ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
            : user.email[0].toUpperCase();
        userInitialsElement.textContent = initials;
    }
    
    if (profileNameInput) {
        profileNameInput.value = user.displayName || '';
    }
    
    if (profileEmailInput) {
        profileEmailInput.value = user.email;
    }
    
    // Load additional user data from Firestore
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (profilePhoneInput && userData.phone) {
                profilePhoneInput.value = userData.phone;
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

/* =============================================
   LOAD USER ORDERS
   ============================================= */
async function loadUserOrders(userId) {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    try {
        // Since orders might not exist in Firestore yet, show sample data
        const sampleOrders = [
            {
                id: 'ORD-12345',
                date: new Date(),
                status: 'delivered',
                total: 89.99,
                items: [
                    { name: 'Classic Running Shoes', quantity: 1, price: 89.99 }
                ]
            }
        ];
        
        if (sampleOrders.length === 0) {
            ordersList.innerHTML = '<p>No orders yet.</p>';
            return;
        }
        
        ordersList.innerHTML = sampleOrders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status ${order.status}">${order.status}</div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<p>Error loading orders.</p>';
    }
}

/* =============================================
   CREATE USER DOCUMENT
   ============================================= */
async function createUserDocument(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                name: user.displayName || '',
                email: user.email,
                role: 'customer',
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error creating user document:', error);
    }
}

/* =============================================
   ERROR MESSAGE HANDLER
   ============================================= */
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Operation not allowed',
        'auth/weak-password': 'Password is too weak (minimum 6 characters)',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later',
        'auth/network-request-failed': 'Network error. Please check your connection'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

console.log('Auth.js loaded successfully');
