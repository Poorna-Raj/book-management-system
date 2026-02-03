INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('customer@bms.com', 'customer123', 'Steve Jobs', '0771234567', '1234567890', 'ABC Bank', 'CUSTOMER_MANAGER');
INSERT INTO tbl_customer_managers (user_id, customer_manager_id, working_hours, shift, on_duty)
VALUES (1, 'CM001', '9AM-5PM', 'FULL', TRUE);

INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('supplier@bms.com', 'supplier123', 'Tom Brady', '0775734587', '93748737890', 'BAC Bank', 'SUPPLIER_MANAGER');
INSERT INTO tbl_supplier_manager (user_id, supplier_manager_id, working_hours, shift, on_duty)
VALUES (2, 'SM001', '9AM-5PM', 'FULL', TRUE);

-- User
INSERT INTO tbl_users
(email, password, name, contact_number, bank_number, bank_name, role)
VALUES
('warehouse@bms.com', 'warehouse123', 'Elon Musk', '0712345678', '555666777', 'DEF Bank', 'WAREHOUSE_KEEPER');

-- Warehouse Keeper
INSERT INTO tbl_warehouse_keeper
(user_id, warehouse_staff_id, on_duty)
VALUES
(3, 'WK001', TRUE);

-- User
INSERT INTO tbl_users
(email, password, name, contact_number, bank_number, bank_name, role)
VALUES
('cashier@bms.com', 'cashier123', 'Ada Lovelace', '0759876543', '999888777', 'XYZ Bank', 'CASHIER');

-- Cashier
INSERT INTO tbl_cashier
(user_id, cashier_id, working_hours, shift, on_duty)
VALUES
(4, 'CASH001', '8AM-4PM', 'FULL', TRUE);

INSERT INTO tbl_inventory
(inventory_title, total_books, status, note)
VALUES
('Main Warehouse Inventory', 100, 'AVAILABLE', 'Primary storage inventory');
