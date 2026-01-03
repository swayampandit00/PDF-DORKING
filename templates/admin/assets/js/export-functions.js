// Export Functions.js - Export functionality for admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeExportFunctions();
});

function initializeExportFunctions() {
    // Initialize all export components
    initializeDataExport();
    initializeReportExport();
    initializeUserExport();
    initializeLogExport();
    initializeBulkExport();

    // Handle export forms
    handleExportForms();

    // Initialize export history
    initializeExportHistory();
}

function initializeDataExport() {
    const exportForm = document.getElementById('dataExportForm');
    const exportBtn = document.getElementById('exportDataBtn');

    if (exportForm && exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }

    // Data type selector
    const dataType = document.getElementById('exportDataType');
    const tableSelector = document.getElementById('tableSelector');
    const customQuery = document.getElementById('customQuery');

    if (dataType) {
        dataType.addEventListener('change', function() {
            const selectedType = this.value;

            // Show/hide relevant fields
            if (tableSelector) {
                tableSelector.style.display = selectedType === 'table' ? 'block' : 'none';
            }
            if (customQuery) {
                customQuery.style.display = selectedType === 'query' ? 'block' : 'none';
            }

            // Update available tables
            if (selectedType === 'table') {
                loadAvailableTables();
            }
        });
    }

    // Table selector
    const tableSelect = document.getElementById('exportTable');
    if (tableSelect) {
        tableSelect.addEventListener('change', function() {
            loadTableColumns(this.value);
        });
    }
}

function initializeReportExport() {
    const reportForm = document.getElementById('reportExportForm');
    const exportReportBtn = document.getElementById('exportReportBtn');

    if (reportForm && exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            exportReport();
        });
    }

    // Report type selector
    const reportType = document.getElementById('reportType');
    const dateRange = document.getElementById('reportDateRange');
    const customFilters = document.getElementById('customReportFilters');

    if (reportType) {
        reportType.addEventListener('change', function() {
            const selectedType = this.value;

            if (dateRange) {
                dateRange.style.display = ['usage', 'activity', 'performance'].includes(selectedType) ? 'block' : 'none';
            }
            if (customFilters) {
                customFilters.style.display = selectedType === 'custom' ? 'block' : 'none';
            }
        });
    }
}

function initializeUserExport() {
    const userForm = document.getElementById('userExportForm');
    const exportUsersBtn = document.getElementById('exportUsersBtn');

    if (userForm && exportUsersBtn) {
        exportUsersBtn.addEventListener('click', function() {
            exportUsers();
        });
    }

    // User filter options
    const userFilters = document.querySelectorAll('.user-filter');
    userFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updateUserExportPreview();
        });
    });
}

function initializeLogExport() {
    const logForm = document.getElementById('logExportForm');
    const exportLogsBtn = document.getElementById('exportLogsBtn');

    if (logForm && exportLogsBtn) {
        exportLogsBtn.addEventListener('click', function() {
            exportLogs();
        });
    }

    // Log type selector
    const logType = document.getElementById('logType');
    const logFilters = document.getElementById('logFilters');

    if (logType && logFilters) {
        logType.addEventListener('change', function() {
            logFilters.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }

    // Date range picker for logs
    initializeLogDateRange();
}

function initializeBulkExport() {
    const bulkForm = document.getElementById('bulkExportForm');
    const startBulkExportBtn = document.getElementById('startBulkExportBtn');

    if (bulkForm && startBulkExportBtn) {
        startBulkExportBtn.addEventListener('click', function() {
            startBulkExport();
        });
    }

    // Bulk export type selector
    const bulkType = document.getElementById('bulkExportType');
    const bulkOptions = document.getElementById('bulkExportOptions');

    if (bulkType && bulkOptions) {
        bulkType.addEventListener('change', function() {
            const selectedType = this.value;
            const options = bulkOptions.querySelectorAll('.bulk-option');

            options.forEach(option => {
                option.style.display = option.getAttribute('data-type') === selectedType ? 'block' : 'none';
            });
        });
    }

    // Progress tracking for bulk exports
    initializeBulkExportProgress();
}

function handleExportForms() {
    const exportForms = document.querySelectorAll('.export-form');

    exportForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const exportType = this.getAttribute('data-export-type');

            switch(exportType) {
                case 'data':
                    exportData();
                    break;
                case 'report':
                    exportReport();
                    break;
                case 'users':
                    exportUsers();
                    break;
                case 'logs':
                    exportLogs();
                    break;
                case 'bulk':
                    startBulkExport();
                    break;
            }
        });
    });
}

