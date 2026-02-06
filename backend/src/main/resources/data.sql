-- ======================================
-- USERS
-- ======================================

-- CUSTOMER MANAGER USER
INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('customer@bms.com', 'customer123', 'Steve Jobs', '0771234567', '1234567890', 'ABC Bank', 'CUSTOMER_MANAGER');
SET @customer_user_id = LAST_INSERT_ID();

-- CUSTOMER MANAGER DETAILS
INSERT INTO tbl_customer_managers (user_id, customer_manager_id, working_hours, shift, on_duty)
VALUES (@customer_user_id, 'CM001', '9AM-5PM', 'FULL', TRUE);

-- CUSTOMERS
INSERT INTO tbl_customers (customer_name, age, address, nic, contact_number, email, gender, manager_id)
VALUES
('Pawan Raj', 21, 'Colombo', '145265879', '0714578968', 'pawan@gmail.com', 'MALE', @customer_user_id),
('Anjali Perera', 28, 'Kandy', '199685412V', '0771234567', 'anjali@example.com', 'FEMALE', @customer_user_id),
('Kasun Silva', 34, 'Galle', '891234567V', '0719876543', 'kasun.s@webmail.com', 'MALE', @customer_user_id),
('Dilini Fernando', 24, 'Negombo', '2000548791', '0755566778', 'dilini.f@gmail.com', 'FEMALE', @customer_user_id),
('Sahan Rajapaksa', 40, 'Matara', '831597532V', '0761122334', 'sahan.r@outlook.com', 'MALE', @customer_user_id),
('Ishara Madu', 31, 'Jaffna', '199265478X', '0704455667', 'ishara.m@icloud.com', 'MALE', @customer_user_id);

-- SUPPLIER MANAGER USER
INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('supplier@bms.com', 'supplier123', 'Tom Brady', '0775734587', '93748737890', 'BAC Bank', 'SUPPLIER_MANAGER');
SET @supplier_user_id = LAST_INSERT_ID();

-- SUPPLIER MANAGER DETAILS
INSERT INTO tbl_supplier_manager (user_id, supplier_manager_id, note, shift, age)
VALUES (@supplier_user_id, 'SM001', 'Online', 'FULL', 36);

-- SUPPLIERS
INSERT INTO tbl_suppliers (company_name, contractor_name, supplier_address, contractor_nic, contractor_contact, company_email, gender, manager_id)
VALUES
('Global Prints Ltd', 'Saman Kumara', 'Kandy Road, Dalugama', '198512345678', '0112345678', 'info@globalprints.com', 'MALE', @supplier_user_id),
('Oceanic Paper Co', 'Nirmala Devi', 'Main St, Jaffna', '199056781234', '0219876543', 'contact@oceanic.lk', 'FEMALE', @supplier_user_id),
('Everest Binding', 'Rohan Perera', 'Galle Road, Colombo 03', '781234567V', '0773344556', 'rohan@everestbinding.com', 'MALE', @supplier_user_id),
('Green Leaf Publishers', 'Priya Silva', 'Highlevel Rd, Nugegoda', '199587456321', '0115566778', 'priya@greenleaf.lk', 'FEMALE', @supplier_user_id),
('Elite Stationery', 'Arshad Ahmed', 'Peradeniya Rd, Kandy', '884561230V', '0714455667', 'admin@elitestat.com', 'MALE', @supplier_user_id);

-- ======================================
-- WAREHOUSE
-- ======================================

-- 1️⃣ WAREHOUSE MANAGER USER (Base User)
INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('warehouse@bms.com', 'warehouse123', 'Elon Musk', '0712345678', '555666777', 'DEF Bank', 'WAREHOUSE_MANAGER');
SET @warehouse_manager_user_id = LAST_INSERT_ID();

-- 2️⃣ WAREHOUSE MANAGER AS KEEPER (WarehouseKeeper table - parent of WarehouseManager)
INSERT INTO tbl_warehouse_keeper (user_id, warehouse_staff_id, on_duty, manager_id)
VALUES (@warehouse_manager_user_id, 'WM001', TRUE, NULL);

