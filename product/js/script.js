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
                        <img class="services-image" src="${product.image}">
                        <h4 style="color: #000000;" class="card-title mt-3">${product.title}</h4>
                        <a class="btn btn-outline-info" href="#">
                            <i class="fa-solid fa-martini-glass-citrus"></i> Order Now!
                        </a>
                    </div>
                    <div class="product-popup">
                        <div class="popup-content">
                            <h3>${product.title}</h3>
                            <p>${product.description}</p>
                            <h4>${product.price}</h4>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    productsContainer.innerHTML = html;
}

function showPopup(card) {
    const popup = card.querySelector('.product-popup');
    if (popup) {
        popup.style.display = 'block';
        popup.style.opacity = '1';
    }
}

function hidePopup(card) {
    const popup = card.querySelector('.product-popup');
    if (popup) {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 200);
    }
}

document.addEventListener('DOMContentLoaded', renderProducts);