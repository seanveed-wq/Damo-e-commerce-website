// script.js
import { db } from './Firebase-config.js';
import {
  collection,
  getDocs,
  addDoc,
  // you can add editing/removing later
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let cart = [];
let currentCategory = "All";

const display = document.getElementById("product-display");
const cartSidebar = document.getElementById("cart-sidebar");

// Load products
async function loadProducts() {
  const snap = await getDocs(collection(db, "Product"));
  display.innerHTML = "";
  snap.forEach(doc => {
    const p = doc.data();
    if (currentCategory === "All" || p.category === currentCategory) {
      display.innerHTML += `
      <div class="p-card" onclick="addToBag('${p.name}', ${p.price})">
        <img src="${p.img}" alt="${p.name}">
        <div class="p-info">
          <h4>${p.name}</h4>
          <strong>$${p.price}</strong>
          <small>${p.category}</small>
        </div>
      </div>`;
    }
  });
}

// Category filter
window.filterCategory = (cat) => {
  currentCategory = cat;
  // toggle active class on buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === cat || (cat === 'All' && btn.textContent === 'All'));
  });
  loadProducts();
};

// Cart functions
window.addToBag = (name, price) => {
  cart.push({ name, price });
  updateCartCount();
  updateSummary();
  openCart();
};

function updateCartCount() {
  document.getElementById('cart-count').innerText = cart.length;
}

function updateSummary() {
  const list = document.getElementById('cart-items');
  let total = 0;
  list.innerHTML = "";
  cart.forEach(item => {
    total += Number(item.price);
    list.innerHTML += `<p>⚡ ${item.name} - $${item.price}</p>`;
  });
  document.getElementById('grand-total').innerText = "$" + total;
}

function openCart() {
  cartSidebar.classList.add('open');
}
window.toggleCart = () => {
  cartSidebar.classList.toggle('open');
}

window.orderNow = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  // For a more professional setup, save orders to Firestore here.
  alert("Order confirmed! COD");
  cart = [];
  updateCartCount();
  updateSummary();
  toggleCart();
};

// Optional: contact form simple behavior
const cForm = document.getElementById('contact-form');
if (cForm) {
  cForm.addEventListener('submit', e => {
    e.preventDefault();
    alert("Thank you! Message sent.");
    cForm.reset();
  });
}

// Initial load
loadProducts();
