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

const new_products = [
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

function renderNew_products() {
    const new_productsContainer = document.getElementById('new_product_container');
    let html = '';

    new_products.forEach(new_product => {
        html += `
            <div class="col-lg-4 mt-4">
                <div class="card services-text">
                    <div class="card-body">
                        <img class="services-image" src="${new_product.image}">
                        <h4 style="color: #000000;" class="card-title mt-3">${new_product.title}</h4>
                    </div>
                    <div class="d-flex justify-content-center mt-3 mb-3">
                        <a class="btn btn-outline-info" href="#">
                            <i class="fa-solid fa-martini-glass-citrus"></i> Order Now!
                        </a>
                    </div>
                </div> 
            </div>
        `;
    });

    new_productsContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderNew_products);


const csoon_products = [
{
	"image" : "../product/images/proMang.png",
	"title" : "Mango Juice ",
},
{
	"image" : "../product/images/proAvo.png",
	"title" : "Avocado Juice ",
},
{
	"image" : "../product/images/proSour.png",
	"title" : "Soursop Juice ",
},
{
	"image" : "../product/images/proMix.png",
	"title" : "Mix Juice ",
},
{
	"image" : "../product/images/proCal.png",
	"title" : "Calamity Special ",
},
{
	"image" : "../product/images/proApp.png",
	"title" : "Apple Juice ",
},
{
	"image" : "../product/images/proThai.png",
	"title" : "Thailongtea ",
},
{
	"image" : "../product/images/proMonk.png",
	"title" : "Monk Fruit Juice ",
},
{
	"image" : "../product/images/proHerb.png",
	"title" : "Herbal Green Tea ",
},
];

function renderCsoon_products() {
    const csoon_productsContainer = document.getElementById('csoon_container');
    let html = '';

    csoon_products.forEach(csoon_product => {
        html += `
            <div class="col-lg-4 mt-4">
                <div class="card services-text">
                    <div class="card-body">
                    <img class="services-image" src="${csoon_product.image}">
                    <h4 style="color: #000000;" class="card-title mt-3">${csoon_product.title}</h4>
                    </div>
                </div>  
            </div>
        `;
    });

    csoon_productsContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderCsoon_products);

function toggleVideo(videoId) {
    const video = document.getElementById(videoId);
    const btn = video.parentElement.querySelector('.pause-btn i');
    
    if (video.paused) {
        video.play();
        btn.className = 'fas fa-pause';
    } else {
        video.pause();
        btn.className = 'fas fa-play';
    }
}

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
