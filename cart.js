/* =============================================
   CART.JS - Shopping Cart Management
   ============================================= */

import { 
    getCart, 
    saveCart, 
    removeFromCart, 
    updateCartItemQuantity,
    calculateCartTotal,
    formatCurrency,
    clearCart
} from './main.js';
import { auth, onAuthStateChanged } from './firebase.js';
import { showNotification } from './firebase.js';

/* =============================================
   CART PAGE INITIALIZATION
   ============================================= */
if (window.location.pathname.includes('cart.html')) {
    initCartPage();
}

function initCartPage() {
    displayCartItems();
    updateCartSummary();
    
    // Checkout button handler
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            // Check if user is logged in
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    window.location.href = 'checkout.html';
                } else {
                    showNotification('Please login to checkout', 'error');
                    setTimeout(() => {
                        window.location.href = 'login.html?redirect=checkout';
                    }, 1500);
                }
            });
        });
    }
}

/* =============================================
   DISPLAY CART ITEMS
   ============================================= */
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cart = getCart();
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        if (emptyCart) {
            emptyCart.style.display = 'block';
        }
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    cartItemsContainer.style.display = 'flex';
    if (emptyCart) {
        emptyCart.style.display = 'none';
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='images/products/shoe1.jpg'">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <div class="cart-item-details">
                    <p>Size: ${item.size}</p>
                    <p>Category: ${item.category}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', '${item.size}', ${item.quantity - 1})">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', '${item.size}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem('${item.id}', '${item.size}')">
                        Remove
                    </button>
                </div>
            </div>
            <div class="cart-item-price">
                <div class="current-price">${formatCurrency(item.price * item.quantity)}</div>
                <div class="unit-price">${formatCurrency(item.price)} each</div>
            </div>
        </div>
    `).join('');
}

/* =============================================
   UPDATE CART SUMMARY
   ============================================= */
function updateCartSummary() {
    const totals = calculateCartTotal();
    
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = formatCurrency(totals.subtotal);
    if (shippingElement) shippingElement.textContent = formatCurrency(totals.shipping);
    if (taxElement) taxElement.textContent = formatCurrency(totals.tax);
    if (totalElement) totalElement.textContent = formatCurrency(totals.total);
}

/* =============================================
   UPDATE ITEM QUANTITY
   ============================================= */
window.updateQuantity = function(productId, size, newQuantity) {
    if (newQuantity < 1) {
        if (confirm('Remove this item from cart?')) {
            removeItem(productId, size);
        }
        return;
    }
    
    if (newQuantity > 10) {
        showNotification('Maximum quantity is 10', 'error');
        return;
    }
    
    updateCartItemQuantity(productId, size, newQuantity);
    displayCartItems();
    updateCartSummary();
    showNotification('Quantity updated', 'success');
};

/* =============================================
   REMOVE ITEM FROM CART
   ============================================= */
window.removeItem = function(productId, size) {
    removeFromCart(productId, size);
    displayCartItems();
    updateCartSummary();
    showNotification('Item removed from cart', 'success');
};

console.log('Cart.js loaded successfully');
