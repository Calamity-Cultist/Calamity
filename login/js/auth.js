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
        // User is logged in - show user info, remove login/signup
        if (loggedInContent) {
            loggedInContent.style.display = 'none';  // Initially hidden, shown on click
            const usernameText = userAccountName.querySelector('.username-text');
            if (usernameText) {
                usernameText.textContent = username;
            }
        }
        if (loggedOutContent) {
            loggedOutContent.remove();  // Completely remove login/signup options
        }
    } else {
        // User is not logged in - show login/signup, remove user info
        if (loggedInContent) {
            loggedInContent.remove();  // Completely remove user info
        }
        if (loggedOutContent) {
            loggedOutContent.style.display = 'none';  // Initially hidden, shown on click
        }
    }
}

// Event listener for dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    updateUIForLoginStatus();
    
    // Add click handler for dropdown
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const token = localStorage.getItem('token');
            const loggedInContent = document.getElementById('loggedInContent');
            const loggedOutContent = document.getElementById('loggedOutContent');
            
            if (token && loggedInContent) {
                // Toggle logged in menu
                loggedInContent.style.display = loggedInContent.style.display === 'block' ? 'none' : 'block';
            } else if (!token && loggedOutContent) {
                // Toggle logged out menu
                loggedOutContent.style.display = loggedOutContent.style.display === 'block' ? 'none' : 'block';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                const loggedInContent = document.getElementById('loggedInContent');
                const loggedOutContent = document.getElementById('loggedOutContent');
                if (loggedInContent) loggedInContent.style.display = 'none';
                if (loggedOutContent) loggedOutContent.style.display = 'none';
            }
        });
    }
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