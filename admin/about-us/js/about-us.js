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

function checkUserRole() {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('userRole='));
    const userRole = cookieValue ? cookieValue.split('=')[1] : null;
    const currentPath = window.location.pathname;

    if (currentPath.includes('/admin/') && userRole !== 'admin') {
        alert('Access Denied: This page is only accessible to administrators');
        window.location.href = '../../Client/index.html';
    } else if (userRole === null) {
        alert('Access Denied: You must be logged in to access this page');
        window.location.href = '../../Client/index.html'; // Redirect for not logged in
    }
}