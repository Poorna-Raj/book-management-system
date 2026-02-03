// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

// Global variables
let books = [];
let inventories = [];
let suppliers = [];
let deleteBookId = null;
let isEditMode = false;
let currentUserId = null;

$(document).ready(function() {
    // Check if user is logged in
    checkAuth();
    
    // Load initial data
    loadInventories();
    loadSuppliers();
    loadBooks();
    
    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterBooks(searchTerm);
    });
    
    // Form submission
    $('#bookForm').on('submit', function(e) {
        e.preventDefault();
        
        if (isEditMode) {
            updateBook();
        } else {
            createBook();
        }
    });
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
    
    // Store the logged-in user's ID for API headers
    currentUserId = parseInt(userId);
    
    // Update user info in header
    $('#userName').text(userName);
    $('#userRole').text(userRole.toUpperCase());
    $('#userAvatar').text(userName.charAt(0).toUpperCase());
    
    console.log('Logged in as:', userName, '(ID:', currentUserId + ')');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '../login/login.html';
    }
}

// Load inventories for dropdown
function loadInventories() {
    $.ajax({
        url: `${API_BASE_URL}/inventories`,
        type: 'GET',
        success: function(data) {
            inventories = data;
            populateInventoryDropdown();
        },
        error: function(xhr, status, error) {
            console.error('Error loading inventories:', error);
            $('#inventoryId').html('<option value="">Failed to load inventories</option>');
        }
    });
}

// Populate inventory dropdown
function populateInventoryDropdown() {
    const dropdown = $('#inventoryId');
    dropdown.empty();
    dropdown.append('<option value="">Select Inventory</option>');
    
    inventories.forEach(inventory => {
        dropdown.append(`<option value="${inventory.inventoryId}">${inventory.inventoryTitle || 'Inventory #' + inventory.inventoryId}</option>`);
    });
}

// Load suppliers for dropdown
function loadSuppliers() {
    $.ajax({
        url: `${API_BASE_URL}/suppliers`,
        type: 'GET',
        success: function(data) {
            suppliers = data;
            populateSupplierDropdown();
        },
        error: function(xhr, status, error) {
            console.error('Error loading suppliers:', error);
            $('#supplierId').html('<option value="">Failed to load suppliers</option>');
        }
    });
}

// Populate supplier dropdown
function populateSupplierDropdown() {
    const dropdown = $('#supplierId');
    dropdown.empty();
    dropdown.append('<option value="">None (Optional)</option>');
    
    suppliers.forEach(supplier => {
        dropdown.append(`<option value="${supplier.supplierId}">${supplier.companyName}</option>`);
    });
}

// Load all books
function loadBooks() {
    $.ajax({
        url: `${API_BASE_URL}/books`,
        type: 'GET',
        success: function(data) {
            books = data;
            displayBooks(books);
            updateBookCount();
        },
        error: function(xhr, status, error) {
            console.error('Error loading books:', error);
            showError('Failed to load books. Please try again.');
        }
    });
}

