// Main content configuration
const siteContent = {
    navigation: {
        brand: {
            logo: "images/Logo.png",
            text: "CALAMITY CLUB"
        },
        links: [
            { text: "Home", url: "index.html", active: true },
            { text: "Products", url: "product/product.html" },
            { text: "About Us", url: "about-us/about.html" }
        ],
        userDropdown: {
            items: [
                { text: "Account", icon: "fas fa-user-circle", url: "account/profile.html" },
                { text: "Theme", icon: "fas fa-moon", isThemeToggle: true },
                { text: "Log Out", icon: "fas fa-sign-out-alt", url: "../Client/new-user.html", class: "text-danger" }
            ]
        }
    },
    hero: {
        video: {
            src: "videos/Fruits-Trailer.mp4",
            type: "video/mp4"
        },
        content: {
            title: "Calamity",
            subtitle: "Bringing the freshness of fruits to your glass",
            ctaButton: {
                text: "Explore Our Products",
                url: "product/product.html"
            }
        }
    },
    about: {
        title: "Freshness in Every Sip & Variety of Flavors",
        description: "Enjoy our fresh fruit juices packed with flavor and vitamins. From classic options to exciting new drinks, we bring a glass of freshness to brighten your day."
    },
    carousel: {
        slides: [
            {
                image: "https://img.freepik.com/free-photo/medical-treatment-with-pills_23-2148108993.jpg?t=st=1733741090~exp=1733744690~hmac=ba9e434b441864bbaed91a17e0d557e6ec38170b0fb80f5ca871b08aae633b14&w=1060",
                alt: "A stack of vitamins on a cyan floor",
                title: "Rich in Vitamins",
                description: "Our drinks are packed with essential vitamins like Vitamin C, Vitamin A, and several B vitamins, providing a natural way to support your immune system, skin health, and overall vitality."
            },
            {
                image: "https://images.unsplash.com/photo-1613082410785-22292e8426e7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                alt: "A plate of antioxidant-rich berries",
                title: "Good Source of Antioxidants",
                description: "Infused with antioxidants from berries like blueberries and strawberries, our drinks help combat free radicals, reducing oxidative stress and supporting your body's cellular health."
            },
            {
                image: "https://images.unsplash.com/photo-1496568934502-9e86936646be?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                alt: "A person drinking fresh orange juice from a bottle",
                title: "Hydrating",
                description: "With a high water content, our drinks are perfect for hydration, promoting healthy skin, aiding digestion, and keeping your energy levels up throughout the day."
            },
            {
                image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                alt: "A smoothie bowl with bananas, nuts, and seeds for an energy boost",
                title: "Rich in Fiber",
                description: "Our drinks are a great source of dietary fiber, which helps regulate digestion, improve gut health, and maintain stable blood sugar levels while keeping you feeling fuller for longer."
            },
            {
                image: "https://img.freepik.com/free-photo/top-view-paper-hearts-valentines-day_23-2148382688.jpg?t=st=1733732305~exp=1733735905~hmac=d85270ecb0550cc1332731fbee67745b9c2fdb31875865074a88032326866b18&w=1060",
                alt: "Paper hearts on a cyan colored plank",
                title: "Supports Heart Health",
                description: "Our drinks, made with healthy fats, antioxidants, and fiber, can help support heart health by lowering cholesterol, reducing inflammation, and promoting better cardiovascular function."
            },
            {
                image: "https://img.freepik.com/free-photo/recycled-aluminium-cans_23-2149436529.jpg?t=st=1733733629~exp=1733737229~hmac=a55c15b8c44b58f6e811531b844b2e4de37d0a53d07bb1d09a7d8e18af59bd13&w=1060",
                alt: "A drink providing a natural energy boost, with ingredients surrounding it",
                title: "Natural Energy Boost",
                description: "Our drinks provide a natural energy boost, thanks to the healthy sugars and nutrients they contain, offering sustained energy without the crash often associated with caffeine or processed snacks."
            }
        ]
    }
};

// Function to initialize the page content
function initializeContent() {
    // Populate navigation
    document.querySelector('.navbar-brand').innerHTML = `
        <img src="${siteContent.navigation.brand.logo}" class="nav-img" alt="">
        ${siteContent.navigation.brand.text}
    `;

    // Populate hero section
    const heroVideo = document.querySelector('#heroVideo source');
    heroVideo.src = siteContent.hero.video.src;
    heroVideo.type = siteContent.hero.video.type;

    document.querySelector('.hero-content h1').textContent = siteContent.hero.content.title;
    document.querySelector('.hero-content p').textContent = siteContent.hero.content.subtitle;
    document.querySelector('.hero-content .cta-button').textContent = siteContent.hero.content.ctaButton.text;
    document.querySelector('.hero-content .cta-button').href = siteContent.hero.content.ctaButton.url;

    // Populate about section
    document.querySelector('.about-section h2').textContent = siteContent.about.title;
    document.querySelector('.about-section p').textContent = siteContent.about.description;

    // Populate carousel
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = siteContent.carousel.slides.map((slide, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${slide.image}" alt="${slide.alt}">
            <div class="carousel-caption">
                <h5>${slide.title}</h5>
                <p>${slide.description}</p>
            </div>
        </div>
    `).join('');

    // Create carousel indicators
    const indicators = document.querySelector('.carousel-indicators');
    indicators.innerHTML = siteContent.carousel.slides.map((_, index) => `
        <button type="button" data-bs-target="#demo" data-bs-slide-to="${index}" 
            ${index === 0 ? 'class="active"' : ''}></button>
    `).join('');
}

// Function to toggle video play/pause
function toggleVideo(videoId) {
    const video = document.getElementById(videoId);
    const btn = document.querySelector('.pause-btn i');
    
    if (video.paused) {
        video.play();
        btn.className = 'fas fa-pause';
    } else {
        video.pause();
        btn.className = 'fas fa-play';
    }
}

// Initialize content when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeContent);
