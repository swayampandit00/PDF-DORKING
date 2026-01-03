// Templates.js - Template management functionality for admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplateManagement();
});

function initializeTemplateManagement() {
    // Initialize all template components
    initializeTemplateList();
    initializeTemplateEditor();
    initializeTemplatePreview();
    initializeTemplateCategories();
    initializeTemplateImportExport();

    // Handle template forms
    handleTemplateForms();

    // Initialize template analytics
    initializeTemplateAnalytics();
}

function initializeTemplateList() {
    // Template list with DataTable
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#templateListTable').DataTable({
            ajax: {
                url: '/admin/api/templates',
                type: 'GET'
            },
            columns: [
                { data: 'name' },
                { data: 'category' },
                { data: 'description' },
                { data: 'version' },
                { data: 'status' },
                { data: 'usage_count' },
                { data: 'last_modified' },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <div class="btn-group">
                                <button class="btn btn-sm btn-primary" onclick="editTemplate('${data.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-success" onclick="previewTemplate('${data.id}')" title="Preview">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-info" onclick="duplicateTemplate('${data.id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="btn btn-sm btn-warning" onclick="exportTemplate('${data.id}')" title="Export">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteTemplate('${data.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            order: [[6, 'desc']],
            pageLength: 15
        });
    }

    // Template search and filter
    initializeTemplateFilters();
}

function initializeTemplateEditor() {
    // CodeMirror or similar editor initialization
    initializeCodeEditor();

    // Template variables helper
    initializeTemplateVariables();

    // Auto-save functionality
    initializeAutoSave();

    // Template validation
    initializeTemplateValidation();
}

function initializeTemplatePreview() {
    // Live preview functionality
    const previewBtn = document.getElementById('previewTemplateBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            showTemplatePreview();
        });
    }

    // Preview with sample data
    initializePreviewData();
}

function initializeTemplateCategories() {
    // Category management
    loadTemplateCategories();

    // Category creation/editing
    const categoryForm = document.getElementById('templateCategoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveTemplateCategory();
        });
    }
}

function initializeTemplateImportExport() {
    // Import template functionality
    const importBtn = document.getElementById('importTemplateBtn');
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            importTemplate();
        });
    }

    // Bulk export functionality
    const bulkExportBtn = document.getElementById('bulkExportTemplatesBtn');
    if (bulkExportBtn) {
        bulkExportBtn.addEventListener('click', function() {
            bulkExportTemplates();
        });
    }

    // Template marketplace
    initializeTemplateMarketplace();
}

function handleTemplateForms() {
    const templateForms = document.querySelectorAll('.template-form');

    templateForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formType = this.getAttribute('data-form-type');

            switch(formType) {
                case 'create-template':
                    createTemplate();
                    break;
                case 'update-template':
                    updateTemplate();
                    break;
                case 'import-template':
                    importTemplate();
                    break;
            }
        });
    });
}

function initializeTemplateFilters() {
    // Search functionality
    const searchInput = document.getElementById('templateSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterTemplates();
        }, 300));
    }

    // Category filter
    const categoryFilter = document.getElementById('templateCategoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterTemplates();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('templateStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterTemplates();
        });
    }
}

function initializeCodeEditor() {
    // Initialize CodeMirror if available
    if (typeof CodeMirror !== 'undefined') {
        const editorElement = document.getElementById('templateCodeEditor');
        if (editorElement) {
            window.templateEditor = CodeMirror.fromTextArea(editorElement, {
                lineNumbers: true,
                mode: 'htmlmixed',
                theme: 'default',
                autoCloseTags: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                indentUnit: 2,
                smartIndent: true,
                extraKeys: {
                    'Ctrl-S': function() {
                        saveTemplate();
                    },
                    'Ctrl-/': 'toggleComment'
                }
            });

            // Auto-resize
            window.templateEditor.on('change', function() {
                const wrapper = window.templateEditor.getWrapperElement();
                wrapper.style.height = Math.max(400, window.templateEditor.lineCount() * 20) + 'px';
            });
        }
    }
}