function initializeExportHistory() {
    // Initialize DataTable for export history
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#exportHistoryTable').DataTable({
            ajax: {
                url: '/admin/api/exports/history',
                type: 'GET'
            },
            columns: [
                { data: 'filename' },
                { data: 'type' },
                { data: 'format' },
                { data: 'size' },
                { data: 'created_at' },
                { data: 'status' },
                {
                    data: null,
                    render: function(data) {
                        let actions = `
                            <button class="btn btn-sm btn-primary" onclick="downloadExport('${data.id}')" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                        `;

                        if (data.status === 'completed') {
                            actions += `
                                <button class="btn btn-sm btn-info" onclick="viewExportDetails('${data.id}')" title="Details">
                                    <i class="fas fa-eye"></i>
                                </button>
                            `;
                        }

                        if (data.status === 'failed') {
                            actions += `
                                <button class="btn btn-sm btn-warning" onclick="retryExport('${data.id}')" title="Retry">
                                    <i class="fas fa-redo"></i>
                                </button>
                            `;
                        }

                        actions += `
                            <button class="btn btn-sm btn-danger" onclick="deleteExport('${data.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        `;

                        return actions;
                    }
                }
            ],
            order: [[4, 'desc']],
            pageLength: 10
        });
    }
}

function exportData() {
    const formData = new FormData(document.getElementById('dataExportForm'));
    const exportBtn = document.getElementById('exportDataBtn');

    // Show loading state
    exportBtn.disabled = true;
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';

    const params = {
        dataType: formData.get('dataType'),
        table: formData.get('table'),
        columns: formData.getAll('columns[]'),
        query: formData.get('query'),
        format: formData.get('format'),
        filters: {
            dateRange: formData.get('dateRange'),
            conditions: formData.get('conditions')
        }
    };

    fetch('/admin/api/export/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.downloadUrl) {
                window.open(data.downloadUrl, '_blank');
            }
            showNotification('Data export completed successfully', 'success');
            refreshExportHistory();
        } else {
            showNotification('Export failed: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data', 'error');
    })
    .finally(() => {
        exportBtn.disabled = false;
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Data';
    });
}

function exportReport() {
    const formData = new FormData(document.getElementById('reportExportForm'));
    const exportReportBtn = document.getElementById('exportReportBtn');

    // Show loading state
    exportReportBtn.disabled = true;
    exportReportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Report...';

    const params = {
        reportType: formData.get('reportType'),
        dateRange: {
            start: formData.get('startDate'),
            end: formData.get('endDate')
        },
        format: formData.get('format'),
        includeCharts: formData.get('includeCharts') === 'on',
        filters: formData.getAll('filters[]')
    };

    fetch('/admin/api/export/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.downloadUrl) {
                window.open(data.downloadUrl, '_blank');
            }
            showNotification('Report export completed successfully', 'success');
            refreshExportHistory();
        } else {
            showNotification('Report export failed: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error exporting report:', error);
        showNotification('Error exporting report', 'error');
    })
    .finally(() => {
        exportReportBtn.disabled = false;
        exportReportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Export Report';
    });
}

function exportUsers() {
    const formData = new FormData(document.getElementById('userExportForm'));
    const exportUsersBtn = document.getElementById('exportUsersBtn');

    // Show loading state
    exportUsersBtn.disabled = true;
    exportUsersBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting Users...';

    const params = {
        userType: formData.get('userType'),
        status: formData.get('status'),
        dateRange: {
            start: formData.get('startDate'),
            end: formData.get('endDate')
        },
        fields: formData.getAll('fields[]'),
        format: formData.get('format'),
        includeProfileData: formData.get('includeProfileData') === 'on'
    };

    fetch('/admin/api/export/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.downloadUrl) {
                window.open(data.downloadUrl, '_blank');
            }
            showNotification('User export completed successfully', 'success');
            refreshExportHistory();
        } else {
            showNotification('User export failed: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error exporting users:', error);
        showNotification('Error exporting users', 'error');
    })
    .finally(() => {
        exportUsersBtn.disabled = false;
        exportUsersBtn.innerHTML = '<i class="fas fa-users"></i> Export Users';
    });
}

