// Check login status and handle redirection
function checkLoginStatus() {
    // Check if user is logged in by looking for the token cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    const userRole = document.cookie.split('; ').find(row => row.startsWith('userRole='));
    
    // Get the referrer (previous page)
    const referrer = document.referrer;
    
    if (!token || !userRole) {
        if (referrer.includes('index.html')) {
            // Coming from index.html - allow access and enable checkout
            const checkoutBtn = document.querySelector('.checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.style.opacity = '1';
                checkoutBtn.removeAttribute('title');
            }
        } else if (!referrer.includes('new-user.html')) {
            // Not from index or new-user - redirect to new-user
            window.location.href = '../new-user.html';
        } else {
            // From new-user - disable checkout
            const checkoutBtn = document.querySelector('.checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.title = 'Please log in to checkout';
            }
        }
    } else {
        // User is logged in
        if (referrer.includes('new-user.html')) {
            // If coming from new-user.html, redirect to index
            window.location.href = '../index.html';
        }
        
        // Enable checkout functionality for logged-in users
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.removeAttribute('title');
        }
    }
}

// Call checkLoginStatus when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);

document.addEventListener('DOMContentLoaded', function() {
    // Prevent search form submission
    const searchForm = document.querySelector('.search-cart-container form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your search logic here
        });
    }

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

// Fetch products from the server
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Render products in the UI
async function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    const products = await fetchProducts();
    let html = '';

    products.forEach(product => {
        const isOutOfOrder = product.out_of_order === 1;
        const buttonClass = isOutOfOrder ? 'btn btn-danger' : 'btn btn-outline-info';
        const buttonText = isOutOfOrder ? 'Out of Order' : '<i class="fa-solid fa-martini-glass-citrus"></i> Add to Cart';

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
                        <button class="${buttonClass}" onclick="${isOutOfOrder ? '' : `addToCart('${product.title}', '${product.price}', '${product.image}', this)`}">
                            ${buttonText}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    productsContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProducts);

let cart = [];
let total = 0;

function addToCart(title, price, image, button) {
    // Add item to cart array
    const priceNum = parseFloat(price.replace('Rp ', '').replace('.', ''));
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
                    <span class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</span>
                    <span class="cart-item-quantity">x${item.quantity}</span>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(this)">×</button>
        </div>
    `).join('');
    
    totalAmount.textContent = `Rp ${total.toLocaleString('id-ID')}`;
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
    const discountAmount = (total + taxAmount) * 0.5; // 50% discount
    const grandTotal = calculateGrandTotal();
    
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
            <div>Rp ${item.price.toLocaleString('id-ID')}</div>
            <div>Rp ${item.totalPrice.toLocaleString('id-ID')}</div>
        </div>
    `).join('');
    
    // Update summary
    totalOrders.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    tax.textContent = `Rp ${taxAmount.toLocaleString('id-ID')}`;
    discount.textContent = `Rp ${discountAmount.toLocaleString('id-ID')}`;
    finalTotal.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
    
    // Show confirmation page
    orderConfirmation.classList.add('active');
}

function hideConfirmationPage() {
    const orderConfirmation = document.querySelector('.order-confirmation');
    orderConfirmation.classList.remove('active');
}

function calculateGrandTotal() {
    const taxAmount = total * 0.18;
    const discountAmount = (total + taxAmount) * 0.5; // 50% discount
    return total + taxAmount - discountAmount;
}

// QR Code Functions
function showQRCode() {
    const qrModal = document.querySelector('.qr-modal');
    const grandTotal = calculateGrandTotal();
    document.getElementById('qr-amount').textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
    qrModal.style.display = 'flex';

    // Generate QR Code
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ''; // Clear previous QR code
    
    new QRCode(qrContainer, {
        text: `https://example.com/pay/${grandTotal}`,
        width: 200,
        height: 200
    });
}

function closeQRModal() {
    const qrModal = document.querySelector('.qr-modal');
    qrModal.style.display = 'none';
}

