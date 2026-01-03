// Users Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize users page
    if (document.getElementById('usersTable')) {
        loadUsers();
        initializeUserFilters();
    }

    // Initialize user view page
    if (document.getElementById('userName')) {
        loadUserDetails();
    }

    // Initialize forms
    initializeForms();
});

function loadUsers(page = 1) {
    const loader = document.getElementById('adminLoader');
    loader.style.display = 'flex';

    fetch(`/api/admin/users?page=${page}`)
        .then(response => response.json())
        .then(data => {
            renderUsersTable(data.users);
            renderPagination(data.pagination);
            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading users:', error);
            showToast('Error', 'Failed to load users', 'error');
            loader.style.display = 'none';
        });
}

function renderUsersTable(users) {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div class="user-cell">
                    <i class="fas fa-user-circle"></i>
                    <span>${user.username}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${user.role}</span></td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>${formatDate(user.created_at)}</td>
            <td>${user.last_login ? formatDate(user.last_login) : 'Never'}</td>
            <td>${user.search_count || 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderPagination(pagination) {
    const paginationEl = document.getElementById('usersPagination');
    paginationEl.innerHTML = '';

    for (let i = 1; i <= pagination.total_pages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === pagination.current_page ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="loadUsers(${i})">${i}</a>`;
        paginationEl.appendChild(li);
    }
}

function initializeUserFilters() {
    const searchInput = document.getElementById('userSearch');
    const statusFilter = document.getElementById('statusFilter');
    const roleFilter = document.getElementById('roleFilter');

    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadUsers();
        }, 500);
    });

    statusFilter.addEventListener('change', () => loadUsers());
    roleFilter.addEventListener('change', () => loadUsers());
}

function viewUser(userId) {
    window.location.href = `/admin/users/view/${userId}`;
}

function editUser(userId) {
    window.location.href = `/admin/users/edit/${userId}`;
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Success', 'User deleted successfully', 'success');
                loadUsers();
            } else {
                showToast('Error', data.message || 'Failed to delete user', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            showToast('Error', 'Failed to delete user', 'error');
        });
    }
}

function showAddUserModal() {
    window.location.href = '/admin/users/add';
}

function initializeForms() {
    // Add User Form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);

            fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Success', 'User created successfully', 'success');
                    setTimeout(() => {
                        window.location.href = '/admin/users';
                    }, 1500);
                } else {
                    showToast('Error', data.message || 'Failed to create user', 'error');
                }
            })
            .catch(error => {
                console.error('Error creating user:', error);
                showToast('Error', 'Failed to create user', 'error');
            });
        });
    }

    // Edit User Form
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userId = new URLSearchParams(window.location.search).get('id');

            fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Success', 'User updated successfully', 'success');
                } else {
                    showToast('Error', data.message || 'Failed to update user', 'error');
                }
            })
            .catch(error => {
                console.error('Error updating user:', error);
                showToast('Error', 'Failed to update user', 'error');
            });
        });
    }
}

function loadUserDetails() {
    const userId = new URLSearchParams(window.location.search).get('id');
    if (!userId) return;

    fetch(`/api/admin/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateUserDetails(data.user);
            }
        })
        .catch(error => {
            console.error('Error loading user details:', error);
        });
}

function populateUserDetails(user) {
    document.getElementById('userName').textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userId').textContent = `#${user.id}`;
    document.getElementById('userUsername').textContent = user.username;
    document.getElementById('userRole').textContent = user.role;
    document.getElementById('userJoined').textContent = formatDate(user.created_at);
    document.getElementById('userLastLogin').textContent = user.last_login ? formatDate(user.last_login) : 'Never';
    document.getElementById('userIP').textContent = user.last_ip || 'N/A';
    document.getElementById('totalSearches').textContent = user.search_count || 0;
    document.getElementById('pdfsFound').textContent = user.pdf_count || 0;
    document.getElementById('downloads').textContent = user.download_count || 0;
    document.getElementById('favorites').textContent = user.favorite_count || 0;

    const statusEl = document.getElementById('userStatus');
    statusEl.textContent = user.status;
    statusEl.className = `user-status ${user.status}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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