function exportLogs() {
    const formData = new FormData(document.getElementById('logExportForm'));
    const exportLogsBtn = document.getElementById('exportLogsBtn');

    // Show loading state
    exportLogsBtn.disabled = true;
    exportLogsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting Logs...';

    const params = {
        logType: formData.get('logType'),
        dateRange: {
            start: formData.get('startDate'),
            end: formData.get('endDate')
        },
        level: formData.get('level'),
        source: formData.get('source'),
        format: formData.get('format'),
        filters: formData.get('filters')
    };

    fetch('/admin/api/export/logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.downloadUrl) {
                window.open(data.downloadUrl, '_blank');
            }
            showNotification('Log export completed successfully', 'success');
            refreshExportHistory();
        } else {
            showNotification('Log export failed: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error exporting logs:', error);
        showNotification('Error exporting logs', 'error');
    })
    .finally(() => {
        exportLogsBtn.disabled = false;
        exportLogsBtn.innerHTML = '<i class="fas fa-file-alt"></i> Export Logs';
    });
}

function startBulkExport() {
    const formData = new FormData(document.getElementById('bulkExportForm'));
    const startBulkExportBtn = document.getElementById('startBulkExportBtn');

    // Show loading state
    startBulkExportBtn.disabled = true;
    startBulkExportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Bulk Export...';

    const params = {
        exportType: formData.get('exportType'),
        items: formData.getAll('items[]'),
        format: formData.get('format'),
        options: {
            includeMetadata: formData.get('includeMetadata') === 'on',
            compress: formData.get('compress') === 'on',
            splitFiles: formData.get('splitFiles') === 'on'
        }
    };

    fetch('/admin/api/export/bulk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Bulk export started successfully', 'success');
            // Start tracking progress
            trackBulkExportProgress(data.exportId);
            refreshExportHistory();
        } else {
            showNotification('Bulk export failed: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error starting bulk export:', error);
        showNotification('Error starting bulk export', 'error');
    })
    .finally(() => {
        startBulkExportBtn.disabled = false;
        startBulkExportBtn.innerHTML = '<i class="fas fa-play"></i> Start Bulk Export';
    });
}

function trackBulkExportProgress(exportId) {
    const progressContainer = document.getElementById('bulkExportProgress');
    if (!progressContainer) return;

    progressContainer.style.display = 'block';

    const progressBar = progressContainer.querySelector('.progress-bar');
    const progressText = progressContainer.querySelector('.progress-text');

    const updateProgress = () => {
        fetch(`/admin/api/export/progress/${exportId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const progress = data.progress;
                    progressBar.style.width = progress + '%';
                    progressText.textContent = progress + '% complete';

                    if (progress < 100) {
                        setTimeout(updateProgress, 2000); // Update every 2 seconds
                    } else {
                        progressContainer.style.display = 'none';
                        showNotification('Bulk export completed successfully', 'success');
                        refreshExportHistory();
                    }
                }
            })
            .catch(error => {
                console.error('Error tracking progress:', error);
            });
    };

    updateProgress();
}

function initializeBulkExportProgress() {
    // Hide progress container initially
    const progressContainer = document.getElementById('bulkExportProgress');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
}

function loadAvailableTables() {
    fetch('/admin/api/export/tables')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tableSelect = document.getElementById('exportTable');
                if (tableSelect) {
                    tableSelect.innerHTML = '<option value="">Select a table...</option>';
                    data.tables.forEach(table => {
                        const option = document.createElement('option');
                        option.value = table.name;
                        option.textContent = `${table.name} (${table.rows} rows)`;
                        tableSelect.appendChild(option);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error loading tables:', error);
        });
}

function loadTableColumns(tableName) {
    if (!tableName) return;

    fetch(`/admin/api/export/tables/${tableName}/columns`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const columnsContainer = document.getElementById('tableColumns');
                if (columnsContainer) {
                    columnsContainer.innerHTML = '';

                    data.columns.forEach(column => {
                        const checkboxDiv = document.createElement('div');
                        checkboxDiv.className = 'form-check';

                        checkboxDiv.innerHTML = `
                            <input class="form-check-input" type="checkbox" value="${column.name}" id="col_${column.name}" name="columns[]" checked>
                            <label class="form-check-label" for="col_${column.name}">
                                ${column.name} <small class="text-muted">(${column.type})</small>
                            </label>
                        `;

                        columnsContainer.appendChild(checkboxDiv);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error loading columns:', error);
        });
}

function updateUserExportPreview() {
    const formData = new FormData(document.getElementById('userExportForm'));
    const previewContainer = document.getElementById('userExportPreview');

    if (!previewContainer) return;

    const params = {
        userType: formData.get('userType'),
        status: formData.get('status'),
        dateRange: {
            start: formData.get('startDate'),
            end: formData.get('endDate')
        }
    };

    fetch('/admin/api/export/users/preview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            previewContainer.innerHTML = `
                <div class="alert alert-info">
                    <strong>Preview:</strong> ${data.count} users will be exported
                    ${data.filters ? `<br><small>Filters: ${data.filters}</small>` : ''}
                </div>
            `;
        }
    })
    .catch(error => {
        console.error('Error getting preview:', error);
    });
}

function initializeLogDateRange() {
    // Initialize date range picker for logs
    const startDate = document.getElementById('logStartDate');
    const endDate = document.getElementById('logEndDate');

    if (startDate && endDate) {
        // Set default date range (last 7 days)
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

        startDate.value = sevenDaysAgo.toISOString().split('T')[0];
        endDate.value = today.toISOString().split('T')[0];
    }
}

function downloadExport(exportId) {
    window.open(`/admin/api/export/download/${exportId}`, '_blank');
}

function viewExportDetails(exportId) {
    fetch(`/admin/api/export/details/${exportId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show modal with export details
                showExportDetailsModal(data.details);
            }
        })
        .catch(error => {
            console.error('Error getting export details:', error);
        });
}

function retryExport(exportId) {
    if (confirm('Are you sure you want to retry this export?')) {
        fetch(`/admin/api/export/retry/${exportId}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Export retry initiated', 'success');
                refreshExportHistory();
            } else {
                showNotification('Failed to retry export', 'error');
            }
        })
        .catch(error => {
            console.error('Error retrying export:', error);
            showNotification('Error retrying export', 'error');
        });
    }
}

function deleteExport(exportId) {
    if (confirm('Are you sure you want to delete this export?')) {
        fetch(`/admin/api/export/delete/${exportId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Export deleted successfully', 'success');
                refreshExportHistory();
            } else {
                showNotification('Failed to delete export', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting export:', error);
            showNotification('Error deleting export', 'error');
        });
    }
}

function refreshExportHistory() {
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#exportHistoryTable').DataTable().ajax.reload();
    }
}

function showExportDetailsModal(details) {
    // Create and show modal with export details
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Export Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <dl class="row">
                        <dt class="col-sm-3">Filename:</dt>
                        <dd class="col-sm-9">${details.filename}</dd>
                        <dt class="col-sm-3">Type:</dt>
                        <dd class="col-sm-9">${details.type}</dd>
                        <dt class="col-sm-3">Format:</dt>
                        <dd class="col-sm-9">${details.format}</dd>
                        <dt class="col-sm-3">Size:</dt>
                        <dd class="col-sm-9">${details.size}</dd>
                        <dt class="col-sm-3">Created:</dt>
                        <dd class="col-sm-9">${details.created_at}</dd>
                        <dt class="col-sm-3">Status:</dt>
                        <dd class="col-sm-9"><span class="badge bg-${getStatusColor(details.status)}">${details.status}</span></dd>
                        ${details.error ? `<dt class="col-sm-3">Error:</dt><dd class="col-sm-9 text-danger">${details.error}</dd>` : ''}
                    </dl>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    ${details.status === 'completed' ? `<button type="button" class="btn btn-primary" onclick="downloadExport('${details.id}')">Download</button>` : ''}
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

function getStatusColor(status) {
    switch(status) {
        case 'completed': return 'success';
        case 'processing': return 'warning';
        case 'failed': return 'danger';
        default: return 'secondary';
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
window.ExportUtils = {
    exportData,
    exportReport,
    exportUsers,
    exportLogs,
    startBulkExport,
    downloadExport,
    viewExportDetails,
    retryExport,
    deleteExport,
    refreshExportHistory,
    showNotification
};