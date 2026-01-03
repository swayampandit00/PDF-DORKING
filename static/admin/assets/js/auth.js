// Auth.js - Authentication functionality for admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthFunctions();
});

function initializeAuthFunctions() {
    // Initialize all auth components
    initializeLoginManagement();
    initializeSessionManagement();
    initializePermissionManagement();
    initializeAuthSettings();
    initializeAuthLogs();

    // Handle auth forms
    handleAuthForms();

    // Initialize auth analytics
    initializeAuthAnalytics();
}

function initializeLoginManagement() {
    // Force logout functionality
    const forceLogoutBtn = document.getElementById('forceLogoutBtn');
    if (forceLogoutBtn) {
        forceLogoutBtn.addEventListener('click', function() {
            forceUserLogout();
        });
    }

    // Bulk logout functionality
    const bulkLogoutBtn = document.getElementById('bulkLogoutBtn');
    if (bulkLogoutBtn) {
        bulkLogoutBtn.addEventListener('click', function() {
            bulkLogoutUsers();
        });
    }

    // Active sessions table
    initializeActiveSessionsTable();
}

function initializeSessionManagement() {
    // Session timeout settings
    const sessionTimeout = document.getElementById('globalSessionTimeout');
    const timeoutDisplay = document.getElementById('timeoutDisplay');

    if (sessionTimeout && timeoutDisplay) {
        sessionTimeout.addEventListener('input', function() {
            timeoutDisplay.textContent = this.value + ' minutes';
        });
    }

    // Clear expired sessions
    const clearExpiredBtn = document.getElementById('clearExpiredSessionsBtn');
    if (clearExpiredBtn) {
        clearExpiredBtn.addEventListener('click', function() {
            clearExpiredSessions();
        });
    }

    // Session monitoring
    initializeSessionMonitoring();
}

function initializePermissionManagement() {
    // Role management
    initializeRoleManagement();

    // Permission matrix
    initializePermissionMatrix();

    // User role assignment
    initializeUserRoleAssignment();
}

function initializeAuthSettings() {
    // Password policy settings
    initializePasswordPolicy();

    // Login attempt settings
    initializeLoginAttempts();

    // Two-factor authentication settings
    initializeTwoFactorSettings();

    // OAuth settings
    initializeOAuthSettings();
}

function initializeAuthLogs() {
    // Authentication logs table
    initializeAuthLogsTable();

    // Failed login attempts table
    initializeFailedLoginTable();

    // Security events table
    initializeSecurityEventsTable();
}

function handleAuthForms() {
    const authForms = document.querySelectorAll('.auth-form');

    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formType = this.getAttribute('data-form-type');

            switch(formType) {
                case 'force-logout':
                    forceUserLogout();
                    break;
                case 'bulk-logout':
                    bulkLogoutUsers();
                    break;
                case 'session-settings':
                    saveSessionSettings();
                    break;
                case 'create-role':
                    createRole();
                    break;
                case 'update-permissions':
                    updatePermissions();
                    break;
                case 'auth-settings':
                    saveAuthSettings();
                    break;
            }
        });
    });
}

function initializeActiveSessionsTable() {
    // Initialize DataTable for active sessions
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#activeSessionsTable').DataTable({
            ajax: {
                url: '/admin/api/auth/sessions/active',
                type: 'GET'
            },
            columns: [
                { data: 'user_id' },
                { data: 'username' },
                { data: 'ip_address' },
                { data: 'user_agent' },
                { data: 'login_time' },
                { data: 'last_activity' },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <button class="btn btn-sm btn-warning" onclick="forceLogoutSession('${data.session_id}')" title="Force Logout">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                            <button class="btn btn-sm btn-info" onclick="viewSessionDetails('${data.session_id}')" title="Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        `;
                    }
                }
            ],
            order: [[5, 'desc']],
            pageLength: 10
        });
    }
}

function initializeSessionMonitoring() {
    // Real-time session monitoring
    setInterval(() => {
        updateSessionStats();
    }, 30000); // Update every 30 seconds

    // Initial load
    updateSessionStats();
}

function initializeRoleManagement() {
    // Load existing roles
    loadRoles();

    // Role creation form
    const createRoleForm = document.getElementById('createRoleForm');
    if (createRoleForm) {
        createRoleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createRole();
        });
    }

    // Role editing
    initializeRoleEditing();
}

