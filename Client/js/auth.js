// Function to check if user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return { isLoggedIn: !!token, username };
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
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('cartCount');
            // Update UI
            updateUIForLoginStatus();
            // Redirect to home page
            window.location.href = '/';
        });
    }

    // Initialize UI based on login status
    updateUIForLoginStatus();
});

// Update cart count
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        localStorage.setItem('cartCount', count);
    }
}
