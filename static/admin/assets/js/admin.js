// Admin.js - Main admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Initialize core admin components
    initializeAdminLayout();
    initializeAdminNavigation();
    initializeAdminSearch();
    initializeAdminNotifications();
    initializeAdminKeyboardShortcuts();

    // Initialize page-specific components based on current page
    initializePageSpecificComponents();

    // Initialize admin utilities
    initializeAdminUtils();

    // Load admin preferences
    loadAdminPreferences();

    // Initialize real-time updates
    initializeRealTimeUpdates();
}

function initializeAdminLayout() {
    // Responsive layout adjustments
    handleWindowResize();

    // Sidebar state management
    initializeSidebarState();

    // Theme management
    initializeThemeManagement();

    // Layout persistence
    loadLayoutPreferences();
}

function initializeAdminNavigation() {
    // Breadcrumb navigation
    updateBreadcrumbs();

    // Active menu highlighting
    highlightActiveMenu();

    // Navigation history
    initializeNavigationHistory();

    // Quick navigation
    initializeQuickNavigation();
}

function initializeAdminSearch() {
    // Global search functionality
    const globalSearch = document.getElementById('adminGlobalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', debounce(function() {
            performGlobalSearch(this.value);
        }, 300));

        globalSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                performGlobalSearch(this.value, true);
            }
        });
    }

    // Search suggestions
    initializeSearchSuggestions();

    // Search history
    initializeSearchHistory();
}

function initializeAdminNotifications() {
    // Load unread notifications
    loadNotifications();

    // Notification polling
    setInterval(loadNotifications, 60000); // Check every minute

    // Notification actions
    initializeNotificationActions();

    // Notification settings
    initializeNotificationSettings();
}

function initializeAdminKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Global shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'k':
                    e.preventDefault();
                    focusGlobalSearch();
                    break;
                case '/':
                    e.preventDefault();
                    showKeyboardShortcuts();
                    break;
                case 's':
                    if (e.shiftKey) {
                        e.preventDefault();
                        quickSave();
                    }
                    break;
            }
        }

        // Alt shortcuts
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    navigateToSection('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    navigateToSection('users');
                    break;
                case '3':
                    e.preventDefault();
                    navigateToSection('logs');
                    break;
                case '4':
                    e.preventDefault();
                    navigateToSection('settings');
                    break;
            }
        }
    });
}

function initializePageSpecificComponents() {
    const currentPage = getCurrentPage();

    switch(currentPage) {
        case 'dashboard':
            if (typeof initializeDashboard === 'function') {
                initializeDashboard();
            }
            break;
        case 'users':
            if (typeof initializeUserManagement === 'function') {
                initializeUserManagement();
            }
            break;
        case 'logs':
            if (typeof initializeLogManagement === 'function') {
                initializeLogManagement();
            }
            break;
        case 'templates':
            if (typeof initializeTemplateManagement === 'function') {
                initializeTemplateManagement();
            }
            break;
        case 'settings':
            if (typeof initializeSettings === 'function') {
                initializeSettings();
            }
            break;
        case 'ai-tools':
            if (typeof initializeAITools === 'function') {
                initializeAITools();
            }
            break;
        case 'exports':
            if (typeof initializeExportFunctions === 'function') {
                initializeExportFunctions();
            }
            break;
        case 'auth':
            if (typeof initializeAuthFunctions === 'function') {
                initializeAuthFunctions();
            }
            break;
    }
}

function initializeAdminUtils() {
    // Admin utilities menu
    initializeAdminUtilsMenu();

    // Quick actions
    initializeQuickActions();

    // Admin toolbar
    initializeAdminToolbar();

    // Context menus
    initializeContextMenus();
}

function handleWindowResize() {
    window.addEventListener('resize', debounce(function() {
        adjustLayoutForScreenSize();
        saveLayoutPreferences();
    }, 250));
}

