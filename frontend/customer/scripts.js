// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

// Global variables
let customers = [];
let deleteCustomerId = null;
let isEditMode = false;
let currentManagerId = null; // Store logged-in manager's ID

$(document).ready(function() {
    // Check if user is logged in
    checkAuth();
    
    // Load initial data
    loadCustomers();
    
    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterCustomers(searchTerm);
    });
    
    // Form submission
    $('#customerForm').on('submit', function(e) {
        e.preventDefault();
        
        if (isEditMode) {
            updateCustomer();
        } else {
            createCustomer();
        }
    });
});

// Check authentication
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'User';
    const userRole = localStorage.getItem('userRole') || 'USER';
    
    if (!userId) {
        window.location.href = '/login.html';
        return;
    }
    
    // Store the logged-in user's ID as manager ID
    currentManagerId = parseInt(userId);
    
    // Update user info in header
    $('#userName').text(userName);
    $('#userRole').text(userRole.toUpperCase());
    $('#userAvatar').text(userName.charAt(0).toUpperCase());
    
    // Set manager ID field to current user's ID and make it readonly
    $('#managerId').val(currentManagerId);
    $('#managerId').prop('readonly', true);
    
    console.log('Logged in as:', userName, '(ID:', currentManagerId + ')');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '../login/login.html';
    }
}

// Load all customers
function loadCustomers() {
    $.ajax({
        url: `${API_BASE_URL}/customers`,
        type: 'GET',
        success: function(data) {
            customers = data;
            displayCustomers(customers);
            updateCustomerCount();
        },
        error: function(xhr, status, error) {
            console.error('Error loading customers:', error);
            showError('Failed to load customers. Please try again.');
        }
    });
}

// Display customers in table
function displayCustomers(data) {
    const tbody = $('#customerTableBody');
    tbody.empty();
    
    if (data.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="10" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>No customers found. Click "Add New Customer" to get started.</p>
                </td>
            </tr>
        `);
        return;
    }
    
    data.forEach(customer => {
        const genderClass = customer.gender ? customer.gender.toLowerCase() : 'other';
        const row = `
            <tr>
                <td>${customer.customerId}</td>
                <td>${customer.customerName}</td>
                <td>${customer.age}</td>
                <td>
                    <span class="gender-badge ${genderClass}">
                        ${customer.gender || 'N/A'}
                    </span>
                </td>
                <td>${customer.contactNumber}</td>
                <td>${customer.email}</td>
                <td>${customer.nic}</td>
                <td>${customer.address}</td>
                <td>${customer.managerId}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn edit" onclick="openEditModal(${customer.customerId})" 
                                title="Edit Customer">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete" onclick="openDeleteModal(${customer.customerId}, '${customer.customerName}')" 
                                title="Delete Customer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Filter customers based on search
function filterCustomers(searchTerm) {
    if (!searchTerm) {
        displayCustomers(customers);
        return;
    }
    
    const filtered = customers.filter(customer => {
        return (
            customer.customerName.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.contactNumber.includes(searchTerm) ||
            customer.nic.toLowerCase().includes(searchTerm) ||
            customer.address.toLowerCase().includes(searchTerm)
        );
    });
    
    displayCustomers(filtered);
}

// Update customer count
function updateCustomerCount() {
    const count = customers.length;
    $('#customerCount').text(`${count} customer${count !== 1 ? 's' : ''}`);
}

// Open add customer modal
function openAddModal() {
    isEditMode = false;
    $('#modalTitle').html('<i class="fas fa-user-plus"></i> Add New Customer');
    $('#submitBtnText').text('Save Customer');
    $('#customerForm')[0].reset();
    $('#customerId').val('');
    
    // Set manager ID to current user's ID
    $('#managerId').val(currentManagerId);
    
    $('#customerModal').addClass('show');
}

// Open edit customer modal
function openEditModal(customerId) {
    isEditMode = true;
    $('#modalTitle').html('<i class="fas fa-user-edit"></i> Edit Customer');
    $('#submitBtnText').text('Update Customer');
    
    const customer = customers.find(c => c.customerId === customerId);
    
    if (customer) {
        $('#customerId').val(customer.customerId);
        $('#customerName').val(customer.customerName);
        $('#age').val(customer.age);
        $('#gender').val(customer.gender);
        $('#nic').val(customer.nic);
        $('#contactNumber').val(customer.contactNumber);
        $('#email').val(customer.email);
        $('#address').val(customer.address);
        
        // Keep the existing manager ID (in case it's different)
        $('#managerId').val(customer.managerId);
        
        $('#customerModal').addClass('show');
    }
}

// Close modal
function closeModal() {
    $('#customerModal').removeClass('show');
    $('#customerForm')[0].reset();
}

// Create new customer
function createCustomer() {
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const customerData = {
        customerName: $('#customerName').val().trim(),
        age: parseInt($('#age').val()),
        gender: $('#gender').val(),
        nic: $('#nic').val().trim(),
        contactNumber: $('#contactNumber').val().trim(),
        email: $('#email').val().trim(),
        address: $('#address').val().trim(),
        managerId: currentManagerId // Use logged-in user's ID
    };
    
    console.log('Creating customer with data:', customerData);
    
    $.ajax({
        url: `${API_BASE_URL}/customers`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(customerData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Customer created successfully!');
            loadCustomers();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to create customer.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error creating customer:', error);
        }
    });
}

// Update existing customer
function updateCustomer() {
    const customerId = $('#customerId').val();
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const customerData = {
        customerName: $('#customerName').val().trim(),
        age: parseInt($('#age').val()),
        gender: $('#gender').val(),
        nic: $('#nic').val().trim(),
        contactNumber: $('#contactNumber').val().trim(),
        email: $('#email').val().trim(),
        address: $('#address').val().trim(),
        managerId: parseInt($('#managerId').val()) // Use the value from form (might be original manager)
    };
    
    console.log('Updating customer with data:', customerData);
    
    $.ajax({
        url: `${API_BASE_URL}/customers/${customerId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(customerData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Customer updated successfully!');
            loadCustomers();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to update customer.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error updating customer:', error);
        }
    });
}

// Open delete confirmation modal
function openDeleteModal(customerId, customerName) {
    deleteCustomerId = customerId;
    $('#deleteCustomerName').text(customerName);
    $('#deleteModal').addClass('show');
}

// Close delete modal
function closeDeleteModal() {
    $('#deleteModal').removeClass('show');
    deleteCustomerId = null;
}

// Confirm delete
function confirmDelete() {
    if (!deleteCustomerId) return;
    
    const deleteBtn = $('#confirmDeleteBtn');
    deleteBtn.addClass('loading');
    
    $.ajax({
        url: `${API_BASE_URL}/customers/${deleteCustomerId}`,
        type: 'DELETE',
        success: function(response) {
            deleteBtn.removeClass('loading');
            closeDeleteModal();
            showSuccess('Customer deleted successfully!');
            loadCustomers();
        },
        error: function(xhr, status, error) {
            deleteBtn.removeClass('loading');
            let errorMsg = 'Failed to delete customer.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error deleting customer:', error);
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