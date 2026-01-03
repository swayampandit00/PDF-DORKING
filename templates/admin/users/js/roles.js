// Roles Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadRoleStats();
});

function loadRoleStats() {
    fetch('/api/admin/roles/stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('adminCount').textContent = data.stats.admin || 0;
                document.getElementById('premiumCount').textContent = data.stats.premium || 0;
                document.getElementById('userCount').textContent = data.stats.user || 0;
            }
        })
        .catch(error => {
            console.error('Error loading role stats:', error);
        });
}

function showAddRoleModal() {
    const modal = document.getElementById('adminModal');
    const modalTitle = document.getElementById('adminModalLabel');
    const modalBody = document.getElementById('adminModalBody');

    modalTitle.textContent = 'Add New Role';
    modalBody.innerHTML = `
        <form id="addRoleForm">
            <div class="mb-3">
                <label for="roleName" class="form-label">Role Name</label>
                <input type="text" class="form-control" id="roleName" required>
            </div>
            <div class="mb-3">
                <label for="roleDescription" class="form-label">Description</label>
                <textarea class="form-control" id="roleDescription" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Permissions</label>
                <div class="permissions-list">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_users">
                        <label class="form-check-label" for="perm_users">
                            User Management
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_settings">
                        <label class="form-check-label" for="perm_settings">
                            System Settings
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_logs">
                        <label class="form-check-label" for="perm_logs">
                            View Logs
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_ai">
                        <label class="form-check-label" for="perm_ai">
                            AI Tools
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_export">
                        <label class="form-check-label" for="perm_export">
                            Export Data
                        </label>
                    </div>
                </div>
            </div>
        </form>
    `;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Handle form submission
    document.getElementById('adminModalSave').onclick = function() {
        const form = document.getElementById('addRoleForm');
        const formData = new FormData(form);

        const permissions = [];
        if (document.getElementById('perm_users').checked) permissions.push('users');
        if (document.getElementById('perm_settings').checked) permissions.push('settings');
        if (document.getElementById('perm_logs').checked) permissions.push('logs');
        if (document.getElementById('perm_ai').checked) permissions.push('ai');
        if (document.getElementById('perm_export').checked) permissions.push('export');

        const roleData = {
            name: document.getElementById('roleName').value,
            description: document.getElementById('roleDescription').value,
            permissions: permissions
        };

        fetch('/api/admin/roles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roleData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Success', 'Role created successfully', 'success');
                bsModal.hide();
                location.reload();
            } else {
                showToast('Error', data.message || 'Failed to create role', 'error');
            }
        })
        .catch(error => {
            console.error('Error creating role:', error);
            showToast('Error', 'Failed to create role', 'error');
        });
    };
}

function editRole(roleName) {
    fetch(`/api/admin/roles/${roleName}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showEditRoleModal(data.role);
            }
        })
        .catch(error => {
            console.error('Error loading role:', error);
            showToast('Error', 'Failed to load role details', 'error');
        });
}

function showEditRoleModal(role) {
    const modal = document.getElementById('adminModal');
    const modalTitle = document.getElementById('adminModalLabel');
    const modalBody = document.getElementById('adminModalBody');

    modalTitle.textContent = `Edit Role: ${role.name}`;
    modalBody.innerHTML = `
        <form id="editRoleForm">
            <div class="mb-3">
                <label for="roleName" class="form-label">Role Name</label>
                <input type="text" class="form-control" id="roleName" value="${role.name}" required>
            </div>
            <div class="mb-3">
                <label for="roleDescription" class="form-label">Description</label>
                <textarea class="form-control" id="roleDescription" rows="3">${role.description || ''}</textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Permissions</label>
                <div class="permissions-list">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_users" ${role.permissions.includes('users') ? 'checked' : ''}>
                        <label class="form-check-label" for="perm_users">
                            User Management
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_settings" ${role.permissions.includes('settings') ? 'checked' : ''}>
                        <label class="form-check-label" for="perm_settings">
                            System Settings
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_logs" ${role.permissions.includes('logs') ? 'checked' : ''}>
                        <label class="form-check-label" for="perm_logs">
                            View Logs
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_ai" ${role.permissions.includes('ai') ? 'checked' : ''}>
                        <label class="form-check-label" for="perm_ai">
                            AI Tools
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="perm_export" ${role.permissions.includes('export') ? 'checked' : ''}>
                        <label class="form-check-label" for="perm_export">
                            Export Data
                        </label>
                    </div>
                </div>
            </div>
        </form>
    `;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Handle form submission
    document.getElementById('adminModalSave').onclick = function() {
        const permissions = [];
        if (document.getElementById('perm_users').checked) permissions.push('users');
        if (document.getElementById('perm_settings').checked) permissions.push('settings');
        if (document.getElementById('perm_logs').checked) permissions.push('logs');
        if (document.getElementById('perm_ai').checked) permissions.push('ai');
        if (document.getElementById('perm_export').checked) permissions.push('export');

        const roleData = {
            name: document.getElementById('roleName').value,
            description: document.getElementById('roleDescription').value,
            permissions: permissions
        };

        fetch(`/api/admin/roles/${role.name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roleData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Success', 'Role updated successfully', 'success');
                bsModal.hide();
                location.reload();
            } else {
                showToast('Error', data.message || 'Failed to update role', 'error');
            }
        })
        .catch(error => {
            console.error('Error updating role:', error);
            showToast('Error', 'Failed to update role', 'error');
        });
    };
}

function showToast(title, message, type = 'info') {
    const toast = document.getElementById('adminToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.className = `toast toast-${type}`;

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}