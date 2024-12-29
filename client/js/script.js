// Loading Screen
let loadingTimeout;

function initializeLoader() {
    console.log('Initializing loader...');
    const loader = document.querySelector('.loading-container');
    console.log('Loader element:', loader);
    
    if (!loader) {
        console.error('Loading container not found!');
        return;
    }

    // Show loader immediately
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    document.body.style.overflow = 'hidden';

    // Function to hide loader
    const hideLoader = () => {
        console.log('Hiding loader...');
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }
        
        document.body.style.overflow = '';
        loader.style.opacity = '0';
        
        // Show all content
        Array.from(document.body.children).forEach(element => {
            if (!element.classList.contains('loading-container')) {
                element.style.opacity = '1';
                element.style.transition = 'opacity 0.5s ease-in';
            }
        });

        setTimeout(() => {
            loader.style.display = 'none';
            console.log('Loader hidden');
        }, 500);
    };

    // Set a minimum and maximum loading time
    const MIN_LOADING_TIME = 3000;
    const startTime = Date.now();
    
    const finishLoading = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
        
        setTimeout(() => {
            hideLoader();
        }, remainingTime);
    };

    // Hide loader when all resources are loaded
    if (document.readyState === 'complete') {
        console.log('Document already complete');
        finishLoading();
    } else {
        console.log('Waiting for window load');
        window.addEventListener('load', () => {
            console.log('Window loaded');
            finishLoading();
        });
    }
}

// Initialize loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLoader);
} else {
    initializeLoader();
}

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
document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userDropdown');
    const dropdownMenu = document.getElementById('loggedOutContent');
    let isOpen = false;

    userIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isOpen) {
            dropdownMenu.style.display = 'none';
        } else {
            dropdownMenu.style.display = 'block';
        }
        isOpen = !isOpen;
    });

    // Close when clicking anywhere else
    document.addEventListener('click', function(e) {
        if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
            isOpen = false;
        }
    });
});