// DataTables.js - Enhanced table functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDataTables();
});

// Initialize DataTables for all tables with data-table class
function initializeDataTables() {
    const tables = document.querySelectorAll('.table[data-table]');
    tables.forEach(table => {
        initializeDataTable(table);
    });
}

// Initialize a single data table
function initializeDataTable(tableElement) {
    const tableId = tableElement.id;
    if (!tableId) return;

    // Add loading state
    tableElement.classList.add('table-loading');

    // Get table configuration from data attributes
    const config = {
        pageLength: parseInt(tableElement.dataset.pageLength) || 10,
        ordering: tableElement.dataset.ordering !== 'false',
        searching: tableElement.dataset.searching !== 'false',
        paging: tableElement.dataset.paging !== 'false',
        info: tableElement.dataset.info !== 'false',
        responsive: tableElement.dataset.responsive !== 'false',
        serverSide: tableElement.dataset.serverSide === 'true',
        ajax: tableElement.dataset.ajax,
        columns: JSON.parse(tableElement.dataset.columns || '[]')
    };

    // Initialize DataTable
    const dataTable = $(tableElement).DataTable({
        pageLength: config.pageLength,
        ordering: config.ordering,
        searching: config.searching,
        paging: config.paging,
        info: config.info,
        responsive: config.responsive,
        serverSide: config.serverSide,
        ajax: config.ajax ? {
            url: config.ajax,
            type: 'GET'
        } : null,
        columns: config.columns.length > 0 ? config.columns : null,
        language: {
            search: '',
            searchPlaceholder: 'Search...',
            lengthMenu: 'Show _MENU_ entries',
            info: 'Showing _START_ to _END_ of _TOTAL_ entries',
            infoEmpty: 'No entries found',
            infoFiltered: '(filtered from _MAX_ total entries)',
            emptyTable: 'No data available in table',
            zeroRecords: 'No matching records found',
            paginate: {
                first: 'First',
                last: 'Last',
                next: 'Next',
                previous: 'Previous'
            }
        },
        initComplete: function() {
            // Remove loading state
            tableElement.classList.remove('table-loading');

            // Add custom search styling
            const searchInput = $(this).closest('.dataTables_wrapper').find('.dataTables_filter input');
            searchInput.addClass('form-control').wrap('<div class="search-box"></div>');

            // Add custom length select styling
            const lengthSelect = $(this).closest('.dataTables_wrapper').find('.dataTables_length select');
            lengthSelect.addClass('form-select');

            // Add export buttons if enabled
            if (tableElement.dataset.export === 'true') {
                addExportButtons(this, tableId);
            }
        }
    });

    // Store DataTable instance
    tableElement.dataTableInstance = dataTable;

    return dataTable;
}

// Add export buttons to table
function addExportButtons(dataTable, tableId) {
    const wrapper = $(dataTable.table().container()).closest('.dataTables_wrapper');
    const exportButtons = `
        <div class="dt-buttons btn-group" style="margin-bottom: 10px;">
            <button class="btn btn-outline-primary btn-sm" onclick="exportTable('${tableId}', 'csv')">
                <i class="fas fa-file-csv"></i> CSV
            </button>
            <button class="btn btn-outline-primary btn-sm" onclick="exportTable('${tableId}', 'excel')">
                <i class="fas fa-file-excel"></i> Excel
            </button>
            <button class="btn btn-outline-primary btn-sm" onclick="exportTable('${tableId}', 'pdf')">
                <i class="fas fa-file-pdf"></i> PDF
            </button>
            <button class="btn btn-outline-primary btn-sm" onclick="exportTable('${tableId}', 'print')">
                <i class="fas fa-print"></i> Print
            </button>
        </div>
    `;

    wrapper.find('.dataTables_filter').before(exportButtons);
}

