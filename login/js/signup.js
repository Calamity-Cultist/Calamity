document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        document.getElementById('role-group').style.display = 'block';
    }
});

document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const roleSelect = document.getElementById('role');
    const role = roleSelect.style.display !== 'none' ? roleSelect.value : 'client';
    
    if (password !== confirmPassword) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Account created successfully!');
            window.location.href = data.redirectUrl;
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.message || 'Error creating account';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error during signup:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'An error occurred while creating account';
        errorMessage.style.display = 'block';
    }
});