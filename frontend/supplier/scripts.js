// API base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

// Global variables
let suppliers = [];
let deleteSupplierId = null;
let isEditMode = false;
let currentManagerId = null; // Store logged-in manager's ID

$(document).ready(function() {
    // Check if user is logged in
    checkAuth();
    
    // Load initial data
    loadSuppliers();
    
    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterSuppliers(searchTerm);
    });
    
    // Form submission
    $('#supplierForm').on('submit', function(e) {
        e.preventDefault();
        
        if (isEditMode) {
            updateSupplier();
        } else {
            createSupplier();
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

// Load all suppliers
function loadSuppliers() {
    $.ajax({
        url: `${API_BASE_URL}/suppliers`,
        type: 'GET',
        success: function(data) {
            suppliers = data;
            displaySuppliers(suppliers);
            updateSupplierCount();
        },
        error: function(xhr, status, error) {
            console.error('Error loading suppliers:', error);
            showError('Failed to load suppliers. Please try again.');
        }
    });
}

// Display suppliers in table
function displaySuppliers(data) {
    const tbody = $('#supplierTableBody');
    tbody.empty();
    
    if (data.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="10" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>No suppliers found. Click "Add New Supplier" to get started.</p>
                </td>
            </tr>
        `);
        return;
    }
    
    data.forEach(supplier => {
        const genderClass = supplier.gender ? supplier.gender.toLowerCase() : 'other';
        const row = `
            <tr>
                <td>${supplier.supplierId}</td>
                <td>${supplier.companyName}</td>
                <td>${supplier.contractorName}</td>
                <td>
                    <span class="gender-badge ${genderClass}">
                        ${supplier.gender || 'N/A'}
                    </span>
                </td>
                <td>${supplier.contractorContact}</td>
                <td>${supplier.companyEmail}</td>
                <td>${supplier.contractorNic}</td>
                <td>${supplier.supplierAddress}</td>
                <td>${supplier.managerId}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn edit" onclick="openEditModal(${supplier.supplierId})" 
                                title="Edit Supplier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete" onclick="openDeleteModal(${supplier.supplierId}, '${supplier.companyName}')" 
                                title="Delete Supplier">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Filter suppliers based on search
function filterSuppliers(searchTerm) {
    if (!searchTerm) {
        displaySuppliers(suppliers);
        return;
    }
    
    const filtered = suppliers.filter(supplier => {
        return (
            supplier.companyName.toLowerCase().includes(searchTerm) ||
            supplier.contractorName.toLowerCase().includes(searchTerm) ||
            supplier.companyEmail.toLowerCase().includes(searchTerm) ||
            supplier.contractorContact.includes(searchTerm) ||
            supplier.contractorNic.toLowerCase().includes(searchTerm) ||
            supplier.supplierAddress.toLowerCase().includes(searchTerm)
        );
    });
    
    displaySuppliers(filtered);
}

// Update supplier count
function updateSupplierCount() {
    const count = suppliers.length;
    $('#supplierCount').text(`${count} supplier${count !== 1 ? 's' : ''}`);
}

// Open add supplier modal
function openAddModal() {
    isEditMode = false;
    $('#modalTitle').html('<i class="fas fa-truck-loading"></i> Add New Supplier');
    $('#submitBtnText').text('Save Supplier');
    $('#supplierForm')[0].reset();
    $('#supplierId').val('');
    
    // Set manager ID to current user's ID
    $('#managerId').val(currentManagerId);
    
    $('#supplierModal').addClass('show');
}

// Open edit supplier modal
function openEditModal(supplierId) {
    isEditMode = true;
    $('#modalTitle').html('<i class="fas fa-edit"></i> Edit Supplier');
    $('#submitBtnText').text('Update Supplier');
    
    const supplier = suppliers.find(s => s.supplierId === supplierId);
    
    if (supplier) {
        $('#supplierId').val(supplier.supplierId);
        $('#companyName').val(supplier.companyName);
        $('#contractorName').val(supplier.contractorName);
        $('#gender').val(supplier.gender);
        $('#contractorNic').val(supplier.contractorNic);
        $('#contractorContact').val(supplier.contractorContact);
        $('#companyEmail').val(supplier.companyEmail);
        $('#supplierAddress').val(supplier.supplierAddress);
        
        // Keep the existing manager ID (in case it's different)
        $('#managerId').val(supplier.managerId);
        
        $('#supplierModal').addClass('show');
    }
}

// Close modal
function closeModal() {
    $('#supplierModal').removeClass('show');
    $('#supplierForm')[0].reset();
}

// Create new supplier
function createSupplier() {
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const supplierData = {
        companyName: $('#companyName').val().trim(),
        contractorName: $('#contractorName').val().trim(),
        gender: $('#gender').val(),
        contractorNic: $('#contractorNic').val().trim(),
        contractorContact: $('#contractorContact').val().trim(),
        companyEmail: $('#companyEmail').val().trim(),
        supplierAddress: $('#supplierAddress').val().trim(),
        managerId: currentManagerId // Use logged-in user's ID
    };
    
    console.log('Creating supplier with data:', supplierData);
    
    $.ajax({
        url: `${API_BASE_URL}/suppliers`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(supplierData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Supplier created successfully!');
            loadSuppliers();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to create supplier.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error creating supplier:', error);
        }
    });
}

// Update existing supplier
function updateSupplier() {
    const supplierId = $('#supplierId').val();
    const submitBtn = $('#submitBtn');
    submitBtn.addClass('loading');
    
    const supplierData = {
        companyName: $('#companyName').val().trim(),
        contractorName: $('#contractorName').val().trim(),
        gender: $('#gender').val(),
        contractorNic: $('#contractorNic').val().trim(),
        contractorContact: $('#contractorContact').val().trim(),
        companyEmail: $('#companyEmail').val().trim(),
        supplierAddress: $('#supplierAddress').val().trim(),
        managerId: parseInt($('#managerId').val()) // Use the value from form (might be original manager)
    };
    
    console.log('Updating supplier with data:', supplierData);
    
    $.ajax({
        url: `${API_BASE_URL}/suppliers/${supplierId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(supplierData),
        success: function(response) {
            submitBtn.removeClass('loading');
            closeModal();
            showSuccess('Supplier updated successfully!');
            loadSuppliers();
        },
        error: function(xhr, status, error) {
            submitBtn.removeClass('loading');
            let errorMsg = 'Failed to update supplier.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error updating supplier:', error);
        }
    });
}

// Open delete confirmation modal
function openDeleteModal(supplierId, companyName) {
    deleteSupplierId = supplierId;
    $('#deleteSupplierName').text(companyName);
    $('#deleteModal').addClass('show');
}

// Close delete modal
function closeDeleteModal() {
    $('#deleteModal').removeClass('show');
    deleteSupplierId = null;
}

// Confirm delete
function confirmDelete() {
    if (!deleteSupplierId) return;
    
    const deleteBtn = $('#confirmDeleteBtn');
    deleteBtn.addClass('loading');
    
    $.ajax({
        url: `${API_BASE_URL}/suppliers/${deleteSupplierId}`,
        type: 'DELETE',
        success: function(response) {
            deleteBtn.removeClass('loading');
            closeDeleteModal();
            showSuccess('Supplier deleted successfully!');
            loadSuppliers();
        },
        error: function(xhr, status, error) {
            deleteBtn.removeClass('loading');
            let errorMsg = 'Failed to delete supplier.';
            
            if (xhr.responseText) {
                errorMsg = xhr.responseText;
            }
            
            showError(errorMsg);
            console.error('Error deleting supplier:', error);
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