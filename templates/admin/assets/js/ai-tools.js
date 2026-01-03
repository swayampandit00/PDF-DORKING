// AI Tools.js - AI tools functionality for admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAITools();
});

function initializeAITools() {
    // Initialize all AI tools components
    initializeDorkGenerator();
    initializeContentAnalyzer();
    initializeSearchOptimizer();
    initializeReportGenerator();
    initializeAIAnalytics();

    // Handle AI tool forms
    handleAIToolForms();

    // Initialize AI settings
    initializeAISettings();
}

function initializeDorkGenerator() {
    const dorkForm = document.getElementById('dorkGeneratorForm');
    const generateBtn = document.getElementById('generateDorkBtn');
    const resultsContainer = document.getElementById('dorkResults');

    if (dorkForm && generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateDorks();
        });

        // Auto-generate on form changes
        const inputs = dorkForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(function() {
                if (document.getElementById('autoGenerate').checked) {
                    generateDorks();
                }
            }, 500));
        });
    }

    // Copy to clipboard functionality
    if (resultsContainer) {
        resultsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('copy-dork')) {
                const dorkText = e.target.previousElementSibling.textContent;
                copyToClipboard(dorkText);
                showNotification('Dork copied to clipboard', 'success');
            }
        });
    }
}

function initializeContentAnalyzer() {
    const analyzerForm = document.getElementById('contentAnalyzerForm');
    const analyzeBtn = document.getElementById('analyzeContentBtn');
    const resultsContainer = document.getElementById('analysisResults');

    if (analyzerForm && analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            analyzeContent();
        });
    }

    // File upload handling
    const fileInput = document.getElementById('contentFile');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            handleFileUpload(e.target.files[0]);
        });
    }

    // URL analysis
    const urlInput = document.getElementById('contentUrl');
    if (urlInput) {
        urlInput.addEventListener('input', debounce(function() {
            if (this.value && document.getElementById('autoAnalyze').checked) {
                analyzeContent();
            }
        }, 1000));
    }
}

function initializeSearchOptimizer() {
    const optimizerForm = document.getElementById('searchOptimizerForm');
    const optimizeBtn = document.getElementById('optimizeSearchBtn');
    const suggestionsContainer = document.getElementById('optimizationSuggestions');

    if (optimizerForm && optimizeBtn) {
        optimizeBtn.addEventListener('click', function() {
            optimizeSearch();
        });
    }

    // Real-time optimization suggestions
    const searchInput = document.getElementById('searchQuery');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            if (this.value.length > 3) {
                getOptimizationSuggestions(this.value);
            }
        }, 300));
    }
}

function initializeReportGenerator() {
    const reportForm = document.getElementById('reportGeneratorForm');
    const generateReportBtn = document.getElementById('generateReportBtn');

    if (reportForm && generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            generateAIReport();
        });
    }

    // Report type selector
    const reportType = document.getElementById('reportType');
    const customOptions = document.getElementById('customReportOptions');

    if (reportType && customOptions) {
        reportType.addEventListener('change', function() {
            customOptions.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }

    // Date range picker
    initializeDateRangePicker();
}

function initializeAIAnalytics() {
    // Load AI usage analytics
    loadAIUsageStats();

    // Initialize analytics charts
    initializeAICharts();

    // Refresh analytics button
    const refreshBtn = document.getElementById('refreshAIAnalytics');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadAIUsageStats();
            initializeAICharts();
        });
    }
}

function initializeAISettings() {
    // AI provider selector
    const aiProvider = document.getElementById('aiProvider');
    const openaiSettings = document.getElementById('openaiSettings');
    const claudeSettings = document.getElementById('claudeSettings');
    const geminiSettings = document.getElementById('geminiSettings');

    if (aiProvider) {
        aiProvider.addEventListener('change', function() {
            // Hide all provider settings
            [openaiSettings, claudeSettings, geminiSettings].forEach(setting => {
                if (setting) setting.style.display = 'none';
            });

            // Show selected provider settings
            const selectedProvider = this.value;
            switch(selectedProvider) {
                case 'openai':
                    if (openaiSettings) openaiSettings.style.display = 'block';
                    break;
                case 'claude':
                    if (claudeSettings) claudeSettings.style.display = 'block';
                    break;
                case 'gemini':
                    if (geminiSettings) geminiSettings.style.display = 'block';
                    break;
            }
        });
    }

    // Test AI connection
    const testAIBtn = document.getElementById('testAIConnection');
    if (testAIBtn) {
        testAIBtn.addEventListener('click', function() {
            testAIConnection();
        });
    }
}

function handleAIToolForms() {
    const aiForms = document.querySelectorAll('.ai-tool-form');

    aiForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const toolType = this.getAttribute('data-tool');

            switch(toolType) {
                case 'dork-generator':
                    generateDorks();
                    break;
                case 'content-analyzer':
                    analyzeContent();
                    break;
                case 'search-optimizer':
                    optimizeSearch();
                    break;
                case 'report-generator':
                    generateAIReport();
                    break;
            }
        });
    });
}