function initializeTemplateVariables() {
    // Load available template variables
    loadTemplateVariables();

    // Variable insertion helper
    const variableButtons = document.querySelectorAll('.insert-variable-btn');
    variableButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            insertVariable(this.getAttribute('data-variable'));
        });
    });

    // Variable search
    const variableSearch = document.getElementById('variableSearch');
    if (variableSearch) {
        variableSearch.addEventListener('input', function() {
            filterVariables(this.value);
        });
    }
}

function initializeAutoSave() {
    let autoSaveTimer;

    if (window.templateEditor) {
        window.templateEditor.on('change', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(function() {
                autoSaveTemplate();
            }, 5000); // Auto-save after 5 seconds of inactivity
        });
    }
}

function initializeTemplateValidation() {
    // Template syntax validation
    const validateBtn = document.getElementById('validateTemplateBtn');
    if (validateBtn) {
        validateBtn.addEventListener('click', function() {
            validateTemplate();
        });
    }

    // Real-time validation
    if (window.templateEditor) {
        window.templateEditor.on('change', debounce(function() {
            if (document.getElementById('realTimeValidation').checked) {
                validateTemplateSyntax();
            }
        }, 1000));
    }
}

function initializePreviewData() {
    // Sample data for preview
    const sampleData = {
        user: {
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin'
        },
        site: {
            name: 'PDF Finder Pro',
            url: 'https://pdffinder.com',
            version: '2.1.0'
        },
        date: new Date().toLocaleDateString(),
        results: [
            { title: 'Sample PDF 1', url: 'https://example.com/pdf1.pdf', size: '2.5 MB' },
            { title: 'Sample PDF 2', url: 'https://example.com/pdf2.pdf', size: '1.8 MB' }
        ]
    };

    window.samplePreviewData = sampleData;

    // Update sample data
    const updateSampleBtn = document.getElementById('updateSampleDataBtn');
    if (updateSampleBtn) {
        updateSampleBtn.addEventListener('click', function() {
            updateSampleData();
        });
    }
}

function createTemplate() {
    const formData = new FormData(document.getElementById('createTemplateForm'));
    const templateData = {
        name: formData.get('templateName'),
        category: formData.get('templateCategory'),
        description: formData.get('templateDescription'),
        content: window.templateEditor ? window.templateEditor.getValue() : formData.get('templateContent'),
        variables: formData.getAll('variables[]'),
        status: formData.get('templateStatus')
    };

    fetch('/admin/api/templates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Template created successfully', 'success');
            refreshTemplateList();
            // Reset form
            document.getElementById('createTemplateForm').reset();
            if (window.templateEditor) {
                window.templateEditor.setValue('');
            }
        } else {
            showNotification('Failed to create template: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error creating template:', error);
        showNotification('Error creating template', 'error');
    });
}

function updateTemplate() {
    const templateId = document.getElementById('editTemplateId').value;
    const formData = new FormData(document.getElementById('editTemplateForm'));
    const templateData = {
        name: formData.get('templateName'),
        category: formData.get('templateCategory'),
        description: formData.get('templateDescription'),
        content: window.templateEditor ? window.templateEditor.getValue() : formData.get('templateContent'),
        variables: formData.getAll('variables[]'),
        status: formData.get('templateStatus')
    };

    fetch(`/admin/api/templates/${templateId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Template updated successfully', 'success');
            refreshTemplateList();
        } else {
            showNotification('Failed to update template: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error updating template:', error);
        showNotification('Error updating template', 'error');
    });
}

function editTemplate(templateId) {
    fetch(`/admin/api/templates/${templateId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Populate edit form
                document.getElementById('editTemplateId').value = data.template.id;
                document.getElementById('editTemplateName').value = data.template.name;
                document.getElementById('editTemplateCategory').value = data.template.category;
                document.getElementById('editTemplateDescription').value = data.template.description;
                document.getElementById('editTemplateStatus').value = data.template.status;

                if (window.templateEditor) {
                    window.templateEditor.setValue(data.template.content);
                } else {
                    document.getElementById('editTemplateContent').value = data.template.content;
                }

                // Show edit modal
                const editModal = new bootstrap.Modal(document.getElementById('editTemplateModal'));
                editModal.show();
            }
        })
        .catch(error => {
            console.error('Error loading template:', error);
            showNotification('Error loading template', 'error');
        });
}

