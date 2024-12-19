// Function to handle 404 errors
function handle404() {
    // Get the current URL
    const currentUrl = window.location.href;
    
    // Try to fetch the current URL
    fetch(currentUrl)
        .then(response => {
            // If response is not ok (404 or other error)
            if (!response.ok) {
                redirectTo404();
            }
        })
        .catch(() => {
            // If fetch fails (network error, file not found, etc.)
            redirectTo404();
        });
}

// Function to redirect to 404 page
function redirectTo404() {
    // Store the invalid URL
    sessionStorage.setItem('invalidUrl', window.location.href);
    
    // Get base URL (domain root)
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    
    // Calculate path to error page
    let errorPath;
    if (currentPath === '/') {
        errorPath = '/error.html';
    } else {
        // Count directory levels to create relative path
        const levels = currentPath.split('/').length - 1;
        const relativePath = '../'.repeat(levels);
        errorPath = relativePath + 'error.html';
    }
    
    // Redirect to error page
    window.location.href = baseUrl + errorPath;
}

// Run check when page loads
document.addEventListener('DOMContentLoaded', handle404);

// Also check when URL changes without page reload (for single page apps)
window.addEventListener('popstate', handle404);
