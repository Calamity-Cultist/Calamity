document.addEventListener('DOMContentLoaded', function() {
    const discountBanner = document.querySelector('.discount-overlay');
    const closeButton = document.querySelector('.close-button');
    const timerBar = document.querySelector('.timer-bar');
    const upgradeButton = document.querySelector('.upgrade-button');
    const BANNER_TIMEOUT = 30000; // 30 seconds

    // Check localStorage before doing anything
    if (localStorage.getItem('bannerClosed')) {
        return; // Exit early if banner was previously closed
    }

    function showBanner() {
        document.body.classList.add('banner-active');
        discountBanner.style.opacity = '1';
        discountBanner.style.display = 'flex';
        
        // Start timer animation
        setTimeout(() => {
            timerBar.classList.add('active');
        }, 50);

        // Set timeout to close banner
        setTimeout(() => {
            closeBanner();
            localStorage.setItem('bannerClosed', 'true');
        }, BANNER_TIMEOUT);
    }

    function closeBanner() {
        // Add fade out animation
        discountBanner.style.opacity = '0';
        document.body.classList.remove('banner-active');
        
        // Hide banner after fade animation
        setTimeout(() => {
            discountBanner.style.display = 'none';
            timerBar.classList.remove('active');
        }, 300);
    }

    // Show banner only if not previously closed
    showBanner();

    // Handle close button click
    closeButton.addEventListener('click', () => {
        closeBanner();
        localStorage.setItem('bannerClosed', 'true');
    });

    // Handle upgrade button click
    upgradeButton.addEventListener('click', function(e) {
        e.preventDefault();
        // Add your upgrade logic here
        window.location.href = '#upgrade'; // Replace with actual upgrade URL
    });
});
