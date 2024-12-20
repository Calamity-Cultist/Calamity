// Function to check if user is logged in
async function checkLoginStatus() {
    try {
        const response = await fetch('/auth/check-status');
        const data = await response.json();
        return data.isLoggedIn;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

// Function to create and show user menu
function showUserMenu(event, isLoggedIn) {
    event.preventDefault();
    
    // Remove existing menu if present
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    // Create menu
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    
    if (isLoggedIn) {
        menu.innerHTML = `
            <a href="/auth/profile" class="menu-item">Profile</a>
            <a href="#" class="menu-item" id="logout-btn">Logout</a>
        `;
    } else {
        menu.innerHTML = `
            <a href="/auth/login" class="menu-item">Login</a>
            <a href="/auth/signup" class="menu-item">Sign Up</a>
        `;
    }

    // Position menu below user icon
    const iconRect = event.target.closest('.nav-link').getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = `${iconRect.bottom}px`;
    menu.style.right = '20px';

    // Add menu to page
    document.body.appendChild(menu);

    // Add logout functionality
    if (isLoggedIn) {
        document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch('/auth/logout');
                window.location.href = '/auth/login';
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && !event.target.closest('.nav-link').contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Initialize user menu functionality
document.addEventListener('DOMContentLoaded', async () => {
    const userIcon = document.querySelector('.fa-user').closest('.nav-link');
    const isLoggedIn = await checkLoginStatus();
    
    userIcon.addEventListener('click', (e) => showUserMenu(e, isLoggedIn));
});