function confirmPayment() {
    // Store the order data before clearing cart
    lastOrderData = {
        orderId: generateOrderId(),
        items: [...cart],
        total: total,
        tax: total * 0.18,
        discount: (total + (total * 0.18)) * 0.5,
        grandTotal: calculateGrandTotal()
    };

    // Set order ID and show thank you modal
    document.getElementById('order-id').textContent = lastOrderData.orderId;
    showThankYouModal();
    closeQRModal();
    hideConfirmationPage();
    
    // Clear cart
    cart = [];
    updateCartItems();
    document.querySelector('.cart-count').textContent = '0';
}

// Add event listeners for QR modal
document.addEventListener('DOMContentLoaded', function() {
    const closeQRBtn = document.querySelector('.close-qr');
    const confirmPaymentBtn = document.querySelector('.confirm-payment-btn');
    
    if (closeQRBtn) {
        closeQRBtn.addEventListener('click', closeQRModal);
    }
    
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', confirmPayment);
    }
});

function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`;
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Add event listener for the Done button
document.addEventListener('DOMContentLoaded', function() {
    const proceedButton = document.querySelector('.proceed-button');
    if (proceedButton) {
        proceedButton.addEventListener('click', function() {
            const qrModal = document.querySelector('.qr-modal');
            qrModal.style.display = 'none';
            // Clear cart after payment
            cart = [];
            updateCartItems();
            document.querySelector('.cart-count').textContent = '0';
            hideConfirmationPage();
        });
    }
});

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
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showConfirmationPage();
            closeCartSidebar();
        });
    }

    confirmationBtns.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-confirm')) {
                showQRCode();
            } else if (this.classList.contains('btn-cancel')) {
                hideConfirmationPage();
            } else if (this.classList.contains('btn-edit')) {
                hideConfirmationPage();
                openCart();
            }
        });
    });
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

function generateOrderId() {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
}

function showThankYouModal() {
    const thankYouModal = document.querySelector('.thank-you-modal');
    const orderId = generateOrderId();
    document.getElementById('order-id').textContent = orderId;
    thankYouModal.style.display = 'flex';
}

function closeThankYouModal() {
    const thankYouModal = document.querySelector('.thank-you-modal');
    thankYouModal.style.display = 'none';
}

let lastOrderData = null;

function generateInvoice() {
    if (!lastOrderData) return;
    
    // Create URL with order data
    const params = new URLSearchParams();
    params.append('data', encodeURIComponent(JSON.stringify(lastOrderData)));
    
    // Open invoice in new tab
    window.open(`invoice.html?${params.toString()}`, '_blank');
}

// Add event listeners for thank you modal
document.addEventListener('DOMContentLoaded', function() {
    const closeThankYouBtns = document.querySelectorAll('.close-thank-you, .close-thank-you-btn');
    const downloadInvoiceBtn = document.querySelector('.download-invoice-btn');
    
    closeThankYouBtns.forEach(btn => {
        btn.addEventListener('click', closeThankYouModal);
    });
    
    if (downloadInvoiceBtn) {
        downloadInvoiceBtn.addEventListener('click', generateInvoice);
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', async function() {
    const searchForm = document.querySelector('.search-cart-container form');
    const searchInput = searchForm.querySelector('input[type="search"]');
    let allProducts = [];

    // Load all products initially
    try {
        allProducts = await fetchProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }

    // Handle search
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterProducts(searchInput.value);
    });

    searchInput.addEventListener('input', function() {
        filterProducts(this.value);
    });

    function filterProducts(searchTerm) {
        const productsContainer = document.getElementById('products-container');
        searchTerm = searchTerm.toLowerCase().trim();

        let filteredProducts = allProducts;
        if (searchTerm !== '') {
            filteredProducts = allProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        let html = '';
        filteredProducts.forEach(product => {
            const isOutOfOrder = product.out_of_order === 1;
            const buttonClass = isOutOfOrder ? 'btn btn-danger' : 'btn btn-outline-info';
            const buttonText = isOutOfOrder ? 'Out of Order' : '<i class="fa-solid fa-martini-glass-citrus"></i> Add to Cart';

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
                            <button class="${buttonClass}" onclick="${isOutOfOrder ? '' : `addToCart('${product.title}', '${product.price}', '${product.image}', this)`}">
                                ${buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        if (filteredProducts.length === 0) {
            html = '<div class="col-12 text-center"><p>No products found</p></div>';
        }

        productsContainer.innerHTML = html;
    }
});