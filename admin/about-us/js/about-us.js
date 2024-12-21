// Role-based access control
function checkUserRole() {
    const userRole = localStorage.getItem('userRole');
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/admin/') && userRole !== 'admin') {
        alert('Access Denied: This page is only accessible to administrators');
        window.location.href = '../../Client/index.html';
        return false;
    }
    return true;
}

// Check role when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (!checkUserRole()) {
        return;
    }

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

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const loggedOutContent = document.getElementById('loggedOutContent');
    const loggedInContent = document.getElementById('loggedInContent');
    const userAccountName = document.getElementById('userAccountName');
    
    if (isLoggedIn === 'true') {
        loggedOutContent.style.display = 'none';
        loggedInContent.style.display = 'block';
        const username = localStorage.getItem('adminUsername');
        userAccountName.textContent = username || 'Admin';
    } else {
        loggedOutContent.style.display = 'block';
        loggedInContent.style.display = 'none';
    }

    // Update username display
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = 'admin';  // Set the fixed username
    }
});