function generateDorks() {
    const formData = new FormData(document.getElementById('dorkGeneratorForm'));
    const resultsContainer = document.getElementById('dorkResults');
    const generateBtn = document.getElementById('generateDorkBtn');

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    const params = {
        target: formData.get('target'),
        filetypes: formData.getAll('filetypes[]'),
        keywords: formData.get('keywords'),
        operators: formData.getAll('operators[]'),
        dateRange: formData.get('dateRange'),
        complexity: formData.get('complexity')
    };

    fetch('/admin/api/ai/generate-dorks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayDorkResults(data.dorks);
        } else {
            showNotification('Error generating dorks: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error generating dorks:', error);
        showNotification('Error generating dorks', 'error');
    })
    .finally(() => {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Dorks';
    });
}

function displayDorkResults(dorks) {
    const resultsContainer = document.getElementById('dorkResults');

    if (!resultsContainer) return;

    let html = '<div class="dork-results-list">';

    dorks.forEach((dork, index) => {
        html += `
            <div class="dork-result-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <code class="dork-text flex-grow-1 me-2">${dork.query}</code>
                    <button class="btn btn-sm btn-outline-primary copy-dork" title="Copy to clipboard">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="dork-meta mt-2 small text-muted">
                    <span class="badge bg-info me-2">${dork.category}</span>
                    <span>Expected results: ${dork.expectedResults}</span>
                    ${dork.risk ? `<span class="badge bg-warning ms-2">${dork.risk}</span>` : ''}
                </div>
                ${dork.description ? `<div class="dork-description mt-1">${dork.description}</div>` : ''}
            </div>
        `;
    });

    html += '</div>';
    resultsContainer.innerHTML = html;
}

function analyzeContent() {
    const formData = new FormData(document.getElementById('contentAnalyzerForm'));
    const resultsContainer = document.getElementById('analysisResults');
    const analyzeBtn = document.getElementById('analyzeContentBtn');

    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

    const params = {
        content: formData.get('content'),
        url: formData.get('url'),
        file: formData.get('file'),
        analysisType: formData.getAll('analysisType[]')
    };

    fetch('/admin/api/ai/analyze-content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayAnalysisResults(data.analysis);
        } else {
            showNotification('Error analyzing content: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error analyzing content:', error);
        showNotification('Error analyzing content', 'error');
    })
    .finally(() => {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Content';
    });
}

function displayAnalysisResults(analysis) {
    const resultsContainer = document.getElementById('analysisResults');

    if (!resultsContainer) return;

    let html = '<div class="analysis-results">';

    // Summary
    if (analysis.summary) {
        html += `
            <div class="analysis-section mb-4">
                <h5><i class="fas fa-file-alt"></i> Summary</h5>
                <p>${analysis.summary}</p>
            </div>
        `;
    }

    // Keywords
    if (analysis.keywords && analysis.keywords.length > 0) {
        html += `
            <div class="analysis-section mb-4">
                <h5><i class="fas fa-tags"></i> Keywords</h5>
                <div class="keyword-tags">
                    ${analysis.keywords.map(keyword =>
                        `<span class="badge bg-primary me-1 mb-1">${keyword}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    // Sentiment
    if (analysis.sentiment) {
        html += `
            <div class="analysis-section mb-4">
                <h5><i class="fas fa-smile"></i> Sentiment Analysis</h5>
                <div class="sentiment-score">
                    <div class="progress">
                        <div class="progress-bar bg-${getSentimentColor(analysis.sentiment.score)}"
                             style="width: ${analysis.sentiment.score * 100}%">
                            ${Math.round(analysis.sentiment.score * 100)}%
                        </div>
                    </div>
                    <small class="text-muted">${analysis.sentiment.label}</small>
                </div>
            </div>
        `;
    }

    // Topics
    if (analysis.topics && analysis.topics.length > 0) {
        html += `
            <div class="analysis-section mb-4">
                <h5><i class="fas fa-topic"></i> Topics</h5>
                <ul class="list-group">
                    ${analysis.topics.map(topic =>
                        `<li class="list-group-item">${topic.name} (${topic.confidence}% confidence)</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }

    html += '</div>';
    resultsContainer.innerHTML = html;
}

function getSentimentColor(score) {
    if (score > 0.6) return 'success';
    if (score > 0.4) return 'warning';
    return 'danger';
}

function optimizeSearch() {
    const formData = new FormData(document.getElementById('searchOptimizerForm'));
    const suggestionsContainer = document.getElementById('optimizationSuggestions');
    const optimizeBtn = document.getElementById('optimizeSearchBtn');

    // Show loading state
    optimizeBtn.disabled = true;
    optimizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';

    const params = {
        query: formData.get('query'),
        target: formData.get('target'),
        optimizationGoals: formData.getAll('optimizationGoals[]')
    };

    fetch('/admin/api/ai/optimize-search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayOptimizationSuggestions(data.suggestions);
        } else {
            showNotification('Error optimizing search: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error optimizing search:', error);
        showNotification('Error optimizing search', 'error');
    })
    .finally(() => {
        optimizeBtn.disabled = false;
        optimizeBtn.innerHTML = '<i class="fas fa-rocket"></i> Optimize Search';
    });
}

function displayOptimizationSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('optimizationSuggestions');

    if (!suggestionsContainer) return;

    let html = '<div class="optimization-suggestions">';

    suggestions.forEach((suggestion, index) => {
        html += `
            <div class="suggestion-card mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0">${suggestion.title}</h6>
                    <span class="badge bg-${getSuggestionPriorityColor(suggestion.priority)}">
                        ${suggestion.priority}
                    </span>
                </div>
                <p class="mb-2">${suggestion.description}</p>
                <div class="suggestion-actions">
                    <code class="optimized-query">${suggestion.optimizedQuery}</code>
                    <button class="btn btn-sm btn-outline-primary ms-2 copy-query" data-query="${suggestion.optimizedQuery}">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                ${suggestion.expectedImprovement ? `<small class="text-muted">Expected improvement: ${suggestion.expectedImprovement}</small>` : ''}
            </div>
        `;
    });

    html += '</div>';
    suggestionsContainer.innerHTML = html;

    // Add copy functionality
    suggestionsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-query')) {
            const query = e.target.getAttribute('data-query');
            copyToClipboard(query);
            showNotification('Optimized query copied to clipboard', 'success');
        }
    });
}

function getSuggestionPriorityColor(priority) {
    switch(priority.toLowerCase()) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'secondary';
    }
}

function getOptimizationSuggestions(query) {
    fetch('/admin/api/ai/search-suggestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.suggestions.length > 0) {
            displayQuickSuggestions(data.suggestions);
        }
    })
    .catch(error => {
        console.error('Error getting suggestions:', error);
    });
}

function displayQuickSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('quickSuggestions');
    if (!suggestionsContainer) return;

    let html = '<div class="quick-suggestions mt-2"><small class="text-muted">Suggestions:</small><br>';
    suggestions.forEach(suggestion => {
        html += `<span class="badge bg-light text-dark me-1 mb-1 suggestion-tag" data-suggestion="${suggestion}">${suggestion}</span>`;
    });
    html += '</div>';

    suggestionsContainer.innerHTML = html;

    // Add click handlers
    suggestionsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-tag')) {
            const searchInput = document.getElementById('searchQuery');
            if (searchInput) {
                searchInput.value = e.target.getAttribute('data-suggestion');
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    });
}

function generateAIReport() {
    const formData = new FormData(document.getElementById('reportGeneratorForm'));
    const generateReportBtn = document.getElementById('generateReportBtn');

    // Show loading state
    generateReportBtn.disabled = true;
    generateReportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Report...';

    const params = {
        reportType: formData.get('reportType'),
        dateRange: {
            start: formData.get('startDate'),
            end: formData.get('endDate')
        },
        filters: formData.getAll('filters[]'),
        format: formData.get('format')
    };

    fetch('/admin/api/ai/generate-report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Download or display report
            if (data.downloadUrl) {
                window.open(data.downloadUrl, '_blank');
            }
            showNotification('Report generated successfully', 'success');
        } else {
            showNotification('Error generating report: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error generating report:', error);
        showNotification('Error generating report', 'error');
    })
    .finally(() => {
        generateReportBtn.disabled = false;
        generateReportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Generate Report';
    });
}

function loadAIUsageStats() {
    fetch('/admin/api/ai/usage-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateAIStatsDisplay(data.stats);
            }
        })
        .catch(error => {
            console.error('Error loading AI usage stats:', error);
        });
}

function updateAIStatsDisplay(stats) {
    // Update stat cards
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(`ai-stat-${key}`);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

function initializeAICharts() {
    // AI usage over time chart
    const usageChartCanvas = document.getElementById('aiUsageChart');
    if (usageChartCanvas && typeof Chart !== 'undefined') {
        fetch('/admin/api/ai/usage-data')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    new Chart(usageChartCanvas, {
                        type: 'line',
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'AI Requests',
                                data: data.values,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'AI Usage Over Time'
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading AI usage data:', error);
            });
    }
}

function initializeDateRangePicker() {
    // Initialize date range picker if available
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    if (startDate && endDate) {
        // Set default date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

        startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
        endDate.value = today.toISOString().split('T')[0];
    }
}

function handleFileUpload(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const contentTextarea = document.getElementById('contentText');
        if (contentTextarea) {
            contentTextarea.value = content;
        }
    };
    reader.readAsText(file);
}

function testAIConnection() {
    const testAIBtn = document.getElementById('testAIConnection');
    const originalText = testAIBtn.textContent;

    testAIBtn.disabled = true;
    testAIBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

    fetch('/admin/api/ai/test-connection', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('AI connection successful', 'success');
        } else {
            showNotification('AI connection failed: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error testing AI connection:', error);
        showNotification('Error testing AI connection', 'error');
    })
    .finally(() => {
        testAIBtn.disabled = false;
        testAIBtn.textContent = originalText;
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
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
window.AIToolsUtils = {
    generateDorks,
    analyzeContent,
    optimizeSearch,
    generateAIReport,
    loadAIUsageStats,
    testAIConnection,
    copyToClipboard,
    showNotification
};