// Display books in table
function displayBooks(data) {
    const tbody = $('#bookTableBody');
    tbody.empty();
    
    if (data.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="13" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>No books found. Click "Add New Book" to get started.</p>
                </td>
            </tr>
        `);
        return;
    }
    
    data.forEach(book => {
        const statusClass = book.status ? book.status.toLowerCase().replace(/_/g, '_') : 'available';
        const inventoryName = book.inventory ? (book.inventory.inventoryName || `Inv #${book.inventory.inventoryId}`) : 'N/A';
        const supplierName = book.supplier ? book.supplier.companyName : 'N/A';
        
        // Safely handle potentially null/undefined values
        const bookId = book.bookId || 'N/A';
        const bookName = book.bookName || 'Untitled';
        const isbn = book.isbn || 'N/A';
        const issue = book.issue !== undefined && book.issue !== null ? book.issue : 'N/A';
        const volume = book.volume !== undefined && book.volume !== null ? book.volume : 'N/A';
        const pages = book.pages !== undefined && book.pages !== null ? book.pages.toLocaleString() : 'N/A';
        const stock = book.stock !== undefined && book.stock !== null ? book.stock : 'N/A';
        const price = book.price !== undefined && book.price !== null ? '$' + book.price.toFixed(2) : 'N/A';
        
        const row = `
            <tr>
                <td>${bookId}</td>
                <td><strong>${bookName}</strong></td>
                <td>${isbn}</td>
                <td><span class="type-badge">${book.type || 'N/A'}</span></td>
                <td><span class="status-badge ${statusClass}">${formatStatus(book.status)}</span></td>
                <td>${issue}</td>
                <td>${volume}</td>
                <td>${pages}</td>
                <td>${stock}</td>
                <td>${price}</td>
                <td>${inventoryName}</td>
                <td>${supplierName}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn edit" onclick="openEditModal(${book.bookId})" 
                                title="Edit Book">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete" onclick="openDeleteModal(${book.bookId}, '${bookName.replace(/'/g, "\\'")}')" 
                                title="Delete Book">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Format status for display
function formatStatus(status) {
    if (!status) return 'N/A';
    return status.replace(/_/g, ' ');
}

// Filter books based on search
function filterBooks(searchTerm) {
    if (!searchTerm) {
        displayBooks(books);
        return;
    }
    
    const filtered = books.filter(book => {
        return (
            book.bookName.toLowerCase().includes(searchTerm) ||
            book.isbn.toLowerCase().includes(searchTerm) ||
            (book.type && book.type.toLowerCase().includes(searchTerm)) ||
            (book.status && book.status.toLowerCase().includes(searchTerm))
        );
    });
    
    displayBooks(filtered);
}

// Update book count
function updateBookCount() {
    const count = books.length;
    $('#bookCount').text(`${count} book${count !== 1 ? 's' : ''}`);
}

// Open add book modal
function openAddModal() {
    isEditMode = false;
    $('#modalTitle').html('<i class="fas fa-book-medical"></i> Add New Book');
    $('#submitBtnText').text('Save Book');
    $('#bookForm')[0].reset();
    $('#bookId').val('');
    
    // Reload dropdowns
    populateInventoryDropdown();
    populateSupplierDropdown();
    
    $('#bookModal').addClass('show');
}

// Open edit book modal
function openEditModal(bookId) {
    isEditMode = true;
    $('#modalTitle').html('<i class="fas fa-edit"></i> Edit Book');
    $('#submitBtnText').text('Update Book');
    
    const book = books.find(b => b.bookId === bookId);
    
    if (book) {
        $('#bookId').val(book.bookId || '');
        $('#bookName').val(book.bookName || '');
        $('#isbn').val(book.isbn || '');
        $('#type').val(book.type || '');
        $('#status').val(book.status || '');
        $('#issue').val(book.issue !== undefined && book.issue !== null ? book.issue : '');
        $('#volume').val(book.volume !== undefined && book.volume !== null ? book.volume : '');
        $('#pages').val(book.pages !== undefined && book.pages !== null ? book.pages : '');
        $('#stock').val(book.stock !== undefined && book.stock !== null ? book.stock : '');
        $('#price').val(book.price !== undefined && book.price !== null ? book.price : '');
        
        // Set inventory and supplier
        if (book.inventory && book.inventory.inventoryId) {
            $('#inventoryId').val(book.inventory.inventoryId);
        } else {
            $('#inventoryId').val('');
        }
        
        if (book.supplier && book.supplier.supplierId) {
            $('#supplierId').val(book.supplier.supplierId);
        } else {
            $('#supplierId').val('');
        }
        
        $('#bookModal').addClass('show');
    }
}

// Close modal
function closeModal() {
    $('#bookModal').removeClass('show');
    $('#bookForm')[0].reset();
}

// Create new book
function createBook() {
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const bookData = {
        bookName: $('#bookName').val().trim(),
        isbn: $('#isbn').val().trim(),
        type: $('#type').val(),
        status: $('#status').val(),
        issue: parseInt($('#issue').val()),
        volume: parseInt($('#volume').val()),
        pages: parseInt($('#pages').val()),
        stock: parseInt($('#stock').val()),
        price: parseFloat($('#price').val()),
        inventoryId: parseInt($('#inventoryId').val())
    };
    
    // Add supplier only if selected
    const supplierId = $('#supplierId').val();
    if (supplierId) {
        bookData.supplierId = parseInt(supplierId);
    }
    
    console.log('Creating book with data:', bookData);
    
    $.ajax({
        url: `${API_BASE_URL}/books`,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'USER_ID': currentUserId
        },
        data: JSON.stringify(bookData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Book created successfully!');
            loadBooks();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to create book.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error creating book:', error);
        }
    });
}

// Update existing book
function updateBook() {
    const bookId = $('#bookId').val();
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const bookData = {
        bookName: $('#bookName').val().trim(),
        isbn: $('#isbn').val().trim(),
        type: $('#type').val(),
        status: $('#status').val(),
        issue: parseInt($('#issue').val()),
        volume: parseInt($('#volume').val()),
        pages: parseInt($('#pages').val()),
        stock: parseInt($('#stock').val()),
        price: parseFloat($('#price').val()),
        inventoryId: parseInt($('#inventoryId').val())
    };
    
    // Add supplier only if selected
    const supplierId = $('#supplierId').val();
    if (supplierId) {
        bookData.supplierId = parseInt(supplierId);
    }
    
    console.log('Updating book with data:', bookData);
    
    $.ajax({
        url: `${API_BASE_URL}/books/${bookId}`,
        type: 'PUT',
        contentType: 'application/json',
        headers: {
            'USER_ID': currentUserId
        },
        data: JSON.stringify(bookData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Book updated successfully!');
            loadBooks();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to update book.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error updating book:', error);
        }
    });
}

// Open delete confirmation modal
function openDeleteModal(bookId, bookName) {
    deleteBookId = bookId;
    $('#deleteBookName').text(bookName);
    $('#deleteModal').addClass('show');
}

// Close delete modal
function closeDeleteModal() {
    $('#deleteModal').removeClass('show');
    deleteBookId = null;
}

// Confirm delete
function confirmDelete() {
    if (!deleteBookId) return;
    
    const deleteBtn = $('#confirmDeleteBtn');
    deleteBtn.addClass('loading');
    
    $.ajax({
        url: `${API_BASE_URL}/books/${deleteBookId}`,
        type: 'DELETE',
        headers: {
            'USER_ID': currentUserId
        },
        success: function(response) {
            deleteBtn.removeClass('loading');
            closeDeleteModal();
            showSuccess('Book deleted successfully!');
            loadBooks();
        },
        error: function(xhr, status, error) {
            deleteBtn.removeClass('loading');
            let errorMsg = 'Failed to delete book.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error deleting book:', error);
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
        closeDeleteModal();
    }
});

// Close modal with ESC key
$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
});