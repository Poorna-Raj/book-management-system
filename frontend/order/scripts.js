// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

// Global variables
let orders = [];
let customers = [];
let books = [];
let selectedCustomer = null;
let selectedBooks = [];
let deleteOrderId = null;
let currentCashierId = null;
let isEditMode = false;
let editingOrderId = null;

$(document).ready(function() {
    // Check if user is logged in
    checkAuth();
    
    // Load initial data
    loadCustomers();
    loadBooks();
    loadOrders();
    
    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterOrders(searchTerm);
    });
    
    // Customer search
    $('#customerSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterCustomers(searchTerm);
    });
    
    // Book search
    $('#bookSearch').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterBooks(searchTerm);
    });
    
    // Close dropdowns when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-select-wrapper').length) {
            $('.dropdown-results').removeClass('show');
        }
    });
    
    // Form submission
    $('#orderForm').on('submit', function(e) {
        e.preventDefault();
        
        if (isEditMode) {
            updateOrder();
        } else {
            createOrder();
        }
    });
});

// Check authentication
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'User';
    const userRole = localStorage.getItem('userRole') || 'CASHIER';
    
    if (!userId) {
        window.location.href = '../login/login.html';
        return;
    }
    
    // Store the logged-in user's ID as cashier ID
    currentCashierId = parseInt(userId);
    
    // Update user info in header
    $('#userName').text(userName);
    $('#userRole').text(userRole.toUpperCase());
    $('#userAvatar').text(userName.charAt(0).toUpperCase());
    
    console.log('Logged in as:', userName, '(Cashier ID:', currentCashierId + ')');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '../login/login.html';
    }
}

// Load customers
function loadCustomers() {
    $.ajax({
        url: `${API_BASE_URL}/customers`,
        type: 'GET',
        success: function(data) {
            customers = data;
            console.log('Loaded', customers.length, 'customers');
        },
        error: function(xhr, status, error) {
            console.error('Error loading customers:', error);
        }
    });
}

// Load books
function loadBooks() {
    $.ajax({
        url: `${API_BASE_URL}/books`,
        type: 'GET',
        success: function(data) {
            books = data;
            console.log('Loaded', books.length, 'books');
        },
        error: function(xhr, status, error) {
            console.error('Error loading books:', error);
        }
    });
}

// Load all orders
function loadOrders() {
    $.ajax({
        url: `${API_BASE_URL}/customer-orders`,
        type: 'GET',
        success: function(data) {
            orders = data;
            displayOrders(orders);
            updateOrderCount();
        },
        error: function(xhr, status, error) {
            console.error('Error loading orders:', error);
            showError('Failed to load orders. Please try again.');
        }
    });
}

// Display orders in table
function displayOrders(data) {
    const tbody = $('#orderTableBody');
    tbody.empty();
    
    if (data.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="7" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>No orders found. Click "Create New Order" to get started.</p>
                </td>
            </tr>
        `);
        return;
    }
    
    data.forEach(order => {
        const bookTags = order.bookNames && order.bookNames.length > 0
            ? order.bookNames.slice(0, 3).map(name => `<span class="book-tag">${name}</span>`).join('')
            : '<span class="book-tag">No books</span>';
        
        const moreBooks = order.bookNames && order.bookNames.length > 3
            ? `<span class="book-tag">+${order.bookNames.length - 3} more</span>`
            : '';
        
        const row = `
            <tr>
                <td><strong>#${order.orderId}</strong></td>
                <td>${order.customerName || 'N/A'}</td>
                <td>${order.cashierName || 'N/A'}</td>
                <td>
                    <div class="book-tags">
                        ${bookTags}${moreBooks}
                    </div>
                </td>
                <td>${order.deadline || 'N/A'}</td>
                <td>${order.importantNote || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn view" onclick="openViewModal(${order.orderId})" 
                                title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="icon-btn edit" onclick="openEditModal(${order.orderId})" 
                                title="Edit Order">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete" onclick="openDeleteModal(${order.orderId})" 
                                title="Delete Order">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Filter orders based on search
function filterOrders(searchTerm) {
    if (!searchTerm) {
        displayOrders(orders);
        return;
    }
    
    const filtered = orders.filter(order => {
        return (
            (order.orderId && order.orderId.toString().includes(searchTerm)) ||
            (order.customerName && order.customerName.toLowerCase().includes(searchTerm)) ||
            (order.cashierName && order.cashierName.toLowerCase().includes(searchTerm)) ||
            (order.importantNote && order.importantNote.toLowerCase().includes(searchTerm))
        );
    });
    
    displayOrders(filtered);
}

// Update order count
function updateOrderCount() {
    const count = orders.length;
    $('#orderCount').text(`${count} order${count !== 1 ? 's' : ''}`);
}

// Filter and display customers
function filterCustomers(searchTerm) {
    const dropdown = $('#customerDropdown');
    
    if (!searchTerm) {
        dropdown.removeClass('show');
        return;
    }
    
    const filtered = customers.filter(customer => {
        return (
            customer.customerName.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.contactNumber.includes(searchTerm)
        );
    });
    
    displayCustomerDropdown(filtered);
}

// Display customer dropdown results
function displayCustomerDropdown(filtered) {
    const dropdown = $('#customerDropdown');
    dropdown.empty();
    
    if (filtered.length === 0) {
        dropdown.html('<div class="no-results">No customers found</div>');
        dropdown.addClass('show');
        return;
    }
    
    filtered.forEach(customer => {
        const item = `
            <div class="dropdown-item" onclick="selectCustomer(${customer.customerId})">
                <div class="dropdown-item-title">${customer.customerName}</div>
                <div class="dropdown-item-subtitle">${customer.email} • ${customer.contactNumber}</div>
            </div>
        `;
        dropdown.append(item);
    });
    
    dropdown.addClass('show');
}

// Select customer
function selectCustomer(customerId) {
    selectedCustomer = customers.find(c => c.customerId === customerId);
    
    if (selectedCustomer) {
        $('#customerId').val(selectedCustomer.customerId);
        $('#selectedCustomerName').text(selectedCustomer.customerName);
        $('#selectedCustomer').show();
        $('#customerSearch').val('');
        $('#customerDropdown').removeClass('show');
    }
}

// Clear selected customer
function clearCustomer() {
    selectedCustomer = null;
    $('#customerId').val('');
    $('#selectedCustomer').hide();
    $('#customerSearch').val('');
}

// Filter and display books
function filterBooks(searchTerm) {
    const dropdown = $('#bookDropdown');
    
    if (!searchTerm) {
        dropdown.removeClass('show');
        return;
    }
    
    const filtered = books.filter(book => {
        return (
            book.bookName.toLowerCase().includes(searchTerm) ||
            book.isbn.toLowerCase().includes(searchTerm)
        );
    });
    
    displayBookDropdown(filtered);
}

// Display book dropdown results
function displayBookDropdown(filtered) {
    const dropdown = $('#bookDropdown');
    dropdown.empty();
    
    if (filtered.length === 0) {
        dropdown.html('<div class="no-results">No books found</div>');
        dropdown.addClass('show');
        return;
    }
    
    filtered.forEach(book => {
        // Don't show books already selected
        if (!selectedBooks.find(b => b.bookId === book.bookId)) {
            const item = `
                <div class="dropdown-item" onclick="addBook(${book.bookId})">
                    <div class="dropdown-item-title">${book.bookName}</div>
                    <div class="dropdown-item-subtitle">ISBN: ${book.isbn} • Stock: ${book.stock}</div>
                </div>
            `;
            dropdown.append(item);
        }
    });
    
    dropdown.addClass('show');
}

// Add book to selection
function addBook(bookId) {
    const book = books.find(b => b.bookId === bookId);
    
    if (book && !selectedBooks.find(b => b.bookId === bookId)) {
        selectedBooks.push(book);
        updateSelectedBooksList();
        $('#bookSearch').val('');
        $('#bookDropdown').removeClass('show');
    }
}

// Remove book from selection
function removeBook(bookId) {
    selectedBooks = selectedBooks.filter(b => b.bookId !== bookId);
    updateSelectedBooksList();
}

// Update selected books list display
function updateSelectedBooksList() {
    const container = $('#selectedBooksList');
    const count = $('#bookCount');
    
    count.text(`(${selectedBooks.length})`);
    
    if (selectedBooks.length === 0) {
        container.html(`
            <div class="no-books-message">
                <i class="fas fa-info-circle"></i>
                No books selected. Search and click to add books.
            </div>
        `);
        return;
    }
    
    container.empty();
    selectedBooks.forEach(book => {
        const item = `
            <div class="selected-book-item">
                <div class="book-item-info">
                    <div class="book-item-name">${book.bookName}</div>
                    <div class="book-item-isbn">ISBN: ${book.isbn}</div>
                </div>
                <button type="button" class="remove-btn" onclick="removeBook(${book.bookId})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        container.append(item);
    });
}

// Open add order modal
function openAddModal() {
    isEditMode = false;
    editingOrderId = null;
    $('#modalTitle').html('<i class="fas fa-cart-plus"></i> Create New Order');
    $('#submitBtnText').text('Create Order');
    $('#orderForm')[0].reset();
    
    // Clear selections
    clearCustomer();
    selectedBooks = [];
    updateSelectedBooksList();
    
    $('#orderModal').addClass('show');
}

// Open edit order modal
function openEditModal(orderId) {
    isEditMode = true;
    editingOrderId = orderId;
    $('#modalTitle').html('<i class="fas fa-edit"></i> Edit Order');
    $('#submitBtnText').text('Update Order');
    
    // Get order details first
    $.ajax({
        url: `${API_BASE_URL}/customer-orders/${orderId}`,
        type: 'GET',
        success: function(order) {
            // Find and select customer
            const customer = customers.find(c => c.customerName === order.customerName);
            if (customer) {
                selectCustomer(customer.customerId);
            }
            
            // Find and select books
            selectedBooks = [];
            if (order.bookNames && order.bookNames.length > 0) {
                order.bookNames.forEach(bookName => {
                    const book = books.find(b => b.bookName === bookName);
                    if (book) {
                        selectedBooks.push(book);
                    }
                });
            }
            updateSelectedBooksList();
            
            // Set deadline and notes
            if (order.deadline) {
                // Convert deadline to datetime-local format if needed
                $('#deadline').val(order.deadline);
            }
            $('#importantNote').val(order.importantNote || '');
            
            $('#orderModal').addClass('show');
        },
        error: function(xhr, status, error) {
            console.error('Error loading order details:', error);
            showError('Failed to load order details');
        }
    });
}

// Close modal
function closeModal() {
    $('#orderModal').removeClass('show');
    $('#orderForm')[0].reset();
    $('.dropdown-results').removeClass('show');
    isEditMode = false;
    editingOrderId = null;
}

// Create new order
function createOrder() {
    // Validation
    if (!selectedCustomer) {
        showError('Please select a customer');
        return;
    }
    
    if (selectedBooks.length === 0) {
        showError('Please add at least one book to the order');
        return;
    }
    
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const orderData = {
        customerId: selectedCustomer.customerId,
        cashierId: currentCashierId,
        bookIds: selectedBooks.map(book => book.bookId),
        deadline: $('#deadline').val(),
        importantNote: $('#importantNote').val().trim()
    };
    
    console.log('Creating order with data:', orderData);
    
    $.ajax({
        url: `${API_BASE_URL}/customer-orders`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Order created successfully!');
            loadOrders();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to create order.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error creating order:', error);
        }
    });
}

// Update existing order
function updateOrder() {
    // Validation
    if (!selectedCustomer) {
        showError('Please select a customer');
        return;
    }
    
    if (selectedBooks.length === 0) {
        showError('Please add at least one book to the order');
        return;
    }
    
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const orderData = {
        customerId: selectedCustomer.customerId,
        cashierId: currentCashierId,
        bookIds: selectedBooks.map(book => book.bookId),
        deadline: $('#deadline').val(),
        importantNote: $('#importantNote').val().trim()
    };
    
    console.log('Updating order', editingOrderId, 'with data:', orderData);
    
    $.ajax({
        url: `${API_BASE_URL}/customer-orders/${editingOrderId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Order updated successfully!');
            loadOrders();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to update order.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error updating order:', error);
        }
    });
}

// Open view order modal
function openViewModal(orderId) {
    const order = orders.find(o => o.orderId === orderId);
    
    if (order) {
        $('#viewOrderId').text(order.orderId);
        $('#viewCustomerName').text(order.customerName || 'N/A');
        $('#viewCashierName').text(order.cashierName || 'N/A');
        $('#viewDeadline').text(order.deadline || 'N/A');
        $('#viewNote').text(order.importantNote || 'No notes');
        
        // Display books
        const booksList = $('#viewBooksList');
        booksList.empty();
        
        if (order.bookNames && order.bookNames.length > 0) {
            order.bookNames.forEach(bookName => {
                booksList.append(`<li>${bookName}</li>`);
            });
        } else {
            booksList.append(`<li>No books in this order</li>`);
        }
        
        $('#viewModal').addClass('show');
    }
}

// Close view modal
function closeViewModal() {
    $('#viewModal').removeClass('show');
}

// Open delete confirmation modal
function openDeleteModal(orderId) {
    deleteOrderId = orderId;
    $('#deleteOrderId').text(orderId);
    $('#deleteModal').addClass('show');
}

// Close delete modal
function closeDeleteModal() {
    $('#deleteModal').removeClass('show');
    deleteOrderId = null;
}

// Confirm delete
function confirmDelete() {
    if (!deleteOrderId) return;
    
    const deleteBtn = $('#confirmDeleteBtn');
    deleteBtn.addClass('loading');
    
    $.ajax({
        url: `${API_BASE_URL}/customer-orders/${deleteOrderId}`,
        type: 'DELETE',
        success: function(response) {
            deleteBtn.removeClass('loading');
            closeDeleteModal();
            showSuccess('Order deleted successfully!');
            loadOrders();
        },
        error: function(xhr, status, error) {
            deleteBtn.removeClass('loading');
            let errorMsg = 'Failed to delete order.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error deleting order:', error);
        }
    });
}

// Show success message
function showSuccess(message) {
    $('#successMessage').text(message);
    $('#successAlert').addClass('show');
    
    setTimeout(() => {
        $('#successAlert').removeClass('show');
    }, 5000);
}

// Show error message
function showError(message) {
    $('#errorMessage').text(message);
    $('#errorAlert').addClass('show');
    
    setTimeout(() => {
        $('#errorAlert').removeClass('show');
    }, 5000);
}

// Close modal when clicking outside
$(window).on('click', function(e) {
    if ($(e.target).hasClass('modal')) {
        closeModal();
        closeViewModal();
        closeDeleteModal();
    }
});

// Close modal with ESC key
$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeViewModal();
        closeDeleteModal();
    }
});