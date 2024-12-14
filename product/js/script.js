document.addEventListener('DOMContentLoaded', function() {
    // Animate social media icons on hover
    const socialIcons = document.querySelectorAll('.social-links a');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Update copyright year automatically
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('.nav-item');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const collapseContent = document.getElementById('navbar_supported_content');

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navbarToggler.offsetParent) { 
                new bootstrap.Collapse(collapseContent).toggle();
            }
        });
    });
});

const services = [
{
	"image" : "images/Mangojuice.png",
	"title" : "Mango Juice ",
},
{
	"image" : "images/Avocadojuice.png",
	"title" : "Avocado Juice ",
},
{
	"image" : "images/Soursopjuice.png",
	"title" : "Soursop Juice ",
},
];

function renderServices() {
    const servicesContainer = document.getElementById('services-container');
    let html = '';

    services.forEach(service => {
        html += `
            <div class="col-lg-4 mt-4">
                <a href="product/product.html">
                <div class="card services-text">
                    <div class="card-body">
                    <img class="services-image" src="${service.image}">
                    <h4 style="color: #000000;" class="card-title mt-3">${service.title}</h4>
                    </div>
                </div>  
                </a>
            </div>
        `;
    });

    servicesContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderServices);

let cart = [];
let total = 0;

const products = [
{
    "image" : "../product/images/proMang.png",
    "title" : "Mango Juice",
    "description": "Fresh and sweet mango juice made from ripe mangoes",
    "price": "$4.99"
},
{
    "image" : "../product/images/proAvo.png",
    "title" : "Avocado Juice",
    "description": "Creamy and nutritious avocado juice blend",
    "price": "$5.99"
},
{
    "image" : "../product/images/proSour.png",
    "title" : "Soursop Juice",
    "description": "Exotic soursop juice with a unique tropical taste",
    "price": "$5.99"
},
{
    "image" : "../product/images/proMix.png",
    "title" : "Mix Juice",
    "description": "A refreshing blend of mixed tropical fruits",
    "price": "$6.99"
},
{
    "image" : "../product/images/proCal.png",
    "title" : "Calamity Special",
    "description": "Our signature blend of premium fruits and herbs",
    "price": "$7.99"
},
{
    "image" : "../product/images/proApp.png",
    "title" : "Apple Juice",
    "description": "Pure and refreshing apple juice",
    "price": "$4.99"
},
{
    "image" : "../product/images/proThai.png",
    "title" : "Thailongtea",
    "description": "Authentic Thai tea with a rich, creamy taste",
    "price": "$5.99"
},
{
    "image" : "../product/images/proMonk.png",
    "title" : "Monk Fruit Juice",
    "description": "Naturally sweetened monk fruit juice blend",
    "price": "$6.99"
},
{
    "image" : "../product/images/proHerb.png",
    "title" : "Herbal Green Tea",
    "description": "Healthy blend of green tea and natural herbs",
    "price": "$5.99"
},
];

function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    let html = '';

    products.forEach(product => {
        html += `
            <div class="col-lg-4 mt-4">
                <div class="card services-text" onmouseenter="showPopup(this)" onmouseleave="hidePopup(this)">
                    <div class="card-body">
                        <div class="image-wrapper" style="position: relative;">
                            <img class="services-image" src="${product.image}">
                            <div class="product-popup">
                                <div class="popup-content">
                                    <p>${product.description}</p>
                                    <h4>${product.price}</h4>
                                </div>
                            </div>
                        </div>
                        <h4 style="color: #000000;" class="card-title mt-3">${product.title}</h4>
                        <button class="btn btn-outline-info" onclick="addToCart('${product.title}', '${product.price}', '${product.image}', this)">
                            <i class="fa-solid fa-martini-glass-citrus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    productsContainer.innerHTML = html;
}

function addToCart(title, price, image, button) {
    // Add item to cart array
    const priceNum = parseFloat(price.replace('$', ''));
    const existingItem = cart.find(item => item.title === title);
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
    } else {
        cart.push({ 
            title, 
            price: priceNum, 
            image,
            quantity: 1,
            totalPrice: priceNum
        });
    }
    
    total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Animate cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('cart-animation');
    setTimeout(() => cartIcon.classList.remove('cart-animation'), 500);
    
    // Animate button
    button.classList.add('product-added');
    setTimeout(() => button.classList.remove('product-added'), 500);

    // Update cart items
    updateCartItems();
}

function updateCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-info">
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <span class="cart-item-quantity">x${item.quantity}</span>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(this)">×</button>
        </div>
    `).join('');
    
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(button) {
    const item = button.parentElement;
    const index = Array.from(item.parentElement.children).indexOf(item);
    
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        cart[index].totalPrice = cart[index].price * cart[index].quantity;
    } else {
        cart.splice(index, 1);
    }
    
    total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    updateCartItems();
    
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function showConfirmationPage() {
    const orderConfirmation = document.querySelector('.order-confirmation');
    const orderItems = document.querySelector('.order-items');
    const totalOrders = document.querySelector('.total-orders');
    const tax = document.querySelector('.tax');
    const discount = document.querySelector('.discount');
    const finalTotal = document.querySelector('.final-total');
    
    // Calculate values
    const taxAmount = total * 0.18;
    const discountAmount = (total + taxAmount) * 0.5;
    const grandTotal = total + taxAmount - discountAmount;
    
    // Render order items
    orderItems.innerHTML = cart.map((item, index) => `
        <div class="order-item">
            <div><input type="checkbox" checked></div>
            <div>${index + 1}</div>
            <div class="product-info">
                <img src="${item.image}" alt="${item.title}">
                <span>${item.title}</span>
            </div>
            <div>${item.quantity}</div>
            <div>Rp ${item.price.toFixed(2)}</div>
            <div>Rp ${item.totalPrice.toFixed(2)}</div>
        </div>
    `).join('');
    
    // Update summary
    totalOrders.textContent = `Rp ${total.toFixed(2)}`;
    tax.textContent = `Rp ${taxAmount.toFixed(2)}`;
    discount.textContent = `Rp ${discountAmount.toFixed(2)}`;
    finalTotal.textContent = `Rp ${grandTotal.toFixed(2)}`;
    
    // Show confirmation page
    orderConfirmation.classList.add('active');
}

function hideConfirmationPage() {
    const orderConfirmation = document.querySelector('.order-confirmation');
    orderConfirmation.classList.remove('active');
}

// Cart sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const confirmationBtns = document.querySelectorAll('.confirmation-buttons button');

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);
    
    checkoutBtn.addEventListener('click', () => {
        closeCartSidebar();
        showConfirmationPage();
    });
    
    confirmationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('btn-edit')) {
                hideConfirmationPage();
                openCart();
            } else if (btn.classList.contains('btn-cancel')) {
                hideConfirmationPage();
            } else if (btn.classList.contains('btn-confirm')) {
                // Handle order confirmation
                alert('Order confirmed! Thank you for your purchase.');
                cart = [];
                total = 0;
                updateCartItems();
                document.querySelector('.cart-count').textContent = '0';
                hideConfirmationPage();
            }
        });
    });

    renderProducts();
});

function showPopup(card) {
    const popup = card.querySelector('.product-popup');
    if (popup) {
        popup.style.display = 'block';
    }
}

function hidePopup(card) {
    const popup = card.querySelector('.product-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}