function deleteTemplate(templateId) {
    if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
        fetch(`/admin/api/templates/${templateId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Template deleted successfully', 'success');
                refreshTemplateList();
            } else {
                showNotification('Failed to delete template', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting template:', error);
            showNotification('Error deleting template', 'error');
        });
    }
}

function duplicateTemplate(templateId) {
    fetch(`/admin/api/templates/${templateId}/duplicate`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Template duplicated successfully', 'success');
            refreshTemplateList();
        } else {
            showNotification('Failed to duplicate template', 'error');
        }
    })
    .catch(error => {
        console.error('Error duplicating template:', error);
        showNotification('Error duplicating template', 'error');
    });
}

function previewTemplate(templateId) {
    fetch(`/admin/api/templates/${templateId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showTemplatePreviewModal(data.template);
            }
        })
        .catch(error => {
            console.error('Error loading template for preview:', error);
            showNotification('Error loading template preview', 'error');
        });
}

function showTemplatePreviewModal(template) {
    // Render template with sample data
    const renderedContent = renderTemplate(template.content, window.samplePreviewData);

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Template Preview: ${template.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="template-preview-container border p-3" style="max-height: 600px; overflow-y: auto;">
                        ${renderedContent}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="editTemplate('${template.id}')">Edit Template</button>
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

function showTemplatePreview() {
    const content = window.templateEditor ? window.templateEditor.getValue() : document.getElementById('templateContent').value;
    const renderedContent = renderTemplate(content, window.samplePreviewData);

    const previewContainer = document.getElementById('templatePreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = renderedContent;
    }
}

function renderTemplate(templateContent, data) {
    // Simple template rendering (replace with proper templating engine if needed)
    let rendered = templateContent;

    // Replace variables like {{user.name}}
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
            Object.keys(data[key]).forEach(subKey => {
                const regex = new RegExp(`{{${key}\.${subKey}}}`, 'g');
                rendered = rendered.replace(regex, data[key][subKey]);
            });
        } else {
            const regex = new RegExp(`{{${key}}}`, 'g');
            rendered = rendered.replace(regex, data[key]);
        }
    });

    // Handle loops for arrays (simple implementation)
    const loopRegex = /{% for (\w+) in (\w+) %}(.*?){% endfor %}/gs;
    rendered = rendered.replace(loopRegex, function(match, itemVar, arrayVar, content) {
        if (data[arrayVar] && Array.isArray(data[arrayVar])) {
            return data[arrayVar].map(item => {
                let itemContent = content;
                Object.keys(item).forEach(key => {
                    const regex = new RegExp(`{{${itemVar}\.${key}}}`, 'g');
                    itemContent = itemContent.replace(regex, item[key]);
                });
                return itemContent;
            }).join('');
        }
        return '';
    });

    return rendered;
}

function exportTemplate(templateId) {
    window.open(`/admin/api/templates/${templateId}/export`, '_blank');
}

function importTemplate() {
    const fileInput = document.getElementById('templateImportFile');
    const file = fileInput.files[0];

    if (!file) {
        showNotification('Please select a template file to import', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('templateFile', file);

    fetch('/admin/api/templates/import', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Template imported successfully', 'success');
            refreshTemplateList();
            fileInput.value = '';
        } else {
            showNotification('Failed to import template: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error importing template:', error);
        showNotification('Error importing template', 'error');
    });
}

function bulkExportTemplates() {
    const selectedTemplates = Array.from(document.querySelectorAll('.template-checkbox:checked')).map(cb => cb.value);

    if (selectedTemplates.length === 0) {
        showNotification('Please select templates to export', 'warning');
        return;
    }

    const params = new URLSearchParams();
    selectedTemplates.forEach(id => params.append('ids[]', id));

    window.open(`/admin/api/templates/bulk-export?${params.toString()}`, '_blank');
}

function loadTemplateCategories() {
    fetch('/admin/api/templates/categories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateCategorySelects(data.categories);
            }
        })
        .catch(error => {
            console.error('Error loading categories:', error);
        });
}

function populateCategorySelects(categories) {
    const selects = document.querySelectorAll('.template-category-select');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select Category...</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    });
}

