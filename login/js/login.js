document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        
        const data = await response.json();
        
        if(response.ok) {
            console.log('logged in success');
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        } else {
            alert(data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while logging in');
    }
});