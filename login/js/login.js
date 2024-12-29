document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        
        const data = await response.json();
        
        if(response.ok && data.success) {
            console.log('Login successful');
            
            // Get user info from cookies
            const userRole = getCookie('userRole');
            const username = getCookie('username');
            
            console.log(`Logged in as ${username} with role ${userRole}`);
            
            // Store user info
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('username', username);
            localStorage.setItem('userRole', userRole);

            // Use server's redirect URL
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                // Fallback based on role
                if (userRole === 'admin') {
                    window.location.href = '../admin/index.html';
                } else {
                    window.location.href = '../client/index.html';
                }
            }
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.message || 'Invalid credentials';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error during login:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'An error occurred while logging in';
        errorMessage.style.display = 'block';
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Add role check function for use throughout the app
function checkUserRole() {
    const userRole = localStorage.getItem('userRole');
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/admin/') && userRole !== 'admin') {
        alert('Access Denied: This page is only accessible to administrators');
        window.location.href = '../Client/index.html';
        return false;
    }
    return true;
}

// Check role when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkUserRole();
});