function initializePermissionMatrix() {
    // Load permissions matrix
    loadPermissionMatrix();

    // Permission checkboxes
    const permissionCheckboxes = document.querySelectorAll('.permission-checkbox');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateRolePermissions(this.getAttribute('data-role'), this.getAttribute('data-permission'), this.checked);
        });
    });
}

function initializeUserRoleAssignment() {
    // User role assignment table
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#userRoleAssignmentTable').DataTable({
            ajax: {
                url: '/admin/api/auth/users/roles',
                type: 'GET'
            },
            columns: [
                { data: 'username' },
                { data: 'email' },
                { data: 'current_role' },
                { data: 'assigned_at' },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <select class="form-select form-select-sm" onchange="changeUserRole('${data.user_id}', this.value)">
                                <option value="">Change Role...</option>
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                                <option value="user">User</option>
                                <option value="guest">Guest</option>
                            </select>
                        `;
                    }
                }
            ],
            order: [[0, 'asc']],
            pageLength: 15
        });
    }
}

function initializePasswordPolicy() {
    // Password policy settings
    const passwordPolicy = {
        minLength: document.getElementById('minPasswordLength'),
        requireUppercase: document.getElementById('requireUppercase'),
        requireLowercase: document.getElementById('requireLowercase'),
        requireNumbers: document.getElementById('requireNumbers'),
        requireSpecialChars: document.getElementById('requireSpecialChars'),
        preventReuse: document.getElementById('preventPasswordReuse'),
        expiryDays: document.getElementById('passwordExpiryDays')
    };

    // Update policy preview
    Object.values(passwordPolicy).forEach(element => {
        if (element) {
            element.addEventListener('change', updatePasswordPolicyPreview);
        }
    });
}

function initializeLoginAttempts() {
    // Login attempt settings
    const maxAttempts = document.getElementById('maxLoginAttempts');
    const lockoutDuration = document.getElementById('lockoutDuration');
    const lockoutDisplay = document.getElementById('lockoutDisplay');

    if (maxAttempts && lockoutDuration && lockoutDisplay) {
        lockoutDuration.addEventListener('input', function() {
            lockoutDisplay.textContent = this.value + ' minutes';
        });
    }
}

function initializeTwoFactorSettings() {
    // 2FA settings
    const enable2FA = document.getElementById('enableGlobal2FA');
    const twoFactorSettings = document.getElementById('globalTwoFactorSettings');

    if (enable2FA && twoFactorSettings) {
        enable2FA.addEventListener('change', function() {
            twoFactorSettings.style.display = this.checked ? 'block' : 'none';
        });
    }

    // 2FA provider settings
    const twoFactorProvider = document.getElementById('twoFactorProvider');
    const providerSettings = document.querySelectorAll('.provider-settings');

    if (twoFactorProvider) {
        twoFactorProvider.addEventListener('change', function() {
            providerSettings.forEach(setting => {
                setting.style.display = setting.getAttribute('data-provider') === this.value ? 'block' : 'none';
            });
        });
    }
}

function initializeOAuthSettings() {
    // OAuth provider toggles
    const oauthProviders = document.querySelectorAll('.oauth-provider-toggle');
    oauthProviders.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const provider = this.getAttribute('data-provider');
            const settings = document.getElementById(`${provider}Settings`);
            if (settings) {
                settings.style.display = this.checked ? 'block' : 'none';
            }
        });
    });

    // Test OAuth connections
    const testOAuthBtns = document.querySelectorAll('.test-oauth-btn');
    testOAuthBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            testOAuthConnection(this.getAttribute('data-provider'));
        });
    });
}

function initializeAuthLogsTable() {
    // Authentication logs
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#authLogsTable').DataTable({
            ajax: {
                url: '/admin/api/auth/logs',
                type: 'GET'
            },
            columns: [
                { data: 'timestamp' },
                { data: 'username' },
                { data: 'action' },
                { data: 'ip_address' },
                { data: 'user_agent' },
                { data: 'status' }
            ],
            order: [[0, 'desc']],
            pageLength: 25
        });
    }
}

function initializeFailedLoginTable() {
    // Failed login attempts
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#failedLoginTable').DataTable({
            ajax: {
                url: '/admin/api/auth/failed-logins',
                type: 'GET'
            },
            columns: [
                { data: 'timestamp' },
                { data: 'username' },
                { data: 'ip_address' },
                { data: 'attempts' },
                { data: 'last_attempt' },
                {
                    data: null,
                    render: function(data) {
                        return data.locked ? 
                            `<span class="badge bg-danger">Locked until ${data.lockout_until}</span>` :
                            `<button class="btn btn-sm btn-warning" onclick="unlockAccount('${data.username}')">Unlock</button>`;
                    }
                }
            ],
            order: [[4, 'desc']],
            pageLength: 15
        });
    }
}

function initializeSecurityEventsTable() {
    // Security events
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#securityEventsTable').DataTable({
            ajax: {
                url: '/admin/api/auth/security-events',
                type: 'GET'
            },
            columns: [
                { data: 'timestamp' },
                { data: 'event_type' },
                { data: 'username' },
                { data: 'ip_address' },
                { data: 'description' },
                { data: 'severity' }
            ],
            order: [[0, 'desc']],
            pageLength: 20
        });
    }
}

function initializeAuthAnalytics() {
    // Load authentication analytics
    loadAuthAnalytics();

    // Initialize auth charts
    initializeAuthCharts();

    // Refresh analytics button
    const refreshBtn = document.getElementById('refreshAuthAnalytics');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadAuthAnalytics();
            initializeAuthCharts();
        });
    }
}

function forceUserLogout() {
    const userId = document.getElementById('forceLogoutUserId').value;
    if (!userId) {
        showNotification('Please select a user to logout', 'warning');
        return;
    }

    if (confirm('Are you sure you want to force logout this user?')) {
        fetch(`/admin/api/auth/sessions/logout/${userId}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('User logged out successfully', 'success');
                refreshActiveSessionsTable();
            } else {
                showNotification('Failed to logout user', 'error');
            }
        })
        .catch(error => {
            console.error('Error forcing logout:', error);
            showNotification('Error forcing logout', 'error');
        });
    }
}

