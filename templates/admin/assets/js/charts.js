// Charts.js - Chart.js configurations and utilities
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart.js defaults
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 20;
    Chart.defaults.elements.point.radius = 4;
    Chart.defaults.elements.point.hoverRadius = 6;
});

// Global chart instances for cleanup
let chartInstances = [];

// Create a line chart
function createLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const chartOptions = { ...defaultOptions, ...options };
    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: chartOptions
    });

    chartInstances.push(chart);
    return chart;
}

// Create a bar chart
function createBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    const chartOptions = { ...defaultOptions, ...options };
    const chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: chartOptions
    });

    chartInstances.push(chart);
    return chart;
}

// Create a doughnut chart
function createDoughnutChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            }
        },
        cutout: '60%'
    };

    const chartOptions = { ...defaultOptions, ...options };
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: chartOptions
    });

    chartInstances.push(chart);
    return chart;
}

// Create a pie chart
function createPieChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            }
        }
    };

    const chartOptions = { ...defaultOptions, ...options };
    const chart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: chartOptions
    });

    chartInstances.push(chart);
    return chart;
}

// Update chart data
function updateChart(chart, newData) {
    if (!chart) return;

    chart.data = { ...chart.data, ...newData };
    chart.update();
}

// Destroy all charts
function destroyAllCharts() {
    chartInstances.forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    chartInstances = [];
}

// Color palettes
const colorPalettes = {
    primary: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(245, 87, 108, 0.8)',
        'rgba(79, 172, 254, 0.8)',
        'rgba(0, 242, 254, 0.8)',
        'rgba(67, 233, 123, 0.8)',
        'rgba(56, 249, 215, 0.8)'
    ],
    success: [
        'rgba(72, 187, 120, 0.8)',
        'rgba(56, 178, 172, 0.8)',
        'rgba(66, 153, 225, 0.8)',
        'rgba(102, 126, 234, 0.8)',
        'rgba(155, 81, 224, 0.8)',
        'rgba(236, 201, 75, 0.8)'
    ],
    warning: [
        'rgba(237, 137, 54, 0.8)',
        'rgba(246, 173, 85, 0.8)',
        'rgba(236, 201, 75, 0.8)',
        'rgba(214, 158, 46, 0.8)',
        'rgba(246, 224, 94, 0.8)',
        'rgba(237, 137, 54, 0.8)'
    ],
    danger: [
        'rgba(245, 101, 101, 0.8)',
        'rgba(229, 62, 62, 0.8)',
        'rgba(197, 48, 48, 0.8)',
        'rgba(155, 44, 44, 0.8)',
        'rgba(254, 202, 202, 0.8)',
        'rgba(254, 215, 215, 0.8)'
    ]
};

// Get colors from palette
function getColorsFromPalette(paletteName = 'primary', count = 1) {
    const palette = colorPalettes[paletteName] || colorPalettes.primary;
    const colors = [];

    for (let i = 0; i < count; i++) {
        colors.push(palette[i % palette.length]);
    }

    return colors;
}

// Format chart data from API response
function formatChartData(apiData, chartType = 'line') {
    if (!apiData) return null;

    switch (chartType) {
        case 'line':
        case 'bar':
            return {
                labels: apiData.labels || [],
                datasets: apiData.datasets || [{
                    label: apiData.label || 'Data',
                    data: apiData.data || [],
                    borderColor: getColorsFromPalette('primary', 1)[0],
                    backgroundColor: getColorsFromPalette('primary', 1)[0].replace('0.8', '0.2'),
                    tension: 0.1
                }]
            };

        case 'doughnut':
        case 'pie':
            return {
                labels: apiData.labels || [],
                datasets: [{
                    data: apiData.data || [],
                    backgroundColor: getColorsFromPalette('primary', apiData.data?.length || 1),
                    borderWidth: 1
                }]
            };

        default:
            return apiData;
    }
}

// Auto-resize charts on window resize
window.addEventListener('resize', function() {
    chartInstances.forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
});

// Export functions for global use
window.ChartUtils = {
    createLineChart,
    createBarChart,
    createDoughnutChart,
    createPieChart,
    updateChart,
    destroyAllCharts,
    getColorsFromPalette,
    formatChartData
};