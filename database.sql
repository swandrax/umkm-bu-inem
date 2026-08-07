-- ========================================================
-- Database Schema: jajanan_ibu_inem
-- Desktop Point of Sales (POS) "Jajanan Ibu Inem"
-- Compatible with MySQL 5.7+, 8.0+, MariaDB (XAMPP/Laragon)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `jajanan_ibu_inem` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `jajanan_ibu_inem`;

-- --------------------------------------------------------
-- Drop Tables if exists in correct order
-- --------------------------------------------------------
DROP TABLE IF EXISTS `delivery_logs`;
DROP TABLE IF EXISTS `shipping`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `sale_details`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `package_benefits`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` ENUM('ADMIN', 'CASHIER') NOT NULL DEFAULT 'CASHIER',
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: categories
-- --------------------------------------------------------
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: products
-- --------------------------------------------------------
CREATE TABLE `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `category_id` INT NOT NULL,
    `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `stock` INT NOT NULL DEFAULT 0,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: customers
-- --------------------------------------------------------
CREATE TABLE `customers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `address` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: packages
-- --------------------------------------------------------
CREATE TABLE `packages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `description` TEXT DEFAULT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: package_benefits
-- --------------------------------------------------------
CREATE TABLE `package_benefits` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `package_id` INT NOT NULL,
    `benefit_detail` VARCHAR(255) NOT NULL,
    CONSTRAINT `fk_package_benefits_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: sales
-- --------------------------------------------------------
CREATE TABLE `sales` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `transaction_number` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` INT NOT NULL,
    `customer_id` INT DEFAULT NULL,
    `package_id` INT DEFAULT NULL,
    `transaction_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `tax` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `payment_method` VARCHAR(50) NOT NULL DEFAULT 'CASH',
    `cash_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `change_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `status` ENUM('PAID', 'CANCELLED') NOT NULL DEFAULT 'PAID',
    `order_status` ENUM('MENUNGGU', 'DIPROSES', 'SELESAI', 'BATAL') NOT NULL DEFAULT 'SELESAI',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sales_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_sales_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_sales_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: sale_details
-- --------------------------------------------------------
CREATE TABLE `sale_details` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sale_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `product_name` VARCHAR(150) NOT NULL,
    `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `quantity` INT NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT `fk_sale_details_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_sale_details_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: payments
-- --------------------------------------------------------
CREATE TABLE `payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sale_id` INT NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `reference_number` VARCHAR(100) DEFAULT NULL,
    `payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('SUCCESS', 'PENDING', 'FAILED') NOT NULL DEFAULT 'SUCCESS',
    CONSTRAINT `fk_payments_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: shipping
-- --------------------------------------------------------
CREATE TABLE `shipping` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sale_id` INT NOT NULL UNIQUE,
    `shipping_type` VARCHAR(50) NOT NULL, -- Ambil Sendiri, Diantar Kurir, GoSend, GrabExpress
    `shipping_status` VARCHAR(50) NOT NULL DEFAULT 'MENUNGGU', -- Menunggu, Diproses, Sedang Diantar, Selesai, Dibatalkan
    `customer_notes` TEXT DEFAULT NULL,
    `courier_notes` TEXT DEFAULT NULL,
    CONSTRAINT `fk_shipping_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: delivery_logs
-- --------------------------------------------------------
CREATE TABLE `delivery_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `shipping_id` INT NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `description` TEXT DEFAULT NULL,
    CONSTRAINT `fk_delivery_logs_shipping` FOREIGN KEY (`shipping_id`) REFERENCES `shipping` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- SEED DATA (DUMMY DATA INITIALIZATION)
-- ========================================================

-- Insert Users
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`, `active`) VALUES
(1, 'admin', 'admin123', 'Ibu Inem (Owner)', 'ADMIN', 1),
(2, 'kasir', 'kasir123', 'Siti Rahma (Kasir)', 'CASHIER', 1);

-- Insert Categories
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Makanan Basah', 'Kue basah tradisional khas Ibu Inem'),
(2, 'Gorengan', 'Aneka gorengan hangat dan renyah'),
(3, 'Minuman', 'Minuman segar dan hangat'),
(4, 'Snack Kering', 'Cemilan kering dan keripik');

-- Insert Products
INSERT INTO `products` (`code`, `name`, `category_id`, `price`, `stock`, `active`) VALUES
('PRD-001', 'Kue Lemper Ayam', 1, 3500.00, 50, 1),
('PRD-002', 'Risol Mayo Spesial', 1, 4000.00, 40, 1),
('PRD-003', 'Kue Pastel Telur', 1, 3500.00, 35, 1),
('PRD-004', 'Kue Dadar Gulung', 1, 3000.00, 45, 1),
('PRD-005', 'Kue Nagasari Pisang', 1, 3000.00, 30, 1),
('PRD-006', 'Bala-Bala / Bakwan', 2, 1500.00, 100, 1),
('PRD-007', 'Tahu Isi Pedas', 2, 2000.00, 80, 1),
('PRD-008', 'Tempe Mendoan', 2, 2000.00, 75, 1),
('PRD-009', 'Pisang Goreng Keju', 2, 2500.00, 60, 1),
('PRD-010', 'Es Teh Manis', 3, 4000.00, 150, 1),
('PRD-011', 'Es Jeruk Peras', 3, 5000.00, 100, 1),
('PRD-012', 'Kopi Hitam Mantap', 3, 4000.00, 90, 1),
('PRD-013', 'Keripik Singkong Pedas', 4, 1000.00, 50, 1),
('PRD-014', 'Peyek Kacang Renyah', 4, 12000.00, 30, 1);

