// Function to check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || !userRole) {
        window.location.href = '../login/login.html';
        return false;
    }
    return true;
}

// Function to update UI based on login status
function updateUIForLoginStatus() {
    const { isLoggedIn, username } = checkLoginStatus();
    const loggedOutContent = document.getElementById('loggedOutContent');
    const loggedInContent = document.getElementById('loggedInContent');
    const userAccountName = document.getElementById('userAccountName');
    const cartCountElement = document.getElementById('cartCount');

    if (isLoggedIn) {
        loggedOutContent.style.display = 'none';
        loggedInContent.style.display = 'block';
        userAccountName.textContent = username || 'User';
        
        // Update cart count if available
        const cartCount = localStorage.getItem('cartCount') || '0';
        cartCountElement.textContent = cartCount;
    } else {
        loggedOutContent.style.display = 'block';
        loggedInContent.style.display = 'none';
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        // Clear all authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUsername');
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Redirect to login page
        window.location.href = '../login/login.html';
    }
}

// Function to check if user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return { isLoggedIn: !!token, username };
}

// Update cart count
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        localStorage.setItem('cartCount', count);
    }
}

// Check auth when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Initialize UI based on login status
    updateUIForLoginStatus();
});
