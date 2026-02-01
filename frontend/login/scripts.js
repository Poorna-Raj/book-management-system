$(document).ready(function() {
    // API base URL - Update this to match your backend URL
    const API_BASE_URL = 'http://localhost:8080'; // Change port if needed
    
    // Check if user is already logged in
    if (localStorage.getItem('userId')) {
        // User is already logged in, redirect to dashboard
        window.location.href = '/dashboard.html'; // Update with your dashboard page
    }
    
    // Password toggle functionality
    $('#togglePassword').on('click', function() {
        const passwordInput = $('#password');
        const icon = $(this).find('i');
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Form submission
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        // Hide error message
        $('#errorMessage').removeClass('show');
        
        // Get form values
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const remember = $('#remember').is(':checked');
        
        // Basic validation
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }
        
        // Show loading state
        const loginBtn = $('#loginBtn');
        loginBtn.addClass('loading');
        
        // Prepare login request data
        const loginData = {
            email: email,
            password: password
        };
        
        // Make AJAX request to backend
        $.ajax({
            url: `${API_BASE_URL}/users/login`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function(response) {
                // Remove loading state
                loginBtn.removeClass('loading');
                console.log(response);
                
                // Store user data in localStorage
                if (response.userId) {
                    localStorage.setItem('userId', response.userId);
                }
                if (response.name) {
                    localStorage.setItem('userName', response.name);
                }
                if (response.role) {
                    localStorage.setItem('userRole', response.role);
                }
                if (response.email) {
                    localStorage.setItem('userEmail', response.email);
                }
                
                // Store remember me preference
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }
                
                // Show success message
                showSuccess('Login successful! Redirecting...');
                
                // Redirect to dashboard after short delay
                setTimeout(function() {
                    switch(response.role){
                        case "CUSTOMER_MANAGER":
                            window.location.href = '../customer/customer.html';
                            break;
                        case "SUPPLIER_MANAGER":
                            window.location.href = '../supplier/supplier.html';
                            break;
                        default:
                            console.log("Invalid Role");
                            break;
                    }
                }, 1000);
            },
            error: function(xhr, status, error) {
                // Remove loading state
                loginBtn.removeClass('loading');
                
                // Handle different error responses
                let errorMessage = 'An error occurred. Please try again.';
                
                if (xhr.status === 401) {
                    errorMessage = 'Invalid email or password';
                } else if (xhr.status === 400) {
                    errorMessage = 'Please enter valid credentials';
                } else if (xhr.status === 0) {
                    errorMessage = 'Cannot connect to server. Please check your connection.';
                } else if (xhr.responseText) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        errorMessage = response.message || xhr.responseText;
                    } catch (e) {
                        errorMessage = xhr.responseText;
                    }
                }
                
                showError(errorMessage);
                console.error('Login error:', error);
            }
        });
    });

    // Function to show error message
    function showError(message) {
        $('#errorText').text(message);
        $('#errorMessage').addClass('show');
    }
    
    // Function to show success message
    function showSuccess(message) {
        // Create success message if it doesn't exist
        if ($('#successMessage').length === 0) {
            const successHtml = `
                <div class="success-message" id="successMessage">
                    <i class="fas fa-check-circle"></i>
                    <span id="successText">${message}</span>
                </div>
            `;
            $('#loginForm').prepend(successHtml);
        } else {
            $('#successText').text(message);
            $('#successMessage').addClass('show');
        }
    }

    // Clear error message when user starts typing
    $('#email, #password').on('input', function() {
        $('#errorMessage').removeClass('show');
    });

    // Add focus effects
    $('.form-input').on('focus', function() {
        $(this).closest('.input-wrapper').addClass('focused');
    }).on('blur', function() {
        $(this).closest('.input-wrapper').removeClass('focused');
    });
    
    // Pre-fill email if remember me was checked
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            $('#email').val(savedEmail);
            $('#remember').prop('checked', true);
        }
    }
});