function adjustLayoutForScreenSize() {
    const width = window.innerWidth;

    if (width < 768) {
        // Mobile layout
        collapseSidebar();
        adjustMobileLayout();
    } else if (width < 1200) {
        // Tablet layout
        adjustTabletLayout();
    } else {
        // Desktop layout
        expandSidebarIfNeeded();
        adjustDesktopLayout();
    }
}

function initializeSidebarState() {
    const sidebarCollapsed = localStorage.getItem('adminSidebarCollapsed') === 'true';
    const sidebar = document.getElementById('adminSidebar');
    const main = document.querySelector('.admin-main');

    if (sidebar && main) {
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            main.classList.add('sidebar-collapsed');
        }
    }
}

function initializeThemeManagement() {
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    applyTheme(savedTheme);

    // Theme switcher
    const themeSwitcher = document.getElementById('themeSwitcher');
    if (themeSwitcher) {
        themeSwitcher.value = savedTheme;
        themeSwitcher.addEventListener('change', function() {
            applyTheme(this.value);
        });
    }
}

function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');

    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
        body.classList.add(`theme-${theme}`);
    }

    localStorage.setItem('adminTheme', theme);

    // Update theme-aware elements
    updateThemeAwareElements(theme);
}

function updateThemeAwareElements(theme) {
    // Update charts, icons, and other theme-aware components
    const themeAwareElements = document.querySelectorAll('[data-theme-aware]');
    themeAwareElements.forEach(element => {
        element.setAttribute('data-current-theme', theme);
    });
}

function loadLayoutPreferences() {
    const preferences = {
        sidebarCollapsed: localStorage.getItem('adminSidebarCollapsed') === 'true',
        theme: localStorage.getItem('adminTheme') || 'light',
        navigationCollapsed: localStorage.getItem('adminNavigationCollapsed') === 'true'
    };

    applyLayoutPreferences(preferences);
}

function applyLayoutPreferences(preferences) {
    // Apply sidebar state
    if (preferences.sidebarCollapsed) {
        collapseSidebar();
    } else {
        expandSidebar();
    }

    // Apply theme
    applyTheme(preferences.theme);

    // Apply navigation state
    if (preferences.navigationCollapsed) {
        collapseNavigation();
    }
}

function saveLayoutPreferences() {
    const preferences = {
        sidebarCollapsed: document.getElementById('adminSidebar')?.classList.contains('collapsed'),
        theme: localStorage.getItem('adminTheme'),
        navigationCollapsed: document.querySelector('.admin-navigation')?.classList.contains('collapsed')
    };

    localStorage.setItem('adminLayoutPreferences', JSON.stringify(preferences));
}

function updateBreadcrumbs() {
    const breadcrumbs = generateBreadcrumbs();
    const breadcrumbContainer = document.getElementById('adminBreadcrumbs');

    if (breadcrumbContainer && breadcrumbs.length > 0) {
        let html = '<nav aria-label="breadcrumb"><ol class="breadcrumb">';

        breadcrumbs.forEach((crumb, index) => {
            if (index === breadcrumbs.length - 1) {
                html += `<li class="breadcrumb-item active">${crumb.title}</li>`;
            } else {
                html += `<li class="breadcrumb-item"><a href="${crumb.url}">${crumb.title}</a></li>`;
            }
        });

        html += '</ol></nav>';
        breadcrumbContainer.innerHTML = html;
    }
}

function generateBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);

    const breadcrumbs = [{ title: 'Dashboard', url: '/admin' }];

    if (segments.includes('admin')) {
        const adminIndex = segments.indexOf('admin');
        const adminSegments = segments.slice(adminIndex + 1);

        let currentPath = '/admin';
        adminSegments.forEach(segment => {
            currentPath += `/${segment}`;
            breadcrumbs.push({
                title: formatBreadcrumbTitle(segment),
                url: currentPath
            });
        });
    }

    return breadcrumbs;
}

function formatBreadcrumbTitle(segment) {
    return segment.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function highlightActiveMenu() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.admin-nav-link');

    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            // Highlight parent menu items
            highlightParentMenu(link);
        }
    });
}

