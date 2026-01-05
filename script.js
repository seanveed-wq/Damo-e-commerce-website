import { db, auth } from './Firebase-config.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let cart = [];

// 1. Database se Shoes load karna
async function loadProductsFromDB() {
    const display = document.getElementById('product-display');
    if(!display) return;
    
    display.innerHTML = "<p style='color:white; text-align:center;'>Loading Elite Collection...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "Product"));
        display.innerHTML = ""; 
        
        querySnapshot.forEach((doc) => {
            const p = doc.data();
            display.innerHTML += `
                <div class="p-card" onclick="addToBag('${p.name}', ${p.price})">
                    <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Image+Error'">
                    <div class="p-info">
                        <h4>${p.name}</h4>
                        <strong>$${p.price}</strong>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Database Error: ", error);
    }
}

// 2. Naya Product add karne ka function (Customize Option)
window.addNewProduct = async function() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;

    if(!name || !price || !img) return alert("Please fill all fields!");

    try {
        await addDoc(collection(db, "Product"), {
            name: name,
            price: Number(price),
            img: img,
            category: "Basketball"
        });
        alert("Shoe added successfully!");
        location.reload(); 
    } catch (e) {
        alert("Error! Check if you are signed in.");
    }
}

// 3. Cart Logic
window.addToBag = function(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    updateSummary();
    document.getElementById('checkout').scrollIntoView({behavior: 'smooth'});
}

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

window.onload = loadProductsFromDB;
