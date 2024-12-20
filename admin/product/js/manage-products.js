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

// Toggle product out_of_order status
async function toggleProductStatus(productTitle, checkbox) {
    try {
        const response = await fetch('/api/products/toggle-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productTitle: productTitle,
                outOfOrder: checkbox.checked
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update product status');
        }

        // Update the UI
        const productCard = checkbox.closest('.product-card');
        if (checkbox.checked) {
            productCard.classList.add('out-of-order');
        } else {
            productCard.classList.remove('out-of-order');
        }
    } catch (error) {
        console.error('Error updating product status:', error);
        // Revert checkbox state on error
        checkbox.checked = !checkbox.checked;
        alert('Failed to update product status. Please try again.');
    }
}

// Render products in the UI
async function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    const products = await fetchProducts();
    
    productsContainer.innerHTML = products.map(product => `
        <div class="col-md-6 col-lg-4">
            <div class="product-card ${product.out_of_order ? 'out-of-order' : ''}">
                <div class="d-flex align-items-center mb-3">
                    <input type="checkbox" 
                           class="status-toggle" 
                           ${product.out_of_order ? 'checked' : ''} 
                           onchange="toggleProductStatus('${product.title}', this)">
                    <h5 class="mb-0">${product.title}</h5>
                </div>
                <div class="d-flex">
                    <img src="${product.image}" alt="${product.title}" class="me-3">
                    <div>
                        <p class="mb-1">${product.description}</p>
                        <p class="mb-0"><strong>Price:</strong> ${product.price}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', renderProducts);
