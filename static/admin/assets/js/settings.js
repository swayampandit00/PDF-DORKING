// Settings.js - Admin settings functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
});

function initializeSettings() {
    // Initialize all settings components
    initializeGeneralSettings();
    initializeSecuritySettings();
    initializeEmailSettings();
    initializeAPISettings();
    initializeBackupSettings();
    initializeMaintenanceSettings();

    // Handle form submissions
    handleSettingsForms();

    // Initialize settings tabs
    initializeSettingsTabs();

    // Load current settings
    loadCurrentSettings();
}

function initializeGeneralSettings() {
    // Site name input with character counter
    const siteNameInput = document.getElementById('siteName');
    const siteNameCounter = document.getElementById('siteNameCounter');

    if (siteNameInput && siteNameCounter) {
        siteNameInput.addEventListener('input', function() {
            const remaining = 100 - this.value.length;
            siteNameCounter.textContent = remaining;
            siteNameCounter.className = remaining < 0 ? 'text-danger' : 'text-muted';
        });
    }

    // Logo upload preview
    const logoInput = document.getElementById('siteLogo');
    const logoPreview = document.getElementById('logoPreview');

    if (logoInput && logoPreview) {
        logoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                    logoPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Theme selector
    const themeSelector = document.getElementById('siteTheme');
    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            applyTheme(this.value);
        });
    }
}

function initializeSecuritySettings() {
    // Password strength indicator
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            updatePasswordStrength(this);
        });
    });

    // Two-factor authentication toggle
    const twoFactorToggle = document.getElementById('enable2FA');
    const twoFactorSettings = document.getElementById('twoFactorSettings');

    if (twoFactorToggle && twoFactorSettings) {
        twoFactorToggle.addEventListener('change', function() {
            twoFactorSettings.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Session timeout slider
    const sessionTimeout = document.getElementById('sessionTimeout');
    const timeoutValue = document.getElementById('timeoutValue');

    if (sessionTimeout && timeoutValue) {
        sessionTimeout.addEventListener('input', function() {
            timeoutValue.textContent = this.value + ' minutes';
        });
    }
}

function initializeEmailSettings() {
    // Email provider selector
    const emailProvider = document.getElementById('emailProvider');
    const smtpSettings = document.getElementById('smtpSettings');
    const sendgridSettings = document.getElementById('sendgridSettings');
    const mailgunSettings = document.getElementById('mailgunSettings');

    if (emailProvider) {
        emailProvider.addEventListener('change', function() {
            // Hide all provider settings
            [smtpSettings, sendgridSettings, mailgunSettings].forEach(setting => {
                if (setting) setting.style.display = 'none';
            });

            // Show selected provider settings
            const selectedProvider = this.value;
            switch(selectedProvider) {
                case 'smtp':
                    if (smtpSettings) smtpSettings.style.display = 'block';
                    break;
                case 'sendgrid':
                    if (sendgridSettings) sendgridSettings.style.display = 'block';
                    break;
                case 'mailgun':
                    if (mailgunSettings) mailgunSettings.style.display = 'block';
                    break;
            }
        });
    }

    // Test email functionality
    const testEmailBtn = document.getElementById('testEmailBtn');
    if (testEmailBtn) {
        testEmailBtn.addEventListener('click', function() {
            testEmailConfiguration();
        });
    }
}

function initializeAPISettings() {
    // API key generator
    const generateApiKeyBtn = document.getElementById('generateApiKey');
    const apiKeyInput = document.getElementById('apiKey');

    if (generateApiKeyBtn && apiKeyInput) {
        generateApiKeyBtn.addEventListener('click', function() {
            const newKey = generateAPIKey();
            apiKeyInput.value = newKey;
        });
    }

    // Rate limiting sliders
    const rateLimitInputs = document.querySelectorAll('.rate-limit-input');
    rateLimitInputs.forEach(input => {
        const display = input.nextElementSibling;
        if (display && display.classList.contains('rate-limit-display')) {
            input.addEventListener('input', function() {
                display.textContent = this.value + ' requests/minute';
            });
        }
    });
}

function initializeBackupSettings() {
    // Backup frequency selector
    const backupFrequency = document.getElementById('backupFrequency');
    const customSchedule = document.getElementById('customSchedule');

    if (backupFrequency && customSchedule) {
        backupFrequency.addEventListener('change', function() {
            customSchedule.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }

    // Manual backup button
    const manualBackupBtn = document.getElementById('manualBackupBtn');
    if (manualBackupBtn) {
        manualBackupBtn.addEventListener('click', function() {
            performManualBackup();
        });
    }

    // Backup history table
    initializeBackupHistoryTable();
}

function initializeMaintenanceSettings() {
    // Maintenance mode toggle
    const maintenanceMode = document.getElementById('maintenanceMode');
    const maintenanceMessage = document.getElementById('maintenanceMessage');

    if (maintenanceMode && maintenanceMessage) {
        maintenanceMode.addEventListener('change', function() {
            maintenanceMessage.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Cache clearing buttons
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    const clearSessionsBtn = document.getElementById('clearSessionsBtn');

    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', function() {
            clearCache();
        });
    }

    if (clearSessionsBtn) {
        clearSessionsBtn.addEventListener('click', function() {
            clearUserSessions();
        });
    }
}

function initializeSettingsTabs() {
    const tabButtons = document.querySelectorAll('.settings-tab-btn');
    const tabContents = document.querySelectorAll('.settings-tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function handleSettingsForms() {
    const settingsForms = document.querySelectorAll('.settings-form');

    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings(this);
        });
    });
}

function loadCurrentSettings() {
    // Load settings from server
    fetch('/admin/api/settings')
        .then(response => response.json())
        .then(data => {
            populateSettingsForm(data);
        })
        .catch(error => {
            console.error('Error loading settings:', error);
            showNotification('Error loading settings', 'error');
        });
}

function populateSettingsForm(settings) {
    // Populate form fields with current settings
    Object.keys(settings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = settings[key];
            } else {
                element.value = settings[key];
            }
        }
    });

    // Trigger change events to update UI
    document.querySelectorAll('select, input[type="checkbox"]').forEach(element => {
        element.dispatchEvent(new Event('change'));
    });
}