function saveTemplateCategory() {
    const formData = new FormData(document.getElementById('templateCategoryForm'));
    const categoryData = {
        name: formData.get('categoryName'),
        description: formData.get('categoryDescription'),
        parent_id: formData.get('parentCategory')
    };

    fetch('/admin/api/templates/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Category created successfully', 'success');
            loadTemplateCategories();
            document.getElementById('templateCategoryForm').reset();
        } else {
            showNotification('Failed to create category: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error creating category:', error);
        showNotification('Error creating category', 'error');
    });
}

function loadTemplateVariables() {
    fetch('/admin/api/templates/variables')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayTemplateVariables(data.variables);
            }
        })
        .catch(error => {
            console.error('Error loading variables:', error);
        });
}

function displayTemplateVariables(variables) {
    const container = document.getElementById('templateVariablesList');
    if (!container) return;

    let html = '';
    variables.forEach(variable => {
        html += `
            <div class="variable-item mb-2 p-2 border rounded">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <code class="variable-name">{{${variable.name}}}</code>
                        <small class="text-muted ms-2">${variable.description}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary insert-variable-btn" data-variable="${variable.name}">
                        <i class="fas fa-plus"></i> Insert
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function insertVariable(variableName) {
    if (window.templateEditor) {
        const doc = window.templateEditor.getDoc();
        const cursor = doc.getCursor();
        doc.replaceRange(`{{${variableName}}}`, cursor);
    } else {
        const textarea = document.getElementById('templateContent');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            textarea.value = text.substring(0, start) + `{{${variableName}}}` + text.substring(end);
            textarea.focus();
            textarea.setSelectionRange(start + variableName.length + 4, start + variableName.length + 4);
        }
    }
}

function filterVariables(searchTerm) {
    const variables = document.querySelectorAll('.variable-item');
    variables.forEach(variable => {
        const name = variable.querySelector('.variable-name').textContent.toLowerCase();
        const description = variable.querySelector('.text-muted').textContent.toLowerCase();
        const show = name.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
        variable.style.display = show ? 'block' : 'none';
    });
}

function validateTemplate() {
    const content = window.templateEditor ? window.templateEditor.getValue() : document.getElementById('templateContent').value;

    fetch('/admin/api/templates/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(data => {
        const validationResult = document.getElementById('templateValidationResult');
        if (validationResult) {
            if (data.success) {
                validationResult.innerHTML = '<div class="alert alert-success">Template is valid!</div>';
            } else {
                validationResult.innerHTML = `<div class="alert alert-danger">Validation errors: ${data.errors.join(', ')}</div>`;
            }
        }
    })
    .catch(error => {
        console.error('Error validating template:', error);
        showNotification('Error validating template', 'error');
    });
}

function validateTemplateSyntax() {
    // Basic syntax validation (can be enhanced)
    const content = window.templateEditor ? window.templateEditor.getValue() : '';
    const validationIndicator = document.getElementById('syntaxValidationIndicator');

    if (validationIndicator) {
        // Check for unmatched braces
        const openBraces = (content.match(/{{/g) || []).length;
        const closeBraces = (content.match(/}}/g) || []).length;

        if (openBraces === closeBraces) {
            validationIndicator.innerHTML = '<i class="fas fa-check text-success"></i> Syntax OK';
        } else {
            validationIndicator.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i> Unmatched braces';
        }
    }
}

function autoSaveTemplate() {
    const templateId = document.getElementById('editTemplateId').value;
    if (!templateId) return;

    const content = window.templateEditor ? window.templateEditor.getValue() : '';

    fetch(`/admin/api/templates/${templateId}/auto-save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const autoSaveIndicator = document.getElementById('autoSaveIndicator');
            if (autoSaveIndicator) {
                autoSaveIndicator.textContent = 'Auto-saved';
                autoSaveIndicator.className = 'text-success small';
                setTimeout(() => {
                    autoSaveIndicator.textContent = '';
                }, 2000);
            }
        }
    })
    .catch(error => {
        console.error('Error auto-saving template:', error);
    });
}