function forceLogoutSession(sessionId) {
    if (confirm('Are you sure you want to terminate this session?')) {
        fetch(`/admin/api/auth/sessions/terminate/${sessionId}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Session terminated successfully', 'success');
                refreshActiveSessionsTable();
            } else {
                showNotification('Failed to terminate session', 'error');
            }
        })
        .catch(error => {
            console.error('Error terminating session:', error);
            showNotification('Error terminating session', 'error');
        });
    }
}

function bulkLogoutUsers() {
    const criteria = document.getElementById('bulkLogoutCriteria').value;
    if (!criteria) {
        showNotification('Please select logout criteria', 'warning');
        return;
    }

    if (confirm(`Are you sure you want to logout all users ${criteria}?`)) {
        fetch('/admin/api/auth/sessions/bulk-logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ criteria })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`${data.affected} users logged out successfully`, 'success');
                refreshActiveSessionsTable();
            } else {
                showNotification('Failed to perform bulk logout', 'error');
            }
        })
        .catch(error => {
            console.error('Error performing bulk logout:', error);
            showNotification('Error performing bulk logout', 'error');
        });
    }
}

function clearExpiredSessions() {
    if (confirm('Are you sure you want to clear all expired sessions?')) {
        fetch('/admin/api/auth/sessions/clear-expired', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`${data.cleared} expired sessions cleared`, 'success');
                refreshActiveSessionsTable();
            } else {
                showNotification('Failed to clear expired sessions', 'error');
            }
        })
        .catch(error => {
            console.error('Error clearing expired sessions:', error);
            showNotification('Error clearing expired sessions', 'error');
        });
    }
}

function updateSessionStats() {
    fetch('/admin/api/auth/sessions/stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update session statistics
                Object.keys(data.stats).forEach(key => {
                    const element = document.getElementById(`session-stat-${key}`);
                    if (element) {
                        element.textContent = data.stats[key];
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error updating session stats:', error);
        });
}

function loadRoles() {
    fetch('/admin/api/auth/roles')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayRoles(data.roles);
            }
        })
        .catch(error => {
            console.error('Error loading roles:', error);
        });
}

function displayRoles(roles) {
    const rolesContainer = document.getElementById('rolesList');
    if (!rolesContainer) return;

    let html = '';
    roles.forEach(role => {
        html += `
            <div class="role-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${role.name}</h6>
                        <p class="mb-1 text-muted">${role.description}</p>
                        <small class="text-muted">${role.user_count} users</small>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editRole('${role.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteRole('${role.id}')" ${role.protected ? 'disabled' : ''}>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    rolesContainer.innerHTML = html;
}

function createRole() {
    const formData = new FormData(document.getElementById('createRoleForm'));

    const roleData = {
        name: formData.get('roleName'),
        description: formData.get('roleDescription'),
        permissions: formData.getAll('permissions[]')
    };

    fetch('/admin/api/auth/roles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Role created successfully', 'success');
            loadRoles();
            document.getElementById('createRoleForm').reset();
        } else {
            showNotification('Failed to create role: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error creating role:', error);
        showNotification('Error creating role', 'error');
    });
}

function loadPermissionMatrix() {
    fetch('/admin/api/auth/permissions/matrix')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderPermissionMatrix(data.matrix);
            }
        })
        .catch(error => {
            console.error('Error loading permission matrix:', error);
        });
}

