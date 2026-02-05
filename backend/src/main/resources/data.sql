INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('customer@bms.com', 'customer123', 'Steve Jobs', '0771234567', '1234567890', 'ABC Bank', 'CUSTOMER_MANAGER');
INSERT INTO tbl_customer_managers (user_id, customer_manager_id, working_hours, shift, on_duty)
VALUES (1, 'CM001', '9AM-5PM', 'FULL', TRUE);

INSERT INTO tbl_customers (customer_name, age, address, nic, contact_number, email, gender, manager_id)
VALUES
('Pawan Raj',21,'colombo','145265879','0714578968','pawan@gmail.com','MALE',1),
('Anjali Perera', 28, 'Kandy', '199685412V', '0771234567', 'anjali@example.com', 'FEMALE', 1),
('Kasun Silva', 34, 'Galle', '891234567V', '0719876543', 'kasun.s@webmail.com', 'MALE', 1),
('Dilini Fernando', 24, 'Negombo', '2000548791', '0755566778', 'dilini.f@gmail.com', 'FEMALE', 1),
('Sahan Rajapaksa', 40, 'Matara', '831597532V', '0761122334', 'sahan.r@outlook.com', 'MALE', 1),
('Ishara Madu', 31, 'Jaffna', '199265478X', '0704455667', 'ishara.m@icloud.com', 'MALE', 1);

INSERT INTO tbl_users (email, password, name, contact_number, bank_number, bank_name, role)
VALUES ('supplier@bms.com', 'supplier123', 'Tom Brady', '0775734587', '93748737890', 'BAC Bank', 'SUPPLIER_MANAGER');
INSERT INTO tbl_supplier_manager (user_id, supplier_manager_id, note, shift, age)
VALUES (2, 'SM001', 'Online', 'FULL', 36);

INSERT INTO tbl_suppliers (company_name, contractor_name, supplier_address, contractor_nic, contractor_contact, company_email, gender, manager_id)
VALUES
('Global Prints Ltd', 'Saman Kumara', 'Kandy Road, Dalugama', '198512345678', '0112345678', 'info@globalprints.com', 'MALE', 2),
('Oceanic Paper Co', 'Nirmala Devi', 'Main St, Jaffna', '199056781234', '0219876543', 'contact@oceanic.lk', 'FEMALE', 2),
('Everest Binding', 'Rohan Perera', 'Galle Road, Colombo 03', '781234567V', '0773344556', 'rohan@everestbinding.com', 'MALE', 2),
('Green Leaf Publishers', 'Priya Silva', 'Highlevel Rd, Nugegoda', '199587456321', '0115566778', 'priya@greenleaf.lk', 'FEMALE', 2),
('Elite Stationery', 'Arshad Ahmed', 'Peradeniya Rd, Kandy', '884561230V', '0714455667', 'admin@elitestat.com', 'MALE', 2);

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

INSERT INTO tbl_inventory (inventory_title, total_books, status, note)
VALUES
('Fiction Central', 150, 'AVAILABLE', 'Main fiction collection'),
('Academic Science', 200, 'AVAILABLE', 'Textbooks and journals'),
('Archive - 2025', 50, 'AVAILABLE', 'Rare and old editions'),
('Children’s Corner', 120, 'AVAILABLE', 'Illustrated books'),
('Reference Wing', 80, 'AVAILABLE', 'Dictionaries and encyclopedias');

INSERT INTO tbl_book (book_name, issue, pages, volume, status, type, isbn, stock, price, supplier_id, inventory_id, warehouse_keeper_id)
VALUES
('The Silent Peak', 1, 350, 1, 'AVAILABLE', 'BIOGRAPHY', '978-3-16-148410-0', 20, 1500.00, 1, 1, 3),
('Quantum Basics', 3, 520, 2, 'AVAILABLE', 'HISTORY', '978-0-12-345678-9', 15, 2500.00, 3, 2, 3),
('History of Ceylon', 1, 410, 1, 'AVAILABLE', 'FICTION', '978-1-56-789012-3', 5, 3200.00, 2, 3, 3),
('Little Adventures', 2, 45, 1, 'AVAILABLE', 'NON_FICTION', '978-9-87-654321-0', 50, 800.00, 4, 4, 3),
('Java Mastery', 5, 800, 1, 'AVAILABLE', 'SCIENCE', '978-4-32-109876-5', 10, 4500.00, 5, 2, 3),
('Skyward Bounds', 1, 290, 1, 'AVAILABLE', 'CHILDREN', '978-6-54-321098-7', 2, 1200.00, 1, 1, 3),
('Global Atlas', 12, 150, 3, 'AVAILABLE', 'BIOGRAPHY', '978-7-89-012345-6', 8, 5500.00, 5, 5, 3),
('Chemistry Vol II', 2, 400, 2, 'AVAILABLE', 'EDUCATIONAL', '978-8-90-123456-7', 25, 1800.00, 3, 2, 3),
('The Lost Tale', 1, 210, 1, 'AVAILABLE', 'REFERENCE', '978-2-10-987654-3', 0, 950.00, 2, 1, 3),
('Data Structures', 4, 600, 1, 'AVAILABLE', 'REFERENCE', '978-5-43-210987-6', 12, 3800.00, 5, 2, 3);
