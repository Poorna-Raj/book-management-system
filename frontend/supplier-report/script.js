// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

// Global variable
let reportData = [];

$(document).ready(function() {
    // Check if user is logged in
    checkAuth();
    
    // Set report date
    setReportDate();
    
    // Load report data
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
    $('#reportContent').empty();
    
    $.ajax({
        url: `${API_BASE_URL}/reports/supplier-performance`,
        type: 'GET',
        success: function(data) {
            reportData = data;
            console.log('Supplier performance data loaded:', data);
            
            // Hide loading
            $('#loadingIndicator').hide();
            
            // Process and display data
            processReportData(data);
        },
        error: function(xhr, status, error) {
            console.error('Error loading report:', error);
            $('#loadingIndicator').html(`
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Failed to load report</h3>
                    <p>Please try again or contact support if the problem persists.</p>
                    <button class="btn btn-primary" onclick="loadReport()">
                        <i class="fas fa-sync"></i> Retry
                    </button>
                </div>
            `);
        }
    });
}

// Process report data
function processReportData(data) {
    if (!data || data.length === 0) {
        $('#reportContent').html(`
            <div class="supplier-card" style="grid-column: 1/-1;">
                <div style="text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-inbox" style="font-size: 48px; display: block; margin-bottom: 15px; color: #d1d5db;"></i>
                    <p>No supplier performance data available.</p>
                </div>
            </div>
        `);
        return;
    }
    
    // Calculate summary statistics
    calculateSummary(data);
    
    // Display supplier cards
    displaySupplierCards(data);
}

// Calculate summary statistics
function calculateSummary(data) {
    const totalSuppliers = data.length;
    let totalBooks = 0;
    let totalStock = 0;
    let totalAvgPrice = 0;
    
    data.forEach(supplier => {
        totalBooks += supplier.totalBooks || 0;
        totalStock += supplier.totalStock || 0;
        totalAvgPrice += supplier.averagePrice || 0;
    });
    
    const overallAvgPrice = totalSuppliers > 0 ? totalAvgPrice / totalSuppliers : 0;
    
    // Update summary cards
    $('#totalSuppliers').text(totalSuppliers);
    $('#totalBooksSupplied').text(totalBooks);
    $('#totalStockSupplied').text(totalStock.toLocaleString());
    $('#avgPrice').text('$' + overallAvgPrice.toFixed(2));
    
    // Show summary cards
    $('#summaryCards').show();
}

// Display supplier cards
function displaySupplierCards(data) {
    const container = $('#reportContent');
    container.empty();
    
    // Sort by total stock (best performing first)
    data.sort((a, b) => (b.totalStock || 0) - (a.totalStock || 0));
    
    data.forEach(supplier => {
        const card = createSupplierCard(supplier);
        container.append(card);
    });
}

// Create supplier performance card
function createSupplierCard(supplier) {
    const card = $('<div>').addClass('supplier-card');
    
    // Determine performance badge
    const totalStock = supplier.totalStock || 0;
    let badgeClass = 'average';
    let badgeText = 'Average';
    
    if (totalStock >= 100) {
        badgeClass = 'excellent';
        badgeText = 'Excellent';
    } else if (totalStock >= 50) {
        badgeClass = 'good';
        badgeText = 'Good';
    }
    
    const header = `
        <div class="supplier-header">
            <div class="supplier-icon">
                <i class="fas fa-truck"></i>
            </div>
            <div class="supplier-info">
                <h3>${supplier.companyName || 'Unknown Supplier'}</h3>
                <p>Manager: ${supplier.managerName || 'Not assigned'}</p>
            </div>
        </div>
    `;
    
    const stats = `
        <div class="supplier-stats">
            <div class="stat-row">
                <span class="stat-label">
                    <i class="fas fa-book"></i>
                    Total Books
                </span>
                <span class="stat-value">${supplier.totalBooks || 0}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">
                    <i class="fas fa-boxes"></i>
                    Total Stock
                </span>
                <span class="stat-value highlight">${(supplier.totalStock || 0).toLocaleString()}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">
                    <i class="fas fa-dollar-sign"></i>
                    Average Price
                </span>
                <span class="stat-value">$${(supplier.averagePrice || 0).toFixed(2)}</span>
            </div>
            <div class="stat-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                <span class="stat-label">
                    <i class="fas fa-chart-line"></i>
                    Performance
                </span>
                <span class="performance-badge ${badgeClass}">${badgeText}</span>
            </div>
        </div>
    `;
    
    card.append(header);
    card.append(stats);
    
    return card;
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
    doc.text('Supplier Performance Report', 105, 30, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Generated on: ${dateStr}`, 105, 38, { align: 'center' });
    
    // Add summary
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('Performance Summary', 14, 50);
    
    const totalSuppliers = reportData.length;
    let totalBooks = 0;
    let totalStock = 0;
    let totalAvgPrice = 0;
    
    reportData.forEach(supplier => {
        totalBooks += supplier.totalBooks || 0;
        totalStock += supplier.totalStock || 0;
        totalAvgPrice += supplier.averagePrice || 0;
    });
    
    const overallAvgPrice = totalSuppliers > 0 ? totalAvgPrice / totalSuppliers : 0;
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Total Suppliers: ${totalSuppliers} | Total Books: ${totalBooks} | Total Stock: ${totalStock} units | Avg Price: $${overallAvgPrice.toFixed(2)}`, 14, 57);
    
    // Prepare table data
    const tableData = reportData.map((supplier, index) => {
        let performance = 'Average';
        const stock = supplier.totalStock || 0;
        if (stock >= 100) performance = 'Excellent';
        else if (stock >= 50) performance = 'Good';
        
        return [
            index + 1,
            supplier.companyName || 'Unknown',
            supplier.managerName || 'Not assigned',
            supplier.totalBooks || 0,
            (supplier.totalStock || 0).toLocaleString(),
            '$' + (supplier.averagePrice || 0).toFixed(2),
            performance
        ];
    });
    
    // Add table
    doc.autoTable({
        startY: 65,
        head: [['#', 'Company Name', 'Manager', 'Books', 'Stock', 'Avg Price', 'Performance']],
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
            0: { cellWidth: 10 },
            1: { cellWidth: 50 },
            2: { cellWidth: 35 },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 25, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' },
            6: { cellWidth: 25, halign: 'center' }
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
    const fileName = `Supplier_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}