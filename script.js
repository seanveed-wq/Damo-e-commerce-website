let cart = [];

function loadProducts() {
    const container = document.getElementById('product-display');
    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p style="color:var(--secondary); font-weight:900; margin:10px 0;">$${p.price}.00</p>
                <button class="buy-btn" onclick="addToCart(${p.id})">Add to Bag</button>
            </div>
        `;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
    
    // Smooth Redirect to Payment Section
    document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' });
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartList = document.getElementById('cart-list');
    let total = 0;
    
    cartList.innerHTML = "";
    cart.forEach(item => {
        total += item.price;
        cartList.innerHTML += `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${item.name}</span><span>$${item.price}</span>
        </div>`;
    });
    
    document.getElementById('grand-total').innerText = `$${total}.00`;
}

function confirmOrder() {
    if(cart.length === 0) return alert("Bag is empty!");
    alert("🚀 ORDER SUCCESSFUL!\nPayment Method: Cash on Delivery\nOur team will contact you shortly.");
    cart = [];
    updateUI();
    window.scrollTo({top: 0, behavior: 'smooth'});
}

window.onload = loadProducts;
