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
    // Store the invalid URL that caused the 404
    const currentPath = window.location.pathname;
    
    // Calculate the number of directory levels deep we are
    const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
    const levels = pathSegments.length;
    
    // Build the relative path to error.html based on current depth
    const relativePath = levels > 0 ? '../'.repeat(levels) : './';
    
    // Redirect to error page with relative path
    window.location.href = relativePath + 'error.html';
}

// Run check when page loads
document.addEventListener('DOMContentLoaded', handle404);

// Also check when URL changes without page reload (for single page apps)
window.addEventListener('popstate', handle404);


// Add to server.js
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'));
});