// Sidebar.js - Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
});

function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMain = document.querySelector('.admin-main');

    if (sidebarToggle && adminSidebar) {
        // Toggle sidebar on button click
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('collapsed');
            adminMain.classList.toggle('sidebar-collapsed');

            // Save sidebar state to localStorage
            const isCollapsed = adminSidebar.classList.contains('collapsed');
            localStorage.setItem('adminSidebarCollapsed', isCollapsed);
        });

        // Restore sidebar state from localStorage
        const sidebarCollapsed = localStorage.getItem('adminSidebarCollapsed');
        if (sidebarCollapsed === 'true') {
            adminSidebar.classList.add('collapsed');
            adminMain.classList.add('sidebar-collapsed');
        }
    }

    // Handle mobile sidebar
    handleMobileSidebar();

    // Highlight active menu item
    highlightActiveMenuItem();

    // Handle submenu toggles
    initializeSubmenus();
}

function handleMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('show');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Update mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle && window.innerWidth <= 768) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('active');

            if (sidebar.classList.contains('show')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
}

function highlightActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.nav-link');

    menuLinks.forEach(link => {
        link.classList.remove('active');

        // Check if link href matches current path
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }

        // Check for partial matches (for subpages)
        const href = link.getAttribute('href');
        if (href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
    });
}

function initializeSubmenus() {
    const submenuToggles = document.querySelectorAll('.nav-item.has-submenu > .nav-link');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();

            const navItem = this.parentElement;
            const submenu = navItem.querySelector('.nav-submenu');

            if (submenu) {
                // Close other submenus
                document.querySelectorAll('.nav-submenu.active').forEach(activeSubmenu => {
                    if (activeSubmenu !== submenu) {
                        activeSubmenu.classList.remove('active');
                        activeSubmenu.previousElementSibling.classList.remove('active');
                    }
                });

                // Toggle current submenu
                submenu.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    });
}

// Sidebar navigation helpers
function navigateToSection(section) {
    const sectionMap = {
        'dashboard': '/admin',
        'users': '/admin/users',
        'logs': '/admin/logs',
        'templates': '/admin/templates',
        'settings': '/admin/settings',
        'ai-tools': '/admin/ai-tools',
        'exports': '/admin/exports'
    };

    const path = sectionMap[section];
    if (path) {
        window.location.href = path;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.querySelector('.admin-main');

    sidebar.classList.toggle('collapsed');
    main.classList.toggle('sidebar-collapsed');

    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('adminSidebarCollapsed', isCollapsed);
}

function expandSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.querySelector('.admin-main');

    sidebar.classList.remove('collapsed');
    main.classList.remove('sidebar-collapsed');
    localStorage.setItem('adminSidebarCollapsed', false);
}

function collapseSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.querySelector('.admin-main');

    sidebar.classList.add('collapsed');
    main.classList.add('sidebar-collapsed');
    localStorage.setItem('adminSidebarCollapsed', true);
}

// Sidebar state management
function getSidebarState() {
    return {
        collapsed: localStorage.getItem('adminSidebarCollapsed') === 'true',
        mobile: window.innerWidth <= 768
    };
}

function setSidebarState(state) {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.querySelector('.admin-main');

    if (state.collapsed) {
        sidebar.classList.add('collapsed');
        main.classList.add('sidebar-collapsed');
    } else {
        sidebar.classList.remove('collapsed');
        main.classList.remove('sidebar-collapsed');
    }

    localStorage.setItem('adminSidebarCollapsed', state.collapsed);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + B to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
    }

    // Escape to close mobile sidebar
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('adminSidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Auto-collapse sidebar on small screens
window.addEventListener('load', function() {
    if (window.innerWidth <= 768) {
        collapseSidebar();
    }
});

// Sidebar animation helpers
function animateSidebar(show = true) {
    const sidebar = document.getElementById('adminSidebar');

    if (show) {
        sidebar.style.transform = 'translateX(0)';
        sidebar.classList.add('show');
    } else {
        sidebar.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            sidebar.classList.remove('show');
        }, 300);
    }
}

// Export functions globally
window.SidebarUtils = {
    toggleSidebar,
    expandSidebar,
    collapseSidebar,
    getSidebarState,
    setSidebarState,
    navigateToSection,
    animateSidebar
};