function updateSampleData() {
    // Update sample data from form inputs
    const sampleDataForm = document.getElementById('sampleDataForm');
    if (sampleDataForm) {
        const formData = new FormData(sampleDataForm);
        window.samplePreviewData = {
            user: {
                name: formData.get('sampleUserName') || 'John Doe',
                email: formData.get('sampleUserEmail') || 'john@example.com',
                role: formData.get('sampleUserRole') || 'Admin'
            },
            site: {
                name: formData.get('sampleSiteName') || 'PDF Finder Pro',
                url: formData.get('sampleSiteUrl') || 'https://pdffinder.com',
                version: formData.get('sampleSiteVersion') || '2.1.0'
            },
            date: new Date().toLocaleDateString(),
            results: [
                { title: formData.get('sampleResult1Title') || 'Sample PDF 1', url: formData.get('sampleResult1Url') || 'https://example.com/pdf1.pdf', size: formData.get('sampleResult1Size') || '2.5 MB' },
                { title: formData.get('sampleResult2Title') || 'Sample PDF 2', url: formData.get('sampleResult2Url') || 'https://example.com/pdf2.pdf', size: formData.get('sampleResult2Size') || '1.8 MB' }
            ]
        };
    }
    showNotification('Sample data updated', 'success');
}

function initializeTemplateAnalytics() {
    // Load template usage analytics
    loadTemplateAnalytics();

    // Initialize analytics charts
    initializeTemplateCharts();
}

function loadTemplateAnalytics() {
    fetch('/admin/api/templates/analytics')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateTemplateStats(data.stats);
            }
        })
        .catch(error => {
            console.error('Error loading template analytics:', error);
        });
}

function updateTemplateStats(stats) {
    // Update template statistics
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(`template-stat-${key}`);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

function initializeTemplateCharts() {
    // Template usage chart
    const usageChartCanvas = document.getElementById('templateUsageChart');
    if (usageChartCanvas && typeof Chart !== 'undefined') {
        fetch('/admin/api/templates/analytics/usage')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    new Chart(usageChartCanvas, {
                        type: 'bar',
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'Template Usage',
                                data: data.values,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Template Usage Statistics'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading template usage data:', error);
            });
    }
}

function initializeTemplateMarketplace() {
    // Load available templates from marketplace
    loadMarketplaceTemplates();

    // Install template from marketplace
    const installButtons = document.querySelectorAll('.install-marketplace-template');
    installButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            installMarketplaceTemplate(this.getAttribute('data-template-id'));
        });
    });
}

function loadMarketplaceTemplates() {
    fetch('/admin/api/templates/marketplace')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMarketplaceTemplates(data.templates);
            }
        })
        .catch(error => {
            console.error('Error loading marketplace templates:', error);
        });
}

function displayMarketplaceTemplates(templates) {
    const container = document.getElementById('marketplaceTemplates');
    if (!container) return;

    let html = '';
    templates.forEach(template => {
        html += `
            <div class="marketplace-template-card card mb-3">
                <div class="card-body">
                    <h6 class="card-title">${template.name}</h6>
                    <p class="card-text small">${template.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="badge bg-secondary">${template.category}</span>
                            <small class="text-muted ms-2">v${template.version}</small>
                        </div>
                        <button class="btn btn-sm btn-primary install-marketplace-template" data-template-id="${template.id}">
                            <i class="fas fa-download"></i> Install
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function installMarketplaceTemplate(templateId) {
    fetch(`/admin/api/templates/marketplace/${templateId}/install`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Template installed successfully', 'success');
            refreshTemplateList();
        } else {
            showNotification('Failed to install template: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error installing template:', error);
        showNotification('Error installing template', 'error');
    });
}

function filterTemplates() {
    const searchTerm = document.getElementById('templateSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('templateCategoryFilter').value;
    const statusFilter = document.getElementById('templateStatusFilter').value;

    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        const table = $('#templateListTable').DataTable();
        table.search(searchTerm).draw();

        // Additional filtering can be implemented here
        // For now, basic search is handled by DataTables
    }
}

function refreshTemplateList() {
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#templateListTable').DataTable().ajax.reload();
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
window.TemplateUtils = {
    createTemplate,
    updateTemplate,
    editTemplate,
    deleteTemplate,
    duplicateTemplate,
    previewTemplate,
    exportTemplate,
    importTemplate,
    bulkExportTemplates,
    insertVariable,
    validateTemplate,
    showTemplatePreview,
    refreshTemplateList,
    showNotification
};