-- ==========================================================
-- mhumsap.sql — Final Mhumsap Database Schema
-- Database: webd
--
-- Active tables: administrators, admin_login, login_logs,
--                categories, products, members, team_members
-- ==========================================================

CREATE DATABASE mhumsap_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mhumsap_db;
-- ==========================================================
-- ADMIN TABLES
-- ==========================================================
CREATE TABLE administrators (
    admin_id   INT          PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    address    TEXT,
    age        INT,
    email      VARCHAR(150) UNIQUE,
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_login (
    login_id      INT          PRIMARY KEY AUTO_INCREMENT,
    admin_id      INT          UNIQUE,
    username      VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  DEFAULT 'admin',
    last_login    DATETIME,
    FOREIGN KEY (admin_id)
        REFERENCES administrators(admin_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ==========================================================
-- CATEGORIES
-- ==========================================================
CREATE TABLE categories (
    category_id   INT          PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description   TEXT
);

-- Default categories (must match the form dropdowns)
INSERT INTO categories (category_name, description) VALUES
('Japanese', 'Japanese cuisine — ramen, sushi, gyudon, etc.'),
('Thai',     'Thai cuisine — pad thai, som tam, tom yum, etc.'),
('Italian',  'Italian cuisine — pasta, pizza, risotto, etc.'),
('Chinese',  'Chinese cuisine — dim sum, stir-fry, noodles, etc.'),
('Dessert',  'Sweet treats — cakes, ice cream, sticky rice, etc.'),
('Other',    'Everything else');

-- ==========================================================
-- PRODUCTS
-- NOTE: uses product_id and product_name (original schema).
--       The Node.js backend aliases these as id/name in the
--       API response so the frontend requires no changes.
-- ==========================================================
CREATE TABLE products (
    product_id   INT            PRIMARY KEY AUTO_INCREMENT,
    category_id  INT,
    product_name VARCHAR(200)   NOT NULL,
    description  TEXT,
    price        DECIMAL(10,2)  NOT NULL,
    stock        INT            DEFAULT 0,
    rating       DECIMAL(2,1)   DEFAULT NULL,
    image_url    VARCHAR(255)   DEFAULT NULL,
    created_at   DATETIME       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

INSERT INTO products (product_name, price, category_id, stock, rating, image_url, description)
SELECT 'Gyudon', 99.00, category_id, 20, 4.8,
    'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop',
    'A premium Wagyu beef rice bowl — thinly sliced Wagyu stir-fried in savory soy sauce, served over warm Japanese rice.'
FROM categories WHERE category_name = 'Japanese'
UNION ALL
SELECT 'Pad Thai', 75.00, category_id, 30, 4.5,
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop',
    'Classic Thai stir-fried rice noodles with shrimp, tofu, egg, bean sprouts, and peanuts in a tangy tamarind sauce.'
FROM categories WHERE category_name = 'Thai'
UNION ALL
SELECT 'Spaghetti Carbonara', 149.00, category_id, 15, 4.7,
    'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop',
    'Authentic Roman pasta: eggs, Pecorino Romano, guanciale, and freshly cracked black pepper. No cream — just perfection.'
FROM categories WHERE category_name = 'Italian'
UNION ALL
SELECT 'Mango Sticky Rice', 55.00, category_id, 25, 4.9,
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop',
    'Sweet glutinous rice topped with ripe Thai mango and drizzled with rich coconut cream.'
FROM categories WHERE category_name = 'Dessert'
UNION ALL
SELECT 'Dim Sum Platter', 120.00, category_id, 10, 4.6,
    'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=800&auto=format&fit=crop',
    'Assorted steamed dumplings — har gow, siu mai, and char siu bao — served in bamboo baskets with dipping sauce.'
FROM categories WHERE category_name = 'Chinese';


USE mhumsap_db;

DELETE FROM administrators WHERE email = 'papayapk@mhumsap.com';

INSERT INTO administrators (first_name, last_name, email) 
VALUES ('papaya', 'pokpok', 'papayapk@mhumsap.com');

INSERT INTO admin_login (admin_id, username, password_hash, role) 
VALUES (
    (SELECT admin_id FROM administrators WHERE email = 'papayapk@mhumsap.com'), 
    'papaya', 
    '1234', 
    'admin'
);
DROP TABLE IF EXISTS login_logs;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS team_members;