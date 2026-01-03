// Dashboard Analytics JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();

    // Load dashboard data
    loadDashboardData();

    // Auto refresh every 5 minutes
    setInterval(loadDashboardData, 300000);
});

function initializeCharts() {
    const ctx = document.getElementById('searchChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Searches',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Daily Search Activity'
                    }
                }
            }
        });
    }
}

function loadDashboardData() {
    // Fetch dashboard statistics
    fetch('/api/admin/stats')
        .then(response => response.json())
        .then(data => {
            updateStatsCards(data);
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
        });
}

function updateStatsCards(data) {
    if (data.totalUsers) {
        document.getElementById('totalUsers').textContent = data.totalUsers.toLocaleString();
    }
    if (data.totalSearches) {
        document.getElementById('totalSearches').textContent = data.totalSearches.toLocaleString();
    }
    if (data.pdfsFound) {
        document.getElementById('pdfsFound').textContent = data.pdfsFound.toLocaleString();
    }
    if (data.downloads) {
        document.getElementById('downloads').textContent = data.downloads.toLocaleString();
    }
}

// Toast notification function
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