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
        
        if(response.ok) {
            console.log('Login successful');
            // Check cookies to verify role
            const userRole = getCookie('userRole');
            const username = getCookie('username');
            
            console.log(`Logged in as ${username} with role ${userRole}`);
            
            // For demo purposes, store username directly
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('username', username);

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                // Redirect based on username
                if (username.toLowerCase() === 'admin') {
                    window.location.href = '../admin/index.html';
                } else {
                    window.location.href = '../Client/index.html';
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

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}