// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.querySelector('.loading-container');
    const mainContent = document.querySelector('body > *:not(.loading-container)');
    
    // Disable scrolling initially
    document.body.style.overflow = 'hidden';
    
    // Make sure loader is visible and on top
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    
    // Hide all content except loader
    Array.from(document.body.children).forEach(element => {
        if (!element.classList.contains('loading-container')) {
            element.style.opacity = '0';
        }
    });
});

window.addEventListener('load', function() {
    const loader = document.querySelector('.loading-container');
    
    setTimeout(function() {
        // Enable scrolling
        document.body.style.overflow = '';
        
        // Show all content
        Array.from(document.body.children).forEach(element => {
            if (!element.classList.contains('loading-container')) {
                element.style.opacity = '1';
                element.style.transition = 'opacity 0.5s ease-in';
            }
        });
        
        // Hide loader
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }, 3000);
});

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
    const isAdmin = true; // Force admin for testing
    
    let html = `
        <div class="col-12 mb-4 text-end">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addDrinkModal">
                <i class="fas fa-plus"></i> Add New Drinks
            </button>
        </div>
    `;

    products.forEach(product => {
        const isOutOfOrder = product.out_of_order === 1;
        const outOfOrderClass = isOutOfOrder ? 'out-of-order' : '';
        const outOfOrderButtonClass = isOutOfOrder ? 'btn-danger' : 'btn-outline-warning';
        const outOfOrderText = isOutOfOrder ? 'In Stock' : 'Out of Order';

        html += `
            <div class="col-lg-4 mt-4">
                <div class="card services-text ${outOfOrderClass}" onmouseenter="showPopup(this)" onmouseleave="hidePopup(this)">
                    <div class="card-body">
                        <div class="image-wrapper" style="position: relative;">
                            <img class="services-image" src="${product.image}">
                            <div class="product-popup">
                                <div class="popup-content">
                                    <h4>${product.title}</h4>
                                    <p>${product.description}</p>
                                </div>
                            </div>
                        </div>
                        <h4 style="color: #000000;" class="card-title mt-3">${product.title}</h4>
                        <div class="row g-2">
                            <div class="col-8">
                                <button class="btn btn-outline-info w-100" onclick="addToCart('${product.title}', '${product.price}', '${product.image}', this)">
                                    <i class="fa-solid fa-martini-glass-citrus"></i> Add to Cart
                                </button>
                            </div>
                            <div class="col-2">
                                <button class="btn ${outOfOrderButtonClass} w-100" onclick="toggleOutOfOrder('${product.title}', this)">
                                    <i class="fas fa-ban"></i>
                                </button>
                            </div>
                            <div class="col-2">
                                <button class="btn btn-outline-danger w-100" onclick="deleteProduct('${product.title}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
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
    
    // Check if item already exists in cart
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
    
    // Update total
    total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Update cart display
    updateCartItems();

    // Disable the button temporarily and show feedback
    button.disabled = true;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
    }, 500);
}

function updateCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    if (!cartItems || !totalAmount) return;

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
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function showConfirmationPage() {
    const orderConfirmation = document.querySelector('.order-confirmation');
    const orderItems = document.querySelector('.order-items');
    const totalOrders = document.querySelector('.total-orders');
    const tax = document.querySelector('.tax');
    const discount = document.querySelector('.discount');
    const finalTotal = document.querySelector('.final-total');
    
    if (!orderConfirmation || !orderItems) return;

    // Calculate values
    const taxAmount = total * 0.18; // 18% tax
    const discountAmount = (total + taxAmount) * 0.5; // 50% discount
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
    if (orderConfirmation) {
        orderConfirmation.classList.remove('active');
    }
}

function calculateGrandTotal() {
    const taxAmount = total * 0.18; // 18% tax
    const discountAmount = (total + taxAmount) * 0.5; // 50% discount
    return total + taxAmount - discountAmount;
}

// QR Code Functions
function showQRCode() {
    const modal = document.querySelector('.qr-modal');
    const qrAmount = document.getElementById('qr-amount');
    const qrContainer = document.getElementById('qrcode');
    
    if (!modal || !qrAmount || !qrContainer) return;

    // Clear previous QR code
    qrContainer.innerHTML = '';

    // Calculate grand total
    const grandTotal = calculateGrandTotal();
    qrAmount.textContent = grandTotal.toLocaleString('id-ID');

    // Generate QR code
    new QRCode(qrContainer, {
        text: generateOrderId(),
        width: 200,
        height: 200
    });

    // Show modal
    modal.style.display = 'flex';
}

function closeQRModal() {
    const modal = document.querySelector('.qr-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmPayment() {
    // Save order data
    lastOrderData = {
        orderId: generateOrderId(),
        items: cart.map(item => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice
        })),
        total: total,
        tax: total * 0.18,
        discount: (total + (total * 0.18)) * 0.5,
        grandTotal: calculateGrandTotal(),
        date: new Date().toLocaleString(),
        customerInfo: {
            name: "Customer",
            email: "customer@example.com",
            phone: "-"
        }
    };

    // Generate and open invoice
    const queryParams = new URLSearchParams({
        data: JSON.stringify(lastOrderData)
    });
    window.open(`invoice.html?${queryParams.toString()}`, '_blank');
    
    // Clear cart
    cart = [];
    total = 0;
    updateCartItems();
    
    // Hide modals
    hideConfirmationPage();
    closeQRModal();
}

function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV${year}${month}${day}-${random}`;
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
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
}

// Add event listener for the Done button
document.addEventListener('DOMContentLoaded', function() {
    const proceedButton = document.querySelector('.proceed-button');
    if (proceedButton) {
        proceedButton.addEventListener('click', showConfirmationPage);
    }
    
    const confirmButtons = document.querySelectorAll('.confirm-button');
    confirmButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideConfirmationPage();
            showQRCode();
        });
    });
    
    const cancelButtons = document.querySelectorAll('.cancel-button');
    cancelButtons.forEach(button => {
        button.addEventListener('click', hideConfirmationPage);
    });
});

function openCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    cartSidebar.style.right = '0';
    cartOverlay.style.display = 'block';
}

function closeCartSidebar() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    cartSidebar.style.right = '-400px';
    cartOverlay.style.display = 'none';
}

// Add event listeners for cart
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    const closeCart = document.querySelector('.close-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
});

// Add hover effect for product cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => showPopup(card));
        card.addEventListener('mouseleave', () => hidePopup(card));
    });
});

function showPopup(card) {
    const popup = card.querySelector('.product-popup');
    if (popup) {
        popup.style.opacity = '1';
        popup.style.visibility = 'visible';
    }
}

function hidePopup(card) {
    const popup = card.querySelector('.product-popup');
    if (popup) {
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
    }
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-cart-container form');
    const searchInput = searchForm.querySelector('input[type="search"]');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const products = document.querySelectorAll('.card.services-text');

            products.forEach(product => {
                const title = product.querySelector('.card-title').textContent.toLowerCase();
                const description = product.querySelector('.popup-content p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    product.closest('.col-lg-4').style.display = '';
                } else {
                    product.closest('.col-lg-4').style.display = 'none';
                }
            });
        });
    }
});

// Add new drink function
async function addNewDrink(event) {
    event.preventDefault();
    
    const title = document.getElementById('drinkTitle').value;
    const price = document.getElementById('drinkPrice').value;
    const description = document.getElementById('drinkDescription').value;
    const imageFile = document.getElementById('drinkImage').files[0];

    if (!title || !price || !description || !imageFile) {
        alert('Please fill in all fields');
        return;
    }

    // Get file extension
    const fileExt = imageFile.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExt)) {
        alert('Please select a valid image file (JPG, JPEG, or PNG)');
        return;
    }

    // Create image path using original filename
    const imagePath = `../product/images/${imageFile.name}`;

    try {
        console.log('Sending data:', { title, price, description, image: imagePath }); // Debug log

        const response = await fetch('/api/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                price: parseFloat(price), // Convert price to number
                description,
                image: imagePath
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.details || 'Failed to add drink');
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addDrinkModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('addDrinkForm').reset();
        
        // Refresh products
        await renderProducts();
        
        alert('Drink added successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add drink: ' + error.message);
    }
}

// Add event listeners when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const addDrinkForm = document.getElementById('addDrinkForm');
    if (addDrinkForm) {
        addDrinkForm.addEventListener('submit', addNewDrink);
    }
});

// Check if user is admin
async function isAdmin() {
    try {
        const response = await fetch('/api/check-admin');
        const data = await response.json();
        return data.isAdmin;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Delete product function
async function deleteProduct(title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/products/delete/${encodeURIComponent(title)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        // Refresh products list
        await renderProducts();
        alert('Product deleted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete product. Please try again.');
    }
}

// Toggle product out of order status
function toggleOutOfOrder(productTitle, button) {
    fetch(`/api/products/toggle-status/${encodeURIComponent(productTitle)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update button class
            button.classList.toggle('btn-danger');
            button.classList.toggle('btn-outline-warning');
            
            // Update product card
            const card = button.closest('.card');
            if (card) {
                card.classList.toggle('out-of-order');
            }
        } else {
            console.error('Failed to toggle status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Cart sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const confirmationBtns = document.querySelectorAll('.confirmation-buttons button');

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.style.right = '0';
            cartOverlay.style.display = 'block';
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            cartOverlay.style.display = 'none';
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            cartOverlay.style.display = 'none';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showConfirmationPage();
            cartSidebar.style.right = '-400px';
            cartOverlay.style.display = 'none';
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
                cartSidebar.style.right = '0';
                cartOverlay.style.display = 'block';
            }
        });
    });
});

let lastOrderData = null;