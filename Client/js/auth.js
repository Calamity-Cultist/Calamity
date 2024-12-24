function checkUserRole() {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('userRole='));
    const userRole = cookieValue ? cookieValue.split('=')[1] : null;
    const currentPath = window.location.pathname;

    // Allow access to public pages and product page
    if (currentPath.includes('/Client/') || 
        currentPath.includes('/auth/') || 
        currentPath === '/' || 
        currentPath.includes('/login/') ||
        currentPath.includes('/product/')) {
        
        // Disable checkout for non-logged in users on product page
        if (currentPath.includes('/product/') && !userRole) {
            disableCheckoutButton();
        }
        return true;
    }

    // Check for admin pages
    if (currentPath.includes('/admin/')) {
        if (userRole !== 'admin') {
            alert('Access Denied: This page is only accessible to administrators');
            window.location.href = '/auth/login';
            return false;
        }
        return true;
    }

    // For other protected pages
    if (!userRole) {
        alert('Access Denied: You must be logged in to access this page');
        window.location.href = '/auth/login';
        return false;
    }

    return true;
}

function disableCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.setAttribute('aria-disabled', 'true');
        checkoutBtn.title = 'Please log in to checkout';
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Please log in to checkout');
        });
    }
}

