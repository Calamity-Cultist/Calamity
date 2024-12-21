// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitch.checked = true;
    }

    // Handle theme toggle
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
});

// Logout functionality
function handleLogout() {
    // Clear any stored user data
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Clear any authentication tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // You can add more cleanup here if needed
    
    // Redirect will happen through the href in the link
}
