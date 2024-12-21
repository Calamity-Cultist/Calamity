// Function to check if user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return { isLoggedIn: !!token, username };
}

// Function to update UI based on login status
function updateUIForLoginStatus() {
    const { isLoggedIn, username } = checkLoginStatus();
    const usernameDisplay = document.getElementById('username-display');

    if (isLoggedIn) {
        if (usernameDisplay) {
            usernameDisplay.innerHTML = `<i class="fas fa-user-circle me-2"></i>${username || 'User'}`;
        }
    } else {
        window.location.href = '../login/login.html';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '../login/login.html';
}

// Initialize UI when page loads
document.addEventListener('DOMContentLoaded', updateUIForLoginStatus);