/* =============================================
   MAIN.JS - Global JavaScript Functions
   ============================================= */

import { auth, onAuthStateChanged } from './firebase.js';

/* =============================================
   DOM ELEMENTS
   ============================================= */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const cartCount = document.getElementById('cartCount');
const userBtn = document.getElementById('userBtn');

/* =============================================
   MOBILE MENU TOGGLE
   ============================================= */
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

/* =============================================
   SEARCH MODAL
   ============================================= */
if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
    });
}

if (closeSearch) {
    closeSearch.addEventListener('click', () => {
        searchModal.classList.remove('active');
    });
}

if (searchModal) {
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
        }
    });
}

/* =============================================
   CART MANAGEMENT
   ============================================= */

// Get cart from localStorage
export function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
export function addToCart(product, size, quantity = 1) {
    const cart = getCart();
    
    // Check if product with same size already exists
    const existingItem = cart.find(item => 
        item.id === product.id && item.size === size
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity,
            category: product.category
        });
    }
    
    saveCart(cart);
    return true;
}

// Remove item from cart
export function removeFromCart(productId, size) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart(cart);
}

// Update item quantity
export function updateCartItemQuantity(productId, size, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId && item.size === size);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

// Clear cart
export function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

// Calculate cart total
export function calculateCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.085; // 8.5% tax
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Update cart count in navbar
export function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

/* =============================================
   AUTH STATE MANAGEMENT
   ============================================= */
onAuthStateChanged(auth, (user) => {
    if (userBtn) {
        if (user) {
            // User is signed in
            userBtn.href = 'profile.html';
            userBtn.title = 'My Profile';
        } else {
            // User is signed out
            userBtn.href = 'login.html';
            userBtn.title = 'Login';
        }
    }
});

/* =============================================
   WISHLIST MANAGEMENT
   ============================================= */

// Get wishlist from localStorage
export function getWishlist() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

// Save wishlist to localStorage
export function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Add to wishlist
export function addToWishlist(productId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist(wishlist);
        return true;
    }
    return false;
}

// Remove from wishlist
export function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist(wishlist);
}

// Check if product is in wishlist
export function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/* =============================================
   INITIALIZE ON PAGE LOAD
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!e.target.closest('.nav-wrapper')) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        }
    });
});

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */

// Format currency
export function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show loading
export function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading">Loading...</div>';
    }
}

// Hide loading
export function hideLoading(element) {
    if (element) {
        const loading = element.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }
}

console.log('Main.js loaded successfully');