function highlightParentMenu(link) {
    let parent = link.parentElement;
    while (parent && !parent.classList.contains('admin-nav-item')) {
        parent = parent.parentElement;
    }

    if (parent) {
        parent.classList.add('active');
    }
}

function initializeNavigationHistory() {
    // Track navigation history
    let navigationHistory = JSON.parse(localStorage.getItem('adminNavigationHistory') || '[]');

    // Add current page to history
    const currentPage = {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now()
    };

    // Remove duplicates and keep only last 10
    navigationHistory = navigationHistory.filter(item => item.url !== currentPage.url);
    navigationHistory.unshift(currentPage);
    navigationHistory = navigationHistory.slice(0, 10);

    localStorage.setItem('adminNavigationHistory', JSON.stringify(navigationHistory));

    // Update back/forward buttons
    updateNavigationButtons(navigationHistory);
}

function updateNavigationButtons(history) {
    const backBtn = document.getElementById('navBackBtn');
    const forwardBtn = document.getElementById('navForwardBtn');

    if (backBtn) {
        backBtn.disabled = history.length < 2;
    }
    if (forwardBtn) {
        forwardBtn.disabled = true; // Implement forward navigation if needed
    }
}

function initializeQuickNavigation() {
    // Quick navigation dropdown
    const quickNav = document.getElementById('quickNavigation');
    if (quickNav) {
        loadQuickNavigationOptions();
    }
}

function performGlobalSearch(query, navigateToResults = false) {
    if (!query.trim()) {
        hideSearchResults();
        return;
    }

    fetch('/admin/api/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 10 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displaySearchResults(data.results, navigateToResults);
        }
    })
    .catch(error => {
        console.error('Search error:', error);
    });
}

function displaySearchResults(results, navigateToResults) {
    const resultsContainer = document.getElementById('globalSearchResults');

    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
        resultsContainer.style.display = 'block';
        return;
    }

    let html = '<div class="search-results-list">';

    results.forEach(result => {
        html += `
            <div class="search-result-item" data-url="${result.url}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-meta">${result.type} • ${result.meta}</div>
            </div>
        `;
    });

    if (results.length >= 10) {
        html += '<div class="search-see-more">See all results...</div>';
    }

    html += '</div>';
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';

    // Add click handlers
    resultsContainer.addEventListener('click', function(e) {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            const url = resultItem.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        } else if (e.target.classList.contains('search-see-more')) {
            // Navigate to full search results page
            window.location.href = `/admin/search?q=${encodeURIComponent(document.getElementById('adminGlobalSearch').value)}`;
        }
    });
}

function hideSearchResults() {
    const resultsContainer = document.getElementById('globalSearchResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

function initializeSearchSuggestions() {
    const searchInput = document.getElementById('adminGlobalSearch');

    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            showSearchSuggestions();
        });

        searchInput.addEventListener('blur', function() {
            setTimeout(hideSearchResults, 200); // Delay to allow clicks
        });
    }
}

function showSearchSuggestions() {
    // Show recent searches or popular searches
    const suggestions = getSearchSuggestions();
    if (suggestions.length > 0) {
        displaySearchSuggestions(suggestions);
    }
}

function getSearchSuggestions() {
    const recentSearches = JSON.parse(localStorage.getItem('adminRecentSearches') || '[]');
    return recentSearches.slice(0, 5);
}

function displaySearchSuggestions(suggestions) {
    const resultsContainer = document.getElementById('globalSearchResults');

    if (!resultsContainer || suggestions.length === 0) return;

    let html = '<div class="search-suggestions"><div class="suggestions-header">Recent searches</div>';

    suggestions.forEach(suggestion => {
        html += `
            <div class="search-suggestion-item" data-query="${suggestion}">
                <i class="fas fa-history"></i> ${suggestion}
            </div>
        `;
    });

    html += '</div>';
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';

    // Add click handlers
    resultsContainer.addEventListener('click', function(e) {
        const suggestionItem = e.target.closest('.search-suggestion-item');
        if (suggestionItem) {
            const query = suggestionItem.getAttribute('data-query');
            const searchInput = document.getElementById('adminGlobalSearch');
            if (searchInput) {
                searchInput.value = query;
                performGlobalSearch(query, true);
            }
        }
    });
}