-- Insert Customers
INSERT INTO `customers` (`id`, `name`, `phone`, `address`) VALUES
(1, 'Budi Santoso', '081234567890', 'Jl. Merdeka No. 10, Jakarta'),
(2, 'Siti Aminah', '081987654321', 'Perumahan Indah Blok B/5, Bandung'),
(3, 'Andi Wirawan', '081512341234', 'Komp. Harmoni No. 99, Surabaya');

-- Insert Packages
INSERT INTO `packages` (`id`, `name`, `price`, `description`, `active`) VALUES
(1, 'Paket Hemat', 15000.00, 'Cocok untuk sendirian', 1),
(2, 'Paket Reguler', 25000.00, 'Pilihan tepat harian', 1),
(3, 'Paket Keluarga', 50000.00, 'Untuk porsi besar sekeluarga', 1),
(4, 'Paket Kombo', 35000.00, 'Komplit dengan minuman', 1),
(5, 'Paket Spesial', 75000.00, 'Kualitas premium', 1);

-- Insert Package Benefits
INSERT INTO `package_benefits` (`id`, `package_id`, `benefit_detail`) VALUES
(1, 1, 'Gratis Sambal'),
(2, 2, 'Gratis Minuman'),
(3, 3, 'Gratis Minuman + Snack'),
(4, 4, 'Gratis Dessert'),
(5, 5, 'Bonus Merchandise');

-- Insert Sample Sales
INSERT INTO `sales` (`id`, `transaction_number`, `user_id`, `customer_id`, `package_id`, `transaction_date`, `subtotal`, `discount`, `tax`, `total`, `payment_method`, `cash_amount`, `change_amount`, `status`, `order_status`) VALUES
(1, 'TRX-20260807-0001', 2, 1, 3, CURRENT_TIMESTAMP, 50000.00, 0.00, 0.00, 50000.00, 'CASH', 50000.00, 0.00, 'PAID', 'SELESAI'),
(2, 'TRX-20260807-0002', 2, 2, 1, CURRENT_TIMESTAMP, 15000.00, 0.00, 0.00, 15000.00, 'QRIS', 15000.00, 0.00, 'PAID', 'DIPROSES'),
(3, 'TRX-20260807-0003', 2, 3, NULL, CURRENT_TIMESTAMP, 25000.00, 0.00, 0.00, 25000.00, 'GoPay', 25000.00, 0.00, 'PAID', 'SELESAI');

-- Insert Sample Sale Details
INSERT INTO `sale_details` (`sale_id`, `product_id`, `product_name`, `price`, `quantity`, `subtotal`) VALUES
(1, 1, 'Kue Lemper Ayam', 3500.00, 10, 35000.00),
(1, 10, 'Es Teh Manis', 4000.00, 3, 12000.00),
(1, 6, 'Bala-Bala / Bakwan', 1500.00, 2, 3000.00),
(2, 2, 'Risol Mayo Spesial', 4000.00, 2, 8000.00),
(2, 11, 'Es Jeruk Peras', 5000.00, 1, 5000.00),
(2, 13, 'Keripik Singkong Pedas', 1000.00, 2, 2000.00),
(3, 8, 'Tempe Mendoan', 2000.00, 10, 20000.00),
(3, 11, 'Es Jeruk Peras', 5000.00, 1, 5000.00);

-- Insert Sample Payments
INSERT INTO `payments` (`sale_id`, `payment_method`, `amount`, `reference_number`, `payment_date`, `status`) VALUES
(1, 'CASH', 50000.00, NULL, CURRENT_TIMESTAMP, 'SUCCESS'),
(2, 'QRIS', 15000.00, 'REF-QRIS-9921', CURRENT_TIMESTAMP, 'SUCCESS'),
(3, 'GoPay', 25000.00, 'REF-GOPAY-111', CURRENT_TIMESTAMP, 'SUCCESS');

-- Insert Sample Shipping
INSERT INTO `shipping` (`id`, `sale_id`, `shipping_type`, `shipping_status`, `customer_notes`, `courier_notes`) VALUES
(1, 1, 'Diantar Kurir', 'Selesai', 'Tolong jangan terlalu sore', 'Terkirim 12:00'),
(2, 2, 'GoSend', 'Sedang Diantar', 'Titip di satpam ya', 'Driver OTW'),
(3, 3, 'Ambil Sendiri', 'Selesai', NULL, NULL);

-- Insert Sample Delivery Logs
INSERT INTO `delivery_logs` (`id`, `shipping_id`, `status`, `timestamp`, `description`) VALUES
(1, 1, 'Menunggu', CURRENT_TIMESTAMP, 'Pesanan Diterima'),
(2, 1, 'Diproses', CURRENT_TIMESTAMP, 'Pesanan Sedang Disiapkan'),
(3, 1, 'Sedang Diantar', CURRENT_TIMESTAMP, 'Kurir Berangkat'),
(4, 1, 'Selesai', CURRENT_TIMESTAMP, 'Pesanan Selesai Diantar'),
(5, 2, 'Menunggu', CURRENT_TIMESTAMP, 'Mencari Driver GoSend'),
(6, 2, 'Diproses', CURRENT_TIMESTAMP, 'Driver Menuju Lokasi Pickup'),
(7, 2, 'Sedang Diantar', CURRENT_TIMESTAMP, 'Driver Mengantar Pesanan'),
(8, 3, 'Menunggu', CURRENT_TIMESTAMP, 'Menunggu Customer Ambil Pesanan'),
(9, 3, 'Selesai', CURRENT_TIMESTAMP, 'Customer Telah Mengambil Pesanan');
