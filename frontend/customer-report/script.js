// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

// Global variables
let customers = [];
let currentCustomer = null;
let reportData = [];

$(document).ready(function() {
    // Check if user is logged in
    checkAuth();
    
    // Set report date
    setReportDate();
    
    // Load customers for dropdown
    loadCustomers();
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

// Load customers for dropdown
function loadCustomers() {
    $.ajax({
        url: `${API_BASE_URL}/customers`,
        type: 'GET',
        success: function(data) {
            customers = data;
            populateCustomerDropdown();
        },
        error: function(xhr, status, error) {
            console.error('Error loading customers:', error);
            $('#customerSelect').html('<option value="">Failed to load customers</option>');
        }
    });
}

// Populate customer dropdown
function populateCustomerDropdown() {
    const dropdown = $('#customerSelect');
    dropdown.empty();
    dropdown.append('<option value="">Select a customer...</option>');
    
    customers.forEach(customer => {
        dropdown.append(`<option value="${customer.customerId}">${customer.customerName} (${customer.email})</option>`);
    });
}

// Load customer purchase report
function loadCustomerReport() {
    const customerId = $('#customerSelect').val();
    
    if (!customerId) {
        alert('Please select a customer first');
        return;
    }
    
    // Find customer details
    currentCustomer = customers.find(c => c.customerId == customerId);
    
    if (!currentCustomer) {
        alert('Customer not found');
        return;
    }
    
    // Show loading
    $('#loadingIndicator').show();
    $('#customerInfoCard').hide();
    $('#ordersContainer').hide();
    $('#noDataCard').hide();
    $('#actionBar').hide();
    
    // Load purchase history
    $.ajax({
        url: `${API_BASE_URL}/reports/customer-history/${customerId}`,
        type: 'GET',
        success: function(data) {
            reportData = data;
            console.log('Purchase history loaded:', data);
            
            // Hide loading
            $('#loadingIndicator').hide();
            
            // Display customer info and orders
            if (data && data.length > 0) {
                displayCustomerInfo(data);
                displayOrders(data);
                $('#actionBar').show();
            } else {
                $('#noDataCard').show();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading purchase history:', error);
            $('#loadingIndicator').hide();
            alert('Failed to load purchase history. Please try again.');
        }
    });
}

// Display customer information
function displayCustomerInfo(data) {
    $('#customerNameDisplay').text(currentCustomer.customerName);
    $('#customerEmailDisplay').text(currentCustomer.email);
    $('#customerContactDisplay').text(currentCustomer.contactNumber || 'N/A');
    
    // Calculate statistics
    const uniqueOrders = new Set(data.map(item => item.orderId)).size;
    const totalBooks = data.length;
    const totalSpent = data.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    
    $('#totalOrders').text(uniqueOrders);
    $('#totalBooks').text(totalBooks);
    $('#totalSpent').text('$' + totalSpent.toFixed(2));
    
    $('#customerInfoCard').show();
}

// Display orders
function displayOrders(data) {
    const container = $('#ordersContainer');
    container.empty();
    
    // Group data by order ID
    const orderMap = new Map();
    
    data.forEach(item => {
        if (!orderMap.has(item.orderId)) {
            orderMap.set(item.orderId, {
                orderId: item.orderId,
                totalPrice: item.totalPrice,
                orderStatus: item.orderStatus,
                cashierName: item.cashierName,
                books: []
            });
        }
        orderMap.get(item.orderId).books.push(item.bookName);
    });
    
    // Create order cards
    orderMap.forEach((order, orderId) => {
        const card = createOrderCard(order);
        container.append(card);
    });
    
    container.show();
}

// Create order card
function createOrderCard(order) {
    const statusClass = (order.orderStatus || 'PENDING').toLowerCase();
    const statusText = formatStatus(order.orderStatus);
    
    const booksList = order.books.map(bookName => `
        <div class="book-item">
            <i class="fas fa-book"></i>
            <span class="book-name">${bookName}</span>
        </div>
    `).join('');
    
    const card = `
        <div class="order-card">
            <div class="order-header">
                <div class="order-title">
                    <div class="order-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="order-title-text">
                        <h3>Order #${order.orderId}</h3>
                        <p>${order.books.length} book${order.books.length !== 1 ? 's' : ''} purchased</p>
                    </div>
                </div>
                <div class="order-price">
                    <div class="price-label">Total Price</div>
                    <div class="price-value">$${(order.totalPrice || 0).toFixed(2)}</div>
                </div>
            </div>
            
            <div class="order-info">
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="info-content">
                        <span>Status</span>
                        <strong><span class="status-badge ${statusClass}">${statusText}</span></strong>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="info-content">
                        <span>Cashier</span>
                        <strong>${order.cashierName || 'N/A'}</strong>
                    </div>
                </div>
            </div>
            
            <div class="books-section">
                <h4><i class="fas fa-book"></i> Books Purchased</h4>
                <div class="books-list">
                    ${booksList}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Format order status
function formatStatus(status) {
    if (!status) return 'Pending';
    return status.replace(/_/g, ' ');
}

// Export to PDF
function exportToPDF() {
    if (!reportData || reportData.length === 0 || !currentCustomer) {
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
    doc.text('Customer Purchase History Report', 105, 30, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Generated on: ${dateStr}`, 105, 38, { align: 'center' });
    
    // Add customer info
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text('Customer Information', 14, 50);
    
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text(`Name: ${currentCustomer.customerName}`, 14, 58);
    doc.text(`Email: ${currentCustomer.email}`, 14, 64);
    doc.text(`Contact: ${currentCustomer.contactNumber || 'N/A'}`, 14, 70);
    
    // Calculate statistics
    const uniqueOrders = new Set(reportData.map(item => item.orderId)).size;
    const totalBooks = reportData.length;
    const totalSpent = reportData.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Total Orders: ${uniqueOrders} | Books Purchased: ${totalBooks} | Total Spent: $${totalSpent.toFixed(2)}`, 14, 78);
    
    // Prepare table data
    const tableData = reportData.map((item, index) => [
        item.orderId,
        item.bookName || 'N/A',
        '$' + (item.totalPrice || 0).toFixed(2),
        formatStatus(item.orderStatus),
        item.cashierName || 'N/A'
    ]);
    
    // Add table
    doc.autoTable({
        startY: 85,
        head: [['Order ID', 'Book Name', 'Price', 'Status', 'Cashier']],
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
            0: { cellWidth: 25, halign: 'center' },
            1: { cellWidth: 70 },
            2: { cellWidth: 25, halign: 'right' },
            3: { cellWidth: 30, halign: 'center' },
            4: { cellWidth: 35 }
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
    const fileName = `Customer_Purchase_History_${currentCustomer.customerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}