-- 3️⃣ WAREHOUSE MANAGER DETAILS (WarehouseManager table - extends WarehouseKeeper)
INSERT INTO tbl_warehouse_manager (user_id, shift)
VALUES (@warehouse_manager_user_id, 'FULL');

-- 4️⃣ WAREHOUSE KEEPER USER (Base User)
INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('keeper@bms.com', 'keeper123', 'Alice Keeper', '0719876543', '111222333', 'DEF Bank', 'WAREHOUSE_KEEPER');
SET @warehouse_keeper_user_id = LAST_INSERT_ID();

-- 5️⃣ WAREHOUSE KEEPER DETAILS (Reports to Warehouse Manager)
INSERT INTO tbl_warehouse_keeper (user_id, warehouse_staff_id, on_duty, manager_id)
VALUES (@warehouse_keeper_user_id, 'WK001', TRUE, @warehouse_manager_user_id);

-- ======================================
-- CASHIER
-- ======================================
INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('cashier@bms.com', 'cashier123', 'Ada Lovelace', '0759876543', '999888777', 'XYZ Bank', 'CASHIER');
SET @cashier_user_id = LAST_INSERT_ID();

INSERT INTO tbl_cashier (user_id, cashier_id, working_hours, shift, on_duty)
VALUES (@cashier_user_id, 'CASH001', '8AM-4PM', 'FULL', TRUE);

-- ======================================
-- INVENTORY
-- ======================================
INSERT INTO tbl_inventory (inventory_title, status, note)
VALUES
('Fiction Central','AVAILABLE', 'Main fiction collection'),
('Academic Science', 'AVAILABLE', 'Textbooks and journals'),
('Archive - 2025', 'AVAILABLE', 'Rare and old editions'),
('Children''s Corner', 'AVAILABLE', 'Illustrated books'),
('Reference Wing', 'AVAILABLE', 'Dictionaries and encyclopedias');

-- ======================================
-- BOOKS
-- ======================================
INSERT INTO tbl_book (book_name, issue, pages, volume, status, type, isbn, stock, price, supplier_id, inventory_id, warehouse_manager_id)
VALUES
('The Silent Peak', 1, 350, 1, 'AVAILABLE', 'BIOGRAPHY', '978-3-16-148410-0', 20, 1500.00, 1, 1, @warehouse_manager_user_id),
('Quantum Basics', 3, 520, 2, 'AVAILABLE', 'HISTORY', '978-0-12-345678-9', 15, 2500.00, 3, 2, @warehouse_manager_user_id),
('History of Ceylon', 1, 410, 1, 'AVAILABLE', 'FICTION', '978-1-56-789012-3', 5, 3200.00, 2, 3, @warehouse_manager_user_id),
('Little Adventures', 2, 45, 1, 'AVAILABLE', 'NON_FICTION', '978-9-87-654321-0', 50, 800.00, 4, 4, @warehouse_manager_user_id),
('Java Mastery', 5, 800, 1, 'AVAILABLE', 'SCIENCE', '978-4-32-109876-5', 10, 4500.00, 5, 2, @warehouse_manager_user_id),
('Skyward Bounds', 1, 290, 1, 'AVAILABLE', 'CHILDREN', '978-6-54-321098-7', 2, 1200.00, 1, 1, @warehouse_manager_user_id),
('Global Atlas', 12, 150, 3, 'AVAILABLE', 'BIOGRAPHY', '978-7-89-012345-6', 8, 5500.00, 5, 5, @warehouse_manager_user_id),
('Chemistry Vol II', 2, 400, 2, 'AVAILABLE', 'EDUCATIONAL', '978-8-90-123456-7', 25, 1800.00, 3, 2, @warehouse_manager_user_id),
('The Lost Tale', 1, 210, 1, 'AVAILABLE', 'REFERENCE', '978-2-10-987654-3', 0, 950.00, 2, 1, @warehouse_manager_user_id),
('Data Structures', 4, 600, 1, 'AVAILABLE', 'REFERENCE', '978-5-43-210987-6', 12, 3800.00, 5, 2, @warehouse_manager_user_id);