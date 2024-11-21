const header = document.querySelector('.navbar');
window.onscroll = function() {
    const top = window.scrollY;
    const maxScroll = window.innerHeight * 1;
    const scrollFraction = Math.min(top / maxScroll, 1);
    const startColor = { r: 62, g: 150, b: 188 };
    const endColor = { r: 18, g: 27, b: 34 };
    const currentColor = {
        r: Math.round(startColor.r + (endColor.r - startColor.r) * scrollFraction),
        g: Math.round(startColor.g + (endColor.g - startColor.g) * scrollFraction),
        b: Math.round(startColor.b + (endColor.b - startColor.b) * scrollFraction)
    };
    header.style.backgroundColor = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.9)`;

    if (scrollFraction >= 1) {
        header.classList.remove('navbar-light');
        header.classList.add('navbar-dark');
    } else {
        header.classList.add('navbar-light');
        header.classList.remove('navbar-dark');
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
	"icon" : "fas fa-gamepad",
	"title" : "Minuman",
	"text" : "mmm yummers"
  },
  {
	"icon" : "fas fa-graduation-cap",
	"title" : "Also minuman",
	"text" : "woah yummy"
  },
  {
	"icon" : "fas fa-circle-question",
	"title" : "Minuman?",
	"text" : "mmm yummy?"
  }
];

function renderServices() {
    const servicesContainer = document.getElementById('services-container');
    let html = '';

    services.forEach(service => {
        html += `
            <div class="col-lg-4 mt-4">
                <div class="card services-text">
                    <div class="card-body">
                        <i class="${service.icon} services-icon"></i>
                        <h4 class="card-title mt-3">${service.title}</h4>
                        <p class="card-text mt-3">${service.text}</p>
                    </div>
                </div>  
            </div>
        `;
    });

    servicesContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderServices);