INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('customer@example.com', 'customer123', 'Steve Jobs', '0771234567', '1234567890', 'ABC Bank', 'CUSTOMER_MANAGER');
INSERT INTO tbl_customer_managers (user_id, customer_manager_id, working_hours, shift, on_duty)
VALUES (1, 'CM001', '9AM-5PM', 'FULL', TRUE);

INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('supplier@example.com', 'supplier123', 'Tom Brady', '0775734587', '93748737890', 'BAC Bank', 'SUPPLIER_MANAGER');
INSERT INTO tbl_supplier_manager (user_id, supplier_manager_id, working_hours, shift, on_duty)
VALUES (2, 'SM001', '9AM-5PM', 'FULL', TRUE);