function initializeSearchHistory() {
    // Save search queries
    const searchInput = document.getElementById('adminGlobalSearch');
    if (searchInput) {
        let lastSearch = '';
        searchInput.addEventListener('input', debounce(function() {
            if (this.value && this.value !== lastSearch) {
                lastSearch = this.value;
                saveSearchQuery(this.value);
            }
        }, 1000));
    }
}

function saveSearchQuery(query) {
    let recentSearches = JSON.parse(localStorage.getItem('adminRecentSearches') || '[]');
    recentSearches = recentSearches.filter(item => item !== query);
    recentSearches.unshift(query);
    recentSearches = recentSearches.slice(0, 10);
    localStorage.setItem('adminRecentSearches', JSON.stringify(recentSearches));
}

function loadNotifications() {
    fetch('/admin/api/notifications')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateNotificationBadge(data.notifications);
                updateNotificationDropdown(data.notifications);
            }
        })
        .catch(error => {
            console.error('Error loading notifications:', error);
        });
}

function updateNotificationBadge(notifications) {
    const badge = document.getElementById('notificationBadge');
    const unreadCount = notifications.filter(n => !n.read).length;

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

function updateNotificationDropdown(notifications) {
    const dropdown = document.getElementById('notificationDropdown');

    if (!dropdown) return;

    let html = '<div class="notification-list">';

    if (notifications.length === 0) {
        html += '<div class="notification-empty">No notifications</div>';
    } else {
        notifications.slice(0, 5).forEach(notification => {
            html += `
                <div class="notification-item ${!notification.read ? 'unread' : ''}" data-id="${notification.id}">
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${formatTimeAgo(notification.created_at)}</div>
                    </div>
                    ${!notification.read ? '<div class="notification-unread-indicator"></div>' : ''}
                </div>
            `;
        });

        if (notifications.length > 5) {
            html += '<div class="notification-see-more">View all notifications</div>';
        }
    }

    html += '</div>';
    dropdown.innerHTML = html;
}

function initializeNotificationActions() {
    // Mark as read
    document.addEventListener('click', function(e) {
        if (e.target.closest('.notification-item')) {
            const item = e.target.closest('.notification-item');
            const notificationId = item.getAttribute('data-id');

            markNotificationAsRead(notificationId);
            item.classList.remove('unread');
        }
    });

    // Mark all as read
    const markAllReadBtn = document.getElementById('markAllNotificationsRead');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllNotificationsAsRead();
        });
    }
}

function markNotificationAsRead(notificationId) {
    fetch(`/admin/api/notifications/${notificationId}/read`, {
        method: 'POST'
    })
    .catch(error => {
        console.error('Error marking notification as read:', error);
    });
}

function markAllNotificationsAsRead() {
    fetch('/admin/api/notifications/mark-all-read', {
        method: 'POST'
    })
    .then(() => {
        loadNotifications();
    })
    .catch(error => {
        console.error('Error marking all notifications as read:', error);
    });
}

function initializeNotificationSettings() {
    // Notification preferences
    loadNotificationPreferences();

    // Update preferences
    const notificationSettings = document.querySelectorAll('.notification-setting');
    notificationSettings.forEach(setting => {
        setting.addEventListener('change', function() {
            updateNotificationPreference(this.name, this.checked);
        });
    });
}

function loadNotificationPreferences() {
    fetch('/admin/api/notifications/preferences')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Object.keys(data.preferences).forEach(key => {
                    const element = document.querySelector(`[name="${key}"]`);
                    if (element) {
                        element.checked = data.preferences[key];
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading notification preferences:', error);
        });
}

function updateNotificationPreference(preference, enabled) {
    fetch('/admin/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [preference]: enabled })
    })
    .catch(error => {
        console.error('Error updating notification preference:', error);
    });
}

function focusGlobalSearch() {
    const searchInput = document.getElementById('adminGlobalSearch');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'Ctrl+K', description: 'Focus global search' },
        { key: 'Ctrl+/', description: 'Show keyboard shortcuts' },
        { key: 'Ctrl+Shift+S', description: 'Quick save' },
        { key: 'Alt+1', description: 'Go to Dashboard' },
        { key: 'Alt+2', description: 'Go to Users' },
        { key: 'Alt+3', description: 'Go to Logs' },
        { key: 'Alt+4', description: 'Go to Settings' }
    ];

    showModal('Keyboard Shortcuts', generateShortcutsHTML(shortcuts));
}

function generateShortcutsHTML(shortcuts) {
    let html = '<div class="keyboard-shortcuts">';
    shortcuts.forEach(shortcut => {
        html += `
            <div class="shortcut-item d-flex justify-content-between py-2">
                <span>${shortcut.description}</span>
                <kbd class="bg-light px-2 py-1 rounded">${shortcut.key}</kbd>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function getCurrentPage() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);

    if (segments.includes('admin')) {
        const adminIndex = segments.indexOf('admin');
        return segments[adminIndex + 1] || 'dashboard';
    }

    return 'dashboard';
}

function navigateToSection(section) {
    const sectionUrls = {
        'dashboard': '/admin',
        'users': '/admin/users',
        'logs': '/admin/logs',
        'templates': '/admin/templates',
        'settings': '/admin/settings',
        'ai-tools': '/admin/ai-tools',
        'exports': '/admin/exports',
        'auth': '/admin/auth'
    };

    const url = sectionUrls[section];
    if (url) {
        window.location.href = url;
    }
}

function initializeAdminUtilsMenu() {
    // Admin utilities dropdown
    const utilsMenu = document.getElementById('adminUtilsMenu');
    if (utilsMenu) {
        utilsMenu.addEventListener('click', function(e) {
            e.preventDefault();
            toggleUtilsMenu();
        });
    }
}

function toggleUtilsMenu() {
    const menu = document.getElementById('adminUtilsDropdown');
    if (menu) {
        menu.classList.toggle('show');
    }
}

function initializeQuickActions() {
    // Quick action buttons
    const quickActions = document.querySelectorAll('.quick-action-btn');
    quickActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            performQuickAction(action);
        });
    });
}

function performQuickAction(action) {
    switch(action) {
        case 'clear-cache':
            clearSystemCache();
            break;
        case 'backup-db':
            createDatabaseBackup();
            break;
        case 'system-info':
            showSystemInfo();
            break;
        case 'restart-services':
            restartServices();
            break;
    }
}

function initializeAdminToolbar() {
    // Admin toolbar with common actions
    const toolbar = document.getElementById('adminToolbar');
    if (toolbar) {
        updateAdminToolbar();
    }
}

function updateAdminToolbar() {
    // Update toolbar based on current page and user permissions
    const currentPage = getCurrentPage();
    const toolbar = document.getElementById('adminToolbar');

    if (!toolbar) return;

    let toolbarHTML = '';

    switch(currentPage) {
        case 'users':
            toolbarHTML = `
                <button class="btn btn-primary btn-sm" onclick="showAddUserModal()">
                    <i class="fas fa-plus"></i> Add User
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="exportUsers()">
                    <i class="fas fa-download"></i> Export
                </button>
            `;
            break;
        case 'logs':
            toolbarHTML = `
                <button class="btn btn-primary btn-sm" onclick="clearOldLogs()">
                    <i class="fas fa-trash"></i> Clear Old Logs
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="exportLogs()">
                    <i class="fas fa-download"></i> Export Logs
                </button>
            `;
            break;
        case 'templates':
            toolbarHTML = `
                <button class="btn btn-primary btn-sm" onclick="createNewTemplate()">
                    <i class="fas fa-plus"></i> New Template
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="importTemplate()">
                    <i class="fas fa-upload"></i> Import
                </button>
            `;
            break;
    }

    toolbar.innerHTML = toolbarHTML;
}

function initializeContextMenus() {
    // Right-click context menus for admin elements
    document.addEventListener('contextmenu', function(e) {
        const target = e.target.closest('[data-context-menu]');
        if (target) {
            e.preventDefault();
            showContextMenu(e, target);
        }
    });

    // Hide context menu on click elsewhere
    document.addEventListener('click', function() {
        hideContextMenu();
    });
}

function showContextMenu(e, target) {
    const menuType = target.getAttribute('data-context-menu');
    const menu = generateContextMenu(menuType, target);

    if (menu) {
        const contextMenu = document.getElementById('adminContextMenu') || createContextMenu();
        contextMenu.innerHTML = menu;
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
        contextMenu.style.display = 'block';
    }
}

function generateContextMenu(menuType, target) {
    switch(menuType) {
        case 'user':
            return `
                <div class="context-menu-item" onclick="editUser('${target.getAttribute('data-user-id')}')">Edit User</div>
                <div class="context-menu-item" onclick="resetUserPassword('${target.getAttribute('data-user-id')}')">Reset Password</div>
                <div class="context-menu-item text-danger" onclick="deleteUser('${target.getAttribute('data-user-id')}')">Delete User</div>
            `;
        case 'log':
            return `
                <div class="context-menu-item" onclick="viewLogDetails('${target.getAttribute('data-log-id')}')">View Details</div>
                <div class="context-menu-item" onclick="filterByLogLevel('${target.getAttribute('data-log-level')}')">Filter by Level</div>
                <div class="context-menu-item" onclick="exportLogEntry('${target.getAttribute('data-log-id')}')">Export Entry</div>
            `;
        default:
            return null;
    }
}

function createContextMenu() {
    const menu = document.createElement('div');
    menu.id = 'adminContextMenu';
    menu.className = 'admin-context-menu';
    document.body.appendChild(menu);
    return menu;
}

function hideContextMenu() {
    const menu = document.getElementById('adminContextMenu');
    if (menu) {
        menu.style.display = 'none';
    }
}

function loadAdminPreferences() {
    const preferences = JSON.parse(localStorage.getItem('adminPreferences') || '{}');

    // Apply saved preferences
    Object.keys(preferences).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = preferences[key];
            } else {
                element.value = preferences[key];
            }
        }
    });
}

function saveAdminPreference(key, value) {
    const preferences = JSON.parse(localStorage.getItem('adminPreferences') || '{}');
    preferences[key] = value;
    localStorage.setItem('adminPreferences', JSON.stringify(preferences));
}

function initializeRealTimeUpdates() {
    // WebSocket or Server-Sent Events for real-time updates
    if (typeof EventSource !== 'undefined') {
        const eventSource = new EventSource('/admin/api/events');

        eventSource.onmessage = function(e) {
            const data = JSON.parse(e.data);
            handleRealTimeUpdate(data);
        };

        eventSource.onerror = function() {
            console.warn('Real-time updates connection lost');
        };
    }
}

function handleRealTimeUpdate(data) {
    switch(data.type) {
        case 'notification':
            loadNotifications();
            break;
        case 'user_activity':
            updateUserActivity(data);
            break;
        case 'system_status':
            updateSystemStatus(data);
            break;
    }
}

function updateUserActivity(data) {
    // Update user activity indicators
    const activityIndicator = document.getElementById('userActivityIndicator');
    if (activityIndicator) {
        activityIndicator.textContent = data.active_users + ' active';
    }
}

function updateSystemStatus(data) {
    // Update system status indicators
    const statusIndicator = document.getElementById('systemStatusIndicator');
    if (statusIndicator) {
        statusIndicator.className = `status-indicator status-${data.status}`;
        statusIndicator.textContent = data.status;
    }
}

function collapseSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.querySelector('.admin-main');

    if (sidebar && main) {
        sidebar.classList.add('collapsed');
        main.classList.add('sidebar-collapsed');
        localStorage.setItem('adminSidebarCollapsed', 'true');
    }
}

function expandSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const main = document.querySelector('.admin-main');

    if (sidebar && main) {
        sidebar.classList.remove('collapsed');
        main.classList.remove('sidebar-collapsed');
        localStorage.setItem('adminSidebarCollapsed', 'false');
    }
}

function expandSidebarIfNeeded() {
    const sidebarCollapsed = localStorage.getItem('adminSidebarCollapsed') !== 'true';
    if (sidebarCollapsed) {
        expandSidebar();
    }
}

function collapseNavigation() {
    const navigation = document.querySelector('.admin-navigation');
    if (navigation) {
        navigation.classList.add('collapsed');
    }
}

function adjustMobileLayout() {
    // Mobile-specific adjustments
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) {
        sidebar.classList.add('mobile');
    }
}

function adjustTabletLayout() {
    // Tablet-specific adjustments
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) {
        sidebar.classList.remove('mobile');
        sidebar.classList.add('tablet');
    }
}

function adjustDesktopLayout() {
    // Desktop-specific adjustments
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) {
        sidebar.classList.remove('mobile', 'tablet');
    }
}

function quickSave() {
    // Quick save functionality for current page
    const currentPage = getCurrentPage();

    switch(currentPage) {
        case 'templates':
            if (window.TemplateUtils && window.TemplateUtils.saveTemplate) {
                window.TemplateUtils.saveTemplate();
            }
            break;
        case 'settings':
            if (window.SettingsUtils && window.SettingsUtils.saveSettings) {
                window.SettingsUtils.saveSettings();
            }
            break;
    }
}

function clearSystemCache() {
    if (confirm('Are you sure you want to clear the system cache?')) {
        fetch('/admin/api/system/clear-cache', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('System cache cleared successfully', 'success');
            } else {
                showNotification('Failed to clear system cache', 'error');
            }
        })
        .catch(error => {
            console.error('Error clearing system cache:', error);
            showNotification('Error clearing system cache', 'error');
        });
    }
}

function createDatabaseBackup() {
    fetch('/admin/api/system/backup', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Database backup created successfully', 'success');
        } else {
            showNotification('Failed to create database backup', 'error');
        }
    })
    .catch(error => {
        console.error('Error creating database backup:', error);
        showNotification('Error creating database backup', 'error');
    });
}

function showSystemInfo() {
    fetch('/admin/api/system/info')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showModal('System Information', generateSystemInfoHTML(data.info));
            }
        })
        .catch(error => {
            console.error('Error loading system info:', error);
            showNotification('Error loading system information', 'error');
        });
}

function generateSystemInfoHTML(info) {
    return `
        <div class="system-info">
            <dl class="row">
                <dt class="col-sm-4">Server:</dt>
                <dd class="col-sm-8">${info.server}</dd>
                <dt class="col-sm-4">PHP Version:</dt>
                <dd class="col-sm-8">${info.php_version}</dd>
                <dt class="col-sm-4">Database:</dt>
                <dd class="col-sm-8">${info.database}</dd>
                <dt class="col-sm-4">Memory Usage:</dt>
                <dd class="col-sm-8">${info.memory_usage}</dd>
                <dt class="col-sm-4">Uptime:</dt>
                <dd class="col-sm-8">${info.uptime}</dd>
            </dl>
        </div>
    `;
}

function restartServices() {
    if (confirm('Are you sure you want to restart system services? This may cause temporary downtime.')) {
        fetch('/admin/api/system/restart-services', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Services restarted successfully', 'success');
            } else {
                showNotification('Failed to restart services', 'error');
            }
        })
        .catch(error => {
            console.error('Error restarting services:', error);
            showNotification('Error restarting services', 'error');
        });
    }
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Remove modal from DOM after it's hidden
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions globally
window.AdminUtils = {
    navigateToSection,
    showNotification,
    showModal,
    focusGlobalSearch,
    quickSave,
    clearSystemCache,
    createDatabaseBackup,
    showSystemInfo,
    restartServices,
    collapseSidebar,
    expandSidebar,
    applyTheme,
    performGlobalSearch,
    loadNotifications,
    formatTimeAgo
};