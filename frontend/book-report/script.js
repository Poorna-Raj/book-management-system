// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

// Global variables
let salesChart = null;
let reportData = [];

$(document).ready(function() {
    // Check if user is logged in
    checkAuth();
    
    // Set report date
    setReportDate();
    
    // Load sales report
    loadReport();
});

// Check authentication
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'User';
    const userRole = localStorage.getItem('userRole') || 'USER';
    
    if (!userId) {
        window.location.href = '../login/login.html';
        return;
    }
    
    // Update user info in header
    $('#userName').text(userName);
    $('#userRole').text(userRole.toUpperCase());
    $('#userAvatar').text(userName.charAt(0).toUpperCase());
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '../login/login.html';
    }
}

// Set report date
function setReportDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    $('#reportDate').text(dateString);
    $('#printDate').text(dateString);
}

// Load report data
function loadReport() {
    // Show loading
    $('#loadingIndicator').show();
    $('#summaryCards').hide();
    $('#reportContent').hide();
    
    $.ajax({
        url: `${API_BASE_URL}/reports/book-sales-summary`,
        type: 'GET',
        success: function(data) {
            reportData = data;
            console.log('Book sales data loaded:', data);
            
            // Hide loading
            $('#loadingIndicator').hide();
            
            // Process and display data
            if (data && data.length > 0) {
                processReportData(data);
            } else {
                $('#loadingIndicator').html(`
                    <div style="text-align: center; padding: 60px 20px;">
                        <i class="fas fa-chart-pie" style="font-size: 64px; color: #d1d5db; display: block; margin-bottom: 20px;"></i>
                        <h3 style="font-family: 'Syne', sans-serif; font-size: 22px; color: var(--text-dark); margin-bottom: 10px;">No Sales Data Available</h3>
                        <p style="color: var(--text-light); font-size: 15px;">No book sales have been recorded yet.</p>
                    </div>
                `).show();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading sales report:', error);
            $('#loadingIndicator').html(`
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-circle" style="font-size: 64px; color: #dc2626; display: block; margin-bottom: 20px;"></i>
                    <h3 style="font-family: 'Syne', sans-serif; font-size: 22px; color: var(--text-dark); margin-bottom: 10px;">Failed to Load Report</h3>
                    <p style="color: var(--text-light); font-size: 15px; margin-bottom: 20px;">Please try again or contact support if the problem persists.</p>
                    <button class="btn btn-primary" onclick="loadReport()">
                        <i class="fas fa-sync"></i> Retry
                    </button>
                </div>
            `).show();
        }
    });
}

// Process report data
function processReportData(data) {
    // Calculate summary statistics
    calculateSummary(data);
    
    // Create pie chart
    createPieChart(data);
    
    // Display sales table
    displaySalesTable(data);
    
    // Show content
    $('#summaryCards').show();
    $('#reportContent').show();
}

// Calculate summary statistics
function calculateSummary(data) {
    let totalBooksSold = 0;
    let totalRevenue = 0;
    const categories = data.length;
    
    data.forEach(item => {
        totalBooksSold += item.totalSold || 0;
        totalRevenue += item.totalRevenue || 0;
    });
    
    // Find top selling category
    const topCategory = data.reduce((max, item) => 
        (item.totalSold || 0) > (max.totalSold || 0) ? item : max, data[0]
    );
    
    // Update summary cards
    $('#totalBooksSold').text(totalBooksSold.toLocaleString());
    $('#totalRevenue').text('$' + totalRevenue.toFixed(2));
    $('#totalCategories').text(categories);
    $('#topCategory').text(formatBookType(topCategory.bookType));
}

// Create pie chart
function createPieChart(data) {
    const ctx = document.getElementById('salesPieChart');
    
    // Destroy existing chart if it exists
    if (salesChart) {
        salesChart.destroy();
    }
    
    // Prepare data for chart
    const labels = data.map(item => formatBookType(item.bookType));
    const salesData = data.map(item => item.totalSold || 0);
    
    // Generate colors - vibrant gradient palette
    const colors = [
        '#10b981', // Green
        '#3b82f6', // Blue
        '#f59e0b', // Orange
        '#8b5cf6', // Purple
        '#ef4444', // Red
        '#06b6d4', // Cyan
        '#ec4899', // Pink
        '#84cc16'  // Lime
    ];
    
    // Create chart
    salesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: salesData,
                backgroundColor: colors.slice(0, data.length),
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Work Sans', sans-serif",
                            size: 13
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} books (${percentage}%)`;
                        }
                    },
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    titleFont: {
                        family: "'Syne', sans-serif",
                        size: 14
                    },
                    bodyFont: {
                        family: "'Work Sans', sans-serif",
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            }
        }
    });
}

// Display sales table
function displaySalesTable(data) {
    const tbody = $('#salesTableBody');
    tbody.empty();
    
    // Sort by total sold (descending)
    const sorted = [...data].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
    
    // Calculate totals for percentages
    const totalSold = sorted.reduce((sum, item) => sum + (item.totalSold || 0), 0);
    const totalRevenue = sorted.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
    
    sorted.forEach((item, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
        
        const soldCount = item.totalSold || 0;
        const revenue = item.totalRevenue || 0;
        
        const salesPercentage = totalSold > 0 ? ((soldCount / totalSold) * 100).toFixed(1) : '0.0';
        const revenuePercentage = totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) : '0.0';
        
        const row = `
            <tr>
                <td>
                    <div class="rank-badge ${rankClass}">${rank}</div>
                </td>
                <td>
                    <span class="type-badge">${formatBookType(item.bookType)}</span>
                </td>
                <td><strong>${soldCount.toLocaleString()}</strong></td>
                <td><strong>$${revenue.toFixed(2)}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="progress-bar" style="flex: 1;">
                            <div class="progress-fill" style="width: ${salesPercentage}%"></div>
                        </div>
                        <span style="min-width: 45px; text-align: right;">${salesPercentage}%</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="progress-bar" style="flex: 1;">
                            <div class="progress-fill" style="width: ${revenuePercentage}%"></div>
                        </div>
                        <span style="min-width: 45px; text-align: right;">${revenuePercentage}%</span>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Format book type for display
function formatBookType(type) {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Export to PDF
function exportToPDF() {
    if (!reportData || reportData.length === 0) {
        alert('No data available to export');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Set font
    doc.setFont('helvetica');
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text('Book Management System', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Book Sales Analytics Report', 105, 30, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Generated on: ${dateStr}`, 105, 38, { align: 'center' });
    
    // Calculate summary
    const totalSold = reportData.reduce((sum, item) => sum + (item.totalSold || 0), 0);
    const totalRevenue = reportData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
    const categories = reportData.length;
    
    // Add summary
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text('Sales Summary', 14, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Total Books Sold: ${totalSold} | Total Revenue: $${totalRevenue.toFixed(2)} | Categories: ${categories}`, 14, 57);
    
    // Add chart image
    const canvas = document.getElementById('salesPieChart');
    const chartImage = canvas.toDataURL('image/png');
    doc.addImage(chartImage, 'PNG', 35, 65, 140, 140);
    
    // Prepare table data
    const sorted = [...reportData].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
    
    const tableData = sorted.map((item, index) => {
        const soldCount = item.totalSold || 0;
        const revenue = item.totalRevenue || 0;
        const salesPercentage = totalSold > 0 ? ((soldCount / totalSold) * 100).toFixed(1) : '0.0';
        const revenuePercentage = totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) : '0.0';
        
        return [
            index + 1,
            formatBookType(item.bookType),
            soldCount.toLocaleString(),
            '$' + revenue.toFixed(2),
            salesPercentage + '%',
            revenuePercentage + '%'
        ];
    });
    
    // Add table
    doc.autoTable({
        startY: 215,
        head: [['Rank', 'Book Type', 'Books Sold', 'Revenue', '% Sales', '% Revenue']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [31, 41, 55]
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 50 },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' }
        },
        margin: { left: 14, right: 14 },
        styles: {
            cellPadding: 3,
            lineColor: [229, 231, 235],
            lineWidth: 0.1
        }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text(
            `Page ${i} of ${pageCount}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }
    
    // Save the PDF
    const fileName = `Book_Sales_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}

// Prepare chart for printing
window.onbeforeprint = function() {
    // Convert chart to image for printing
    const canvas = document.getElementById('salesPieChart');
    const chartImage = canvas.toDataURL('image/png');
    $('#printChartImage').attr('src', chartImage);
    $('#printChartContainer').show();
};

window.onafterprint = function() {
    $('#printChartContainer').hide();
};