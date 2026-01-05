import { db, auth } from './Firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let cart = [];

// 1. Database se Shoes load karne ka function
async function loadProductsFromDB() {
    const display = document.getElementById('product-display');
    if(!display) return;
    
    display.innerHTML = "<p style='color:white; text-align:center;'>Loading Elite Collection...</p>";

    try {
        // "Product" collection se data mangwana
        const querySnapshot = await getDocs(collection(db, "Product"));
        display.innerHTML = ""; 
        
        querySnapshot.forEach((doc) => {
            const p = doc.data();
            // Har shoe ka card banana
            display.innerHTML += `
                <div class="p-card" onclick="addToBag('${p.name}', ${p.price})">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="p-info">
                        <h4>${p.name}</h4>
                        <p>${p.category || 'Basketball'}</p>
                        <strong>$${p.price}</strong>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Database Error: ", error);
        display.innerHTML = "<p style='color:red;'>Failed to load products. Check Console.</p>";
    }
}

// 2. Cart mein shoe add karne ka function
window.addToBag = function(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    updateSummary();
    
    // Checkout section tak scroll karna
    const checkout = document.getElementById('checkout');
    if(checkout) checkout.scrollIntoView({behavior: 'smooth'});
}

// 3. Bill (Total) update karne ka function
function updateSummary() {
    const list = document.getElementById('cart-items');
    let total = 0;
    list.innerHTML = "";
    cart.forEach(i => {
        total += Number(i.price);
        list.innerHTML += `<p>⚡ ${i.name} - $${i.price}</p>`;
    });
    document.getElementById('grand-total').innerText = "$" + total;
}

// Page load hote hi database se data mangwao
window.onload = loadProductsFromDB;
      