function renderPermissionMatrix(matrix) {
    const matrixContainer = document.getElementById('permissionMatrix');
    if (!matrixContainer) return;

    let html = '<table class="table table-bordered"><thead><tr><th>Role</th>';

    // Get all unique permissions
    const allPermissions = [...new Set(matrix.flatMap(role => Object.keys(role.permissions)))];

    allPermissions.forEach(permission => {
        html += `<th>${permission}</th>`;
    });

    html += '</tr></thead><tbody>';

    matrix.forEach(role => {
        html += `<tr><td><strong>${role.name}</strong></td>`;
        allPermissions.forEach(permission => {
            const hasPermission = role.permissions[permission];
            html += `<td class="text-center">
                <input type="checkbox" class="permission-checkbox" 
                       data-role="${role.id}" data-permission="${permission}" 
                       ${hasPermission ? 'checked' : ''}>
            </td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    matrixContainer.innerHTML = html;
}

function updateRolePermissions(roleId, permission, granted) {
    fetch(`/admin/api/auth/roles/${roleId}/permissions`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            permission,
            granted
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            showNotification('Failed to update permission', 'error');
            // Revert checkbox
            event.target.checked = !event.target.checked;
        }
    })
    .catch(error => {
        console.error('Error updating permission:', error);
        showNotification('Error updating permission', 'error');
        // Revert checkbox
        event.target.checked = !event.target.checked;
    });
}

function changeUserRole(userId, newRole) {
    if (!newRole) return;

    fetch(`/admin/api/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('User role updated successfully', 'success');
            refreshUserRoleAssignmentTable();
        } else {
            showNotification('Failed to update user role', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating user role:', error);
        showNotification('Error updating user role', 'error');
    });
}

function updatePasswordPolicyPreview() {
    const policy = {
        minLength: document.getElementById('minPasswordLength').value,
        requireUppercase: document.getElementById('requireUppercase').checked,
        requireLowercase: document.getElementById('requireLowercase').checked,
        requireNumbers: document.getElementById('requireNumbers').checked,
        requireSpecialChars: document.getElementById('requireSpecialChars').checked
    };

    const preview = document.getElementById('passwordPolicyPreview');
    if (preview) {
        let requirements = [];
        if (policy.requireUppercase) requirements.push('uppercase letter');
        if (policy.requireLowercase) requirements.push('lowercase letter');
        if (policy.requireNumbers) requirements.push('number');
        if (policy.requireSpecialChars) requirements.push('special character');

        preview.innerHTML = `
            <strong>Password Requirements:</strong><br>
            Minimum length: ${policy.minLength} characters<br>
            ${requirements.length > 0 ? 'Must contain: ' + requirements.join(', ') : 'No additional requirements'}
        `;
    }
}

function saveSessionSettings() {
    const formData = new FormData(document.getElementById('sessionSettingsForm'));

    const settings = {
        sessionTimeout: formData.get('sessionTimeout'),
        rememberMeDuration: formData.get('rememberMeDuration'),
        concurrentSessions: formData.get('concurrentSessions'),
        sessionMonitoring: formData.get('sessionMonitoring') === 'on'
    };

    fetch('/admin/api/auth/settings/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Session settings saved successfully', 'success');
        } else {
            showNotification('Failed to save session settings', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving session settings:', error);
        showNotification('Error saving session settings', 'error');
    });
}

function saveAuthSettings() {
    const formData = new FormData(document.getElementById('authSettingsForm'));

    const settings = {
        passwordPolicy: {
            minLength: formData.get('minPasswordLength'),
            requireUppercase: formData.get('requireUppercase') === 'on',
            requireLowercase: formData.get('requireLowercase') === 'on',
            requireNumbers: formData.get('requireNumbers') === 'on',
            requireSpecialChars: formData.get('requireSpecialChars') === 'on',
            preventReuse: formData.get('preventPasswordReuse') === 'on',
            expiryDays: formData.get('passwordExpiryDays')
        },
        loginAttempts: {
            maxAttempts: formData.get('maxLoginAttempts'),
            lockoutDuration: formData.get('lockoutDuration')
        },
        twoFactor: {
            enabled: formData.get('enableGlobal2FA') === 'on',
            provider: formData.get('twoFactorProvider')
        }
    };

    fetch('/admin/api/auth/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Authentication settings saved successfully', 'success');
        } else {
            showNotification('Failed to save authentication settings', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving auth settings:', error);
        showNotification('Error saving authentication settings', 'error');
    });
}

function testOAuthConnection(provider) {
    const testBtn = document.querySelector(`.test-oauth-btn[data-provider="${provider}"]`);
    const originalText = testBtn.textContent;

    testBtn.disabled = true;
    testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

    fetch(`/admin/api/auth/oauth/test/${provider}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(`${provider} connection successful`, 'success');
        } else {
            showNotification(`${provider} connection failed: ${data.message}`, 'error');
        }
    })
    .catch(error => {
        console.error(`Error testing ${provider} connection:`, error);
        showNotification(`Error testing ${provider} connection`, 'error');
    })
    .finally(() => {
        testBtn.disabled = false;
        testBtn.textContent = originalText;
    });
}

function unlockAccount(username) {
    if (confirm(`Are you sure you want to unlock the account for ${username}?`)) {
        fetch(`/admin/api/auth/accounts/unlock/${username}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Account unlocked successfully', 'success');
                refreshFailedLoginTable();
            } else {
                showNotification('Failed to unlock account', 'error');
            }
        })
        .catch(error => {
            console.error('Error unlocking account:', error);
            showNotification('Error unlocking account', 'error');
        });
    }
}

