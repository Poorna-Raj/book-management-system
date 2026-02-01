INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('manager@example.com', 'SecurePassword123', 'John Doe', '0771234567', '1234567890', 'ABC Bank', 'CUSTOMER_MANAGER');
INSERT INTO tbl_customer_managers (user_id, customer_manager_id, working_hours, shift, on_duty)
VALUES (1, 'CM001', '9AM-5PM', 'FULL', TRUE);
