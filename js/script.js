const header = document.querySelector('.navbar');
window.onscroll = function() {
    const top = window.scrollY;
    const maxScroll = window.innerHeight * 1;
    const scrollFraction = Math.min(top / maxScroll, 1);
    const startColor = { r: 62, g: 150, b: 188 };
    const endColor = {  r: 62, g: 150, b: 188 };
    const currentColor = {
        r: Math.round(startColor.r + (endColor.r - startColor.r) * scrollFraction),
        g: Math.round(startColor.g + (endColor.g - startColor.g) * scrollFraction),
        b: Math.round(startColor.b + (endColor.b - startColor.b) * scrollFraction)
    };
    header.style.backgroundColor = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.9)`;

    if (scrollFraction >= 1) {
        header.classList.add('navbar-light');
    } else {
        header.classList.add('navbar-light');
    }
};

const navLinks = document.querySelectorAll('.nav-item');
const navbarToggler = document.getElementById('navbar_supported_content'); navLinks.forEach((l) => {
    l.addEventListener('click', () => {
        new bootstrap.Collapse(navbarToggler).toggle();
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
	"image" : "../images/proMang.png",
	"title" : "Mango Juice ",
},
{
	"image" : "../images/proAvo.png",
	"title" : "Avocado Juice ",
},
{
	"image" : "../images/proSour.png",
	"title" : "Soursop Juice ",
},
{
	"image" : "../images/proMix.png",
	"title" : "Mix Juice ",
},
{
	"image" : "../images/proCal.png",
	"title" : "Calamity Special ",
},
{
	"image" : "../images/proApp.png",
	"title" : "Apple Juice ",
},
{
	"image" : "../images/proThai.png",
	"title" : "Thailongtea ",
},
{
	"image" : "../images/proMonk.png",
	"title" : "Monk Fruit Juice ",
},
{
	"image" : "../images/proHerb.png",
	"title" : "Herbal Green Tea ",
},
];

function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    let html = '';

    products.forEach(product => {
        html += `
            <div class="col-lg-4 mt-4">
                <a href="product/product.html">
                <div class="card services-text">
                    <div class="card-body">
                    <img class="services-image" src="${product.image}">
                    <h4 style="color: #000000;" class="card-title mt-3">${product.title}</h4>
                    <a class="btn btn-outline-info" href="#product">
                        <i class="fa-solid fa-martini-glass-citrus"></i> Order Now!
                    </a>
                    </div>
                </div>  
                </a>
            </div>
        `;
    });

    productsContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProducts);