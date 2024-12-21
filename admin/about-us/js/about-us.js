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