// Export table data
function exportTable(tableId, format) {
    const table = document.getElementById(tableId);
    if (!table || !table.dataTableInstance) return;

    const dataTable = table.dataTableInstance;
    const data = dataTable.rows().data().toArray();
    const headers = [];

    // Get headers
    dataTable.columns().every(function() {
        const header = this.header();
        headers.push($(header).text().trim());
    });

    switch (format) {
        case 'csv':
            exportToCSV(data, headers, tableId);
            break;
        case 'excel':
            exportToExcel(data, headers, tableId);
            break;
        case 'pdf':
            exportToPDF(data, headers, tableId);
            break;
        case 'print':
            dataTable.button('0').trigger();
            break;
    }
}

// Export to CSV
function exportToCSV(data, headers, tableId) {
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const csvRow = row.map(cell => {
            // Escape commas and quotes
            if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
                return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
        });
        csv += csvRow.join(',') + '\n';
    });

    downloadFile(csv, `${tableId}.csv`, 'text/csv');
}

// Export to Excel (simplified - creates CSV that Excel can open)
function exportToExcel(data, headers, tableId) {
    exportToCSV(data, headers, tableId);
}

// Export to PDF
function exportToPDF(data, headers, tableId) {
    // This would require a PDF library like jsPDF
    // For now, show a message
    showToast('Info', 'PDF export feature coming soon', 'info');
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Refresh table data
function refreshTable(tableId) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.ajax.reload();
    }
}

// Add row to table
function addTableRow(tableId, data) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.row.add(data).draw();
    }
}

// Update table row
function updateTableRow(tableId, rowIndex, data) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.row(rowIndex).data(data).draw();
    }
}

// Remove table row
function removeTableRow(tableId, rowIndex) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.row(rowIndex).remove().draw();
    }
}

// Get selected rows
function getSelectedRows(tableId) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        return table.dataTableInstance.rows('.selected').data().toArray();
    }
    return [];
}

// Select all rows
function selectAllRows(tableId, select = true) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        if (select) {
            table.dataTableInstance.rows().select();
        } else {
            table.dataTableInstance.rows().deselect();
        }
    }
}

// Search table
function searchTable(tableId, query) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.search(query).draw();
    }
}

// Filter table by column
function filterTableByColumn(tableId, columnIndex, value) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.column(columnIndex).search(value).draw();
    }
}

// Sort table by column
function sortTableByColumn(tableId, columnIndex, direction = 'asc') {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.order([columnIndex, direction]).draw();
    }
}

// Get table data
function getTableData(tableId) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        return table.dataTableInstance.rows().data().toArray();
    }
    return [];
}

// Set table page
function setTablePage(tableId, page) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        table.dataTableInstance.page(page).draw(false);
    }
}

// Get current page info
function getTablePageInfo(tableId) {
    const table = document.getElementById(tableId);
    if (table && table.dataTableInstance) {
        const info = table.dataTableInstance.page.info();
        return {
            page: info.page,
            pages: info.pages,
            start: info.start,
            end: info.end,
            total: info.recordsTotal,
            filtered: info.recordsDisplay
        };
    }
    return null;
}

// Custom DataTable plugins
$.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {
        // Custom search functions can be added here
        return true;
    }
);

// DataTable defaults
$.extend($.fn.dataTable.defaults, {
    responsive: true,
    pageLength: 25,
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
    dom: '<"top"lf>rt<"bottom"ip><"clear">',
    language: {
        search: '',
        searchPlaceholder: 'Search...',
        lengthMenu: 'Show _MENU_ entries per page',
        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
        infoEmpty: 'No entries to show',
        infoFiltered: '(filtered from _MAX_ total entries)',
        emptyTable: 'No data available',
        zeroRecords: 'No matching records found'
    }
});

// Export functions globally
window.DataTableUtils = {
    initializeDataTable,
    refreshTable,
    addTableRow,
    updateTableRow,
    removeTableRow,
    getSelectedRows,
    selectAllRows,
    searchTable,
    filterTableByColumn,
    sortTableByColumn,
    getTableData,
    setTablePage,
    getTablePageInfo,
    exportTable
};