function saveSettings(form) {
    const formData = new FormData(form);
    const settings = {};

    for (let [key, value] of formData.entries()) {
        // Convert checkbox values to boolean
        if (form.elements[key].type === 'checkbox') {
            settings[key] = form.elements[key].checked;
        } else {
            settings[key] = value;
        }
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    // Save settings to server
    fetch('/admin/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Settings saved successfully', 'success');
        } else {
            showNotification('Error saving settings', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving settings:', error);
        showNotification('Error saving settings', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

function updatePasswordStrength(input) {
    const strengthIndicator = input.parentElement.querySelector('.password-strength');
    if (!strengthIndicator) return;

    const password = input.value;
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Lowercase letter');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Uppercase letter');

    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Number');

    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Special character');

    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthClasses = ['very-weak', 'weak', 'fair', 'good', 'strong'];

    strengthIndicator.className = `password-strength ${strengthClasses[strength]}`;
    strengthIndicator.textContent = strengthTexts[strength];

    if (feedback.length > 0 && password.length > 0) {
        strengthIndicator.title = 'Missing: ' + feedback.join(', ');
    }
}

function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');

    if (theme !== 'auto') {
        body.classList.add(`theme-${theme}`);
    }

    // Save theme preference
    localStorage.setItem('adminTheme', theme);
}

function generateAPIKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function testEmailConfiguration() {
    const testEmailBtn = document.getElementById('testEmailBtn');
    const originalText = testEmailBtn.textContent;

    testEmailBtn.disabled = true;
    testEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

    fetch('/admin/api/test-email', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Test email sent successfully', 'success');
        } else {
            showNotification('Failed to send test email: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error testing email:', error);
        showNotification('Error testing email configuration', 'error');
    })
    .finally(() => {
        testEmailBtn.disabled = false;
        testEmailBtn.textContent = originalText;
    });
}

function performManualBackup() {
    const backupBtn = document.getElementById('manualBackupBtn');
    const originalText = backupBtn.textContent;

    backupBtn.disabled = true;
    backupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Backup...';

    fetch('/admin/api/backup', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Backup created successfully', 'success');
            // Refresh backup history
            loadBackupHistory();
        } else {
            showNotification('Failed to create backup: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error creating backup:', error);
        showNotification('Error creating backup', 'error');
    })
    .finally(() => {
        backupBtn.disabled = false;
        backupBtn.textContent = originalText;
    });
}

function initializeBackupHistoryTable() {
    // Initialize DataTable for backup history
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#backupHistoryTable').DataTable({
            ajax: {
                url: '/admin/api/backups',
                type: 'GET'
            },
            columns: [
                { data: 'filename' },
                { data: 'size' },
                { data: 'created_at' },
                { data: 'status' },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <button class="btn btn-sm btn-primary" onclick="downloadBackup('${data.id}')">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteBackup('${data.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;
                    }
                }
            ],
            order: [[2, 'desc']],
            pageLength: 10
        });
    }
}

function downloadBackup(backupId) {
    window.open(`/admin/api/backups/${backupId}/download`, '_blank');
}

function deleteBackup(backupId) {
    if (confirm('Are you sure you want to delete this backup?')) {
        fetch(`/admin/api/backups/${backupId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Backup deleted successfully', 'success');
                $('#backupHistoryTable').DataTable().ajax.reload();
            } else {
                showNotification('Failed to delete backup', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting backup:', error);
            showNotification('Error deleting backup', 'error');
        });
    }
}

function clearCache() {
    const cacheBtn = document.getElementById('clearCacheBtn');
    const originalText = cacheBtn.textContent;

    cacheBtn.disabled = true;
    cacheBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';

    fetch('/admin/api/clear-cache', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Cache cleared successfully', 'success');
        } else {
            showNotification('Failed to clear cache', 'error');
        }
    })
    .catch(error => {
        console.error('Error clearing cache:', error);
        showNotification('Error clearing cache', 'error');
    })
    .finally(() => {
        cacheBtn.disabled = false;
        cacheBtn.textContent = originalText;
    });
}

function clearUserSessions() {
    if (confirm('Are you sure you want to clear all user sessions? This will log out all users.')) {
        const sessionsBtn = document.getElementById('clearSessionsBtn');
        const originalText = sessionsBtn.textContent;

        sessionsBtn.disabled = true;
        sessionsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';

        fetch('/admin/api/clear-sessions', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('User sessions cleared successfully', 'success');
            } else {
                showNotification('Failed to clear user sessions', 'error');
            }
        })
        .catch(error => {
            console.error('Error clearing sessions:', error);
            showNotification('Error clearing sessions', 'error');
        })
        .finally(() => {
            sessionsBtn.disabled = false;
            sessionsBtn.textContent = originalText;
        });
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
window.SettingsUtils = {
    saveSettings,
    loadCurrentSettings,
    applyTheme,
    generateAPIKey,
    testEmailConfiguration,
    performManualBackup,
    clearCache,
    clearUserSessions,
    showNotification
};