function loadAuthAnalytics() {
    fetch('/admin/api/auth/analytics')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateAuthStats(data.stats);
            }
        })
        .catch(error => {
            console.error('Error loading auth analytics:', error);
        });
}

function updateAuthStats(stats) {
    // Update authentication statistics
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(`auth-stat-${key}`);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

function initializeAuthCharts() {
    // Login attempts chart
    const loginChartCanvas = document.getElementById('loginAttemptsChart');
    if (loginChartCanvas && typeof Chart !== 'undefined') {
        fetch('/admin/api/auth/analytics/login-attempts')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    new Chart(loginChartCanvas, {
                        type: 'line',
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'Successful Logins',
                                data: data.successful,
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            }, {
                                label: 'Failed Logins',
                                data: data.failed,
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Login Attempts Over Time'
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading login attempts data:', error);
            });
    }
}

function viewSessionDetails(sessionId) {
    fetch(`/admin/api/auth/sessions/${sessionId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSessionDetailsModal(data.session);
            }
        })
        .catch(error => {
            console.error('Error getting session details:', error);
        });
}

function showSessionDetailsModal(session) {
    // Create and show modal with session details
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Session Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <dl class="row">
                        <dt class="col-sm-4">Session ID:</dt>
                        <dd class="col-sm-8"><code>${session.session_id}</code></dd>
                        <dt class="col-sm-4">User:</dt>
                        <dd class="col-sm-8">${session.username} (${session.user_id})</dd>
                        <dt class="col-sm-4">IP Address:</dt>
                        <dd class="col-sm-8">${session.ip_address}</dd>
                        <dt class="col-sm-4">User Agent:</dt>
                        <dd class="col-sm-8"><small>${session.user_agent}</small></dd>
                        <dt class="col-sm-4">Login Time:</dt>
                        <dd class="col-sm-8">${session.login_time}</dd>
                        <dt class="col-sm-4">Last Activity:</dt>
                        <dd class="col-sm-8">${session.last_activity}</dd>
                        <dt class="col-sm-4">Expires:</dt>
                        <dd class="col-sm-8">${session.expires_at}</dd>
                    </dl>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-warning" onclick="forceLogoutSession('${session.session_id}')">Terminate Session</button>
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

function refreshActiveSessionsTable() {
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#activeSessionsTable').DataTable().ajax.reload();
    }
}

function refreshUserRoleAssignmentTable() {
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#userRoleAssignmentTable').DataTable().ajax.reload();
    }
}

function refreshFailedLoginTable() {
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#failedLoginTable').DataTable().ajax.reload();
    }
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

// Export functions globally
window.AuthUtils = {
    forceUserLogout,
    forceLogoutSession,
    bulkLogoutUsers,
    clearExpiredSessions,
    createRole,
    updateRolePermissions,
    changeUserRole,
    saveSessionSettings,
    saveAuthSettings,
    testOAuthConnection,
    unlockAccount,
    viewSessionDetails,
    showNotification
};