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
        url: `${API_BASE_URL}/reports/inventory-stock`,
        type: 'GET',
        success: function(data) {
            reportData = data;
            console.log('Report data loaded:', data);
            
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
            <div class="inventory-section">
                <div class="no-books">
                    <i class="fas fa-inbox" style="font-size: 48px; display: block; margin-bottom: 15px; color: #d1d5db;"></i>
                    <p>No inventory data available.</p>
                </div>
            </div>
        `);
        return;
    }
    
    // Group data by inventory
    const inventoryMap = new Map();
    
    data.forEach(item => {
        const invTitle = item.inventoryTitle || 'Unnamed Inventory';
        
        if (!inventoryMap.has(invTitle)) {
            inventoryMap.set(invTitle, []);
        }
        
        inventoryMap.get(invTitle).push(item);
    });
    
    // Calculate summary statistics
    calculateSummary(inventoryMap, data);
    
    // Display inventory sections
    displayInventorySections(inventoryMap);
}

// Calculate summary statistics
function calculateSummary(inventoryMap, data) {
    const totalInventories = inventoryMap.size;
    const totalBooks = data.length;
    
    let totalStock = 0;
    let totalValue = 0;
    
    data.forEach(item => {
        totalStock += item.stock || 0;
        totalValue += (item.stock || 0) * (item.price || 0);
    });
    
    // Update summary cards
    $('#totalInventories').text(totalInventories);
    $('#totalBooks').text(totalBooks);
    $('#totalStock').text(totalStock.toLocaleString());
    $('#totalValue').text('$' + totalValue.toFixed(2));
    
    // Show summary cards
    $('#summaryCards').show();
}

// Display inventory sections
function displayInventorySections(inventoryMap) {
    const container = $('#reportContent');
    container.empty();
    
    inventoryMap.forEach((books, inventoryTitle) => {
        const section = createInventorySection(inventoryTitle, books);
        container.append(section);
    });
}

// Create inventory section HTML
function createInventorySection(inventoryTitle, books) {
    // Calculate inventory statistics
    let totalStock = 0;
    let totalValue = 0;
    
    books.forEach(book => {
        totalStock += book.stock || 0;
        totalValue += (book.stock || 0) * (book.price || 0);
    });
    
    const section = $('<div>').addClass('inventory-section');
    
    // Header
    const header = `
        <div class="inventory-header">
            <div class="inventory-title">
                <div class="inventory-icon">
                    <i class="fas fa-warehouse"></i>
                </div>
                <div>
                    <h3>${inventoryTitle}</h3>
                    <p>${books.length} book${books.length !== 1 ? 's' : ''} in inventory</p>
                </div>
            </div>
            <div class="inventory-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Stock:</span>
                    <span class="stat-value">${totalStock.toLocaleString()} units</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Inventory Value:</span>
                    <span class="stat-value">$${totalValue.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
    
    section.append(header);
    
    // Books table
    const table = $('<table>').addClass('books-table');
    
    const thead = `
        <thead>
            <tr>
                <th>Book Name</th>
                <th>ISBN</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Warehouse Keeper</th>
            </tr>
        </thead>
    `;
    
    table.append(thead);
    
    const tbody = $('<tbody>');
    
    books.forEach(book => {
        const statusClass = (book.status || 'AVAILABLE').toLowerCase().replace(/_/g, '_');
        const row = `
            <tr>
                <td><strong>${book.bookName || 'N/A'}</strong></td>
                <td>${book.isbn || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${formatStatus(book.status)}</span></td>
                <td><strong>${book.stock !== undefined ? book.stock : 'N/A'}</strong></td>
                <td>$${book.price !== undefined ? book.price.toFixed(2) : 'N/A'}</td>
                <td>${book.supplierName || 'Not assigned'}</td>
                <td>${book.warehouseKeeperName || 'Not assigned'}</td>
            </tr>
        `;
        tbody.append(row);
    });
    
    table.append(tbody);
    section.append(table);
    
    return section;
}

// Format status for display
function formatStatus(status) {
    if (!status) return 'Available';
    return status.replace(/_/g, ' ');
}

// Export to PDF
function exportToPDF() {
    if (!reportData || reportData.length === 0) {
        alert('No data available to export');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape mode
    
    // Set font
    doc.setFont('helvetica');
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Green color
    doc.text('Book Management System', 148, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55); // Dark gray
    doc.text('Inventory Stock Report', 148, 30, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Light gray
    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Generated on: ${dateStr}`, 148, 38, { align: 'center' });
    
    // Group data by inventory
    const inventoryMap = new Map();
    reportData.forEach(item => {
        const invTitle = item.inventoryTitle || 'Unnamed Inventory';
        if (!inventoryMap.has(invTitle)) {
            inventoryMap.set(invTitle, []);
        }
        inventoryMap.get(invTitle).push(item);
    });
    
    let yPosition = 50;
    
    // Add each inventory section
    inventoryMap.forEach((books, inventoryTitle) => {
        // Check if we need a new page
        if (yPosition > 170) {
            doc.addPage();
            yPosition = 20;
        }
        
        // Inventory title
        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129);
        doc.text(inventoryTitle, 14, yPosition);
        yPosition += 3;
        
        // Calculate stats
        let totalStock = 0;
        let totalValue = 0;
        books.forEach(book => {
            totalStock += book.stock || 0;
            totalValue += (book.stock || 0) * (book.price || 0);
        });
        
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text(`${books.length} books | Stock: ${totalStock} units | Value: $${totalValue.toFixed(2)}`, 14, yPosition);
        yPosition += 8;
        
        // Prepare table data
        const tableData = books.map(book => [
            book.bookName || 'N/A',
            book.isbn || 'N/A',
            formatStatus(book.status),
            book.stock !== undefined ? book.stock.toString() : 'N/A',
            book.price !== undefined ? '$' + book.price.toFixed(2) : 'N/A',
            (book.supplierName || 'Not assigned').substring(0, 15),
            (book.warehouseKeeperName || 'Not assigned').substring(0, 15)
        ]);
        
        // Add table
        doc.autoTable({
            startY: yPosition,
            head: [['Book Name', 'ISBN', 'Status', 'Stock', 'Price', 'Supplier', 'Keeper']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 8,
                textColor: [31, 41, 55]
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            },
            margin: { left: 14, right: 14 },
            styles: {
                cellPadding: 3,
                lineColor: [229, 231, 235],
                lineWidth: 0.1
            }
        });
        
        yPosition = doc.lastAutoTable.finalY + 15;
    });
    
    // Save the PDF
    const fileName = `Inventory_Stock_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}