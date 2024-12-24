// Function to check if user is logged in and has correct role
function checkAuth() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const currentPath = window.location.pathname;

    if (!token || !userRole) {
        if (currentPath.includes('/admin/')) {
            window.location.href = '../Client/index.html';
        }
        return false;
    }

    if (userRole === 'admin' && !currentPath.includes('/admin/')) {
        window.location.href = '/admin/index.html';
    } else if (userRole === 'client' && currentPath.includes('/admin/')) {
        window.location.href = '/Client/index.html';
    }

    return true;
}

// Function to update UI based on login status and role
function updateUIForLoginStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    const loggedInContent = document.getElementById('loggedInContent');
    const loggedOutContent = document.getElementById('loggedOutContent');
    const userAccountName = document.getElementById('userAccountName');

    if (token && username && userRole) {
        if (loggedInContent) {
            loggedInContent.style.display = 'block';
            userAccountName.textContent = username;
        }
        if (loggedOutContent) {
            loggedOutContent.style.display = 'none';
        }
    } else {
        if (loggedInContent) {
            loggedInContent.style.display = 'none';
        }
        if (loggedOutContent) {
            loggedOutContent.style.display = 'block';
        }
    }
}

// Event listener for dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    updateUIForLoginStatus();
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.addEventListener('click', function() {
        const token = localStorage.getItem('token');
        const loggedInContent = document.getElementById('loggedInContent');
        const loggedOutContent = document.getElementById('loggedOutContent');
        
        if (token) {
            loggedInContent.classList.toggle('show');
        } else {
            loggedOutContent.classList.toggle('show');
        }
    });
});

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUsername');
        
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        window.location.href = '../Client/index.html';
    }
}

// Function to check if user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return { isLoggedIn: !!token, username };
}

// Check auth when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    updateUIForLoginStatus();
});

// Function to toggle the user dropdown
function toggleUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown-content');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}