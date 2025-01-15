document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('iframe');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const expandAllBtn = document.getElementById('expandAll');
    const collapseAllBtn = document.getElementById('collapseAll');
    
    // Prevent dropdown from closing when clicking buttons
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Theme handling
    const getTheme = () => document.documentElement.getAttribute('data-bs-theme');
    const isDark = () => getTheme() === 'dark';

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update dropdown icon visibility based on theme
        const activeIcon = document.querySelector('[data-theme-icon-active]');
        const inactiveIcon = document.querySelector('[data-theme-icon-inactive]');
        if (theme === 'dark') {
            activeIcon.style.display = 'none';
            inactiveIcon.style.display = 'inline-block';
        } else {
            activeIcon.style.display = 'inline-block';
            inactiveIcon.style.display = 'none';
        }
        
        // Notify iframe about theme change
        iframe.contentWindow.postMessage({ 
            action: 'setTheme', 
            theme: theme 
        }, '*');
    };

    // Initialize theme from localStorage or system preference
    const initializeTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(systemTheme);
        }
    };

    // Toggle theme button click handler
    toggleThemeBtn.addEventListener('click', () => {
        const newTheme = isDark() ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Other button handlers
    expandAllBtn.addEventListener('click', () => {
        iframe.contentWindow.postMessage({ action: 'expandAll' }, '*');
    });

    collapseAllBtn.addEventListener('click', () => {
        iframe.contentWindow.postMessage({ action: 'collapseAll' }, '*');
    });

    // Listen for theme changes from the iframe
    window.addEventListener('message', (event) => {
        if (event.data.action === 'themeChanged') {
            setTheme(event.data.theme);
        }
    });

    // Initialize theme on load
    initializeTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    });
}); 