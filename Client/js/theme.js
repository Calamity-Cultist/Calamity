// Theme variables
const themeColors = {
    light: {
        '--primary-bg': '#f4f4f4',
        '--text-color': '#1e1e1e',
        '--accent-color': '#557571',
        '--button-bg': '#F7D1BA',
        '--button-hover': '#D49A89'
    },
    dark: {
        '--primary-bg': '#393E46',
        '--text-color': '#EEEEEE',
        '--accent-color': '#222831',
        '--button-bg': '#00ADB5',
        '--button-hover': '#008C94'
    }
};

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Function to apply theme
    function applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            root.style.setProperty('--primary-bg', 'var(--primary-bg-dark)');
            root.style.setProperty('--text-color', 'var(--text-color-dark)');
            root.style.setProperty('--accent-color', 'var(--accent-color-dark)');
            root.style.setProperty('--button-bg', 'var(--button-bg-dark)');
            root.style.setProperty('--button-hover', 'var(--button-hover-dark)');
            themeSwitch.checked = true;
        } else {
            document.body.classList.remove('dark-theme');
            root.style.setProperty('--primary-bg', 'var(--primary-bg-light)');
            root.style.setProperty('--text-color', 'var(--text-color-light)');
            root.style.setProperty('--accent-color', 'var(--accent-color-light)');
            root.style.setProperty('--button-bg', 'var(--button-bg-light)');
            root.style.setProperty('--button-hover', 'var(--button-hover-light)');
            themeSwitch.checked = false;
        }
    }

    // Set initial theme
    applyTheme(savedTheme);

    // Handle theme toggle
    themeSwitch.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
