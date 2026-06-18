-- Create database (optional)
CREATE DATABASE ecommerce_db;
USE ecommerce_db;

-- ========================
-- USERS
-- ========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- CATEGORIES
-- ========================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ========================
-- PRODUCTS
-- ========================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    FOREIGN KEY (category_id)
        REFERENCES categories(id)
);

-- ========================
-- ORDERS
-- ========================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- ========================
-- ORDER ITEMS
-- ========================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)
        REFERENCES orders(id),
    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- ========================
-- INSERT USERS
-- ========================
INSERT INTO users (first_name, last_name, email) VALUES
('John', 'Doe', 'john@example.com'),
('Jane', 'Smith', 'jane@example.com'),
('Michael', 'Brown', 'michael@example.com'),
('Emily', 'Davis', 'emily@example.com'),
('Robert', 'Wilson', 'robert@example.com');

-- ========================
-- INSERT CATEGORIES
-- ========================
INSERT INTO categories (name) VALUES
('Electronics'),
('Books'),
('Clothing'),
('Home Appliances');

-- ========================
-- INSERT PRODUCTS
-- ========================
INSERT INTO products (category_id, name, price, stock) VALUES
(1, 'Laptop', 1200.00, 15),
(1, 'Smartphone', 800.00, 30),
(1, 'Headphones', 150.00, 50),
(2, 'SQL Fundamentals', 39.99, 100),
(2, 'Python Programming', 45.50, 80),
(3, 'T-Shirt', 19.99, 200),
(3, 'Jeans', 49.99, 120),
(4, 'Microwave Oven', 250.00, 20),
(4, 'Coffee Maker', 85.00, 40);

-- ========================
-- INSERT ORDERS
-- ========================
INSERT INTO orders (user_id, order_date, status) VALUES
(1, '2026-06-01', 'Completed'),
(2, '2026-06-02', 'Pending'),
(1, '2026-06-03', 'Completed'),
(3, '2026-06-05', 'Shipped'),
(4, '2026-06-07', 'Completed'),
(5, '2026-06-10', 'Pending');

-- ========================
-- INSERT ORDER ITEMS
-- ========================
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1200.00),
(1, 3, 2, 150.00),

(2, 2, 1, 800.00),

(3, 4, 1, 39.99),
(3, 5, 1, 45.50),

(4, 7, 2, 49.99),
(4, 6, 3, 19.99),

(5, 8, 1, 250.00),
(5, 9, 1, 85.00),

(6, 2, 1, 800.00),
(6, 3, 1, 150.00);

-- ========================
-- EXAMPLE JOINS
-- ========================

-- Orders with customer names
SELECT
    o.id,
    CONCAT(u.first_name, ' ', u.last_name) AS customer,
    o.order_date,
    o.status
FROM orders o
JOIN users u ON o.user_id = u.id;

-- Products with category names
SELECT
    p.name AS product,
    c.name AS category,
    p.price
FROM products p
JOIN categories c ON p.category_id = c.id;

-- Order details
SELECT
    o.id AS order_id,
    CONCAT(u.first_name, ' ', u.last_name) AS customer,
    p.name AS product,
    oi.quantity,
    oi.unit_price
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN users u ON o.user_id = u.id
JOIN products p ON oi.product_id = p.id;