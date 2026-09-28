-- ========================================================
-- Database Schema: jajanan_ibu_inem
-- Desktop Point of Sales (POS) "Jajanan Ibu Inem"
-- Compatible with MySQL 5.7+, 8.0+, MariaDB (XAMPP/Laragon)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `jajanan_ibu_inem` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `jajanan_ibu_inem`;

-- --------------------------------------------------------
-- HANYA UNTUK DATABASE DEVELOPMENT BARU. Jangan jalankan pada database produksi.
-- Produksi menggunakan migrasi berurutan di db/migration/ dan backup tervalidasi.
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
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'CASHIER', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
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
(1, 'admin', '$2a$10$3qQb5BpTKc9tV62IqvGFNuIeHChWU5QqJ9GVWRaF0YacClgQlBIcC', 'Ibu Inem (Owner)', 'SUPER_ADMIN', 1),
(2, 'kasir', '$2a$10$AJ0gij28QlRgZkzoWdILtOKh/yB14BCmljCm2DjLTh9aRqFKB8UJa', 'Siti Rahma (Kasir)', 'CASHIER', 1);

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

-- ========================================================
-- ADDITIVE EXTENSIONS: UMKM Digital Business, CRM & Service Commerce
-- ========================================================

-- Extend customers table
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `customer_code` VARCHAR(50) NULL;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `status` ENUM('PROSPECT', 'LEAD', 'ACTIVE', 'INACTIVE', 'VIP') NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `source` VARCHAR(50) NOT NULL DEFAULT 'WEBSITE';
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `company_name` VARCHAR(150) NULL;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `email` VARCHAR(150) NULL;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `city` VARCHAR(100) NULL DEFAULT 'Yogyakarta';
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `province` VARCHAR(100) NULL DEFAULT 'D.I. Yogyakarta';
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `postal_code` VARCHAR(20) NULL;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `notes` TEXT NULL;
ALTER TABLE `customers` ADD COLUMN IF NOT EXISTS `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Table: business_settings
CREATE TABLE IF NOT EXISTS `business_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `business_name` VARCHAR(150) NOT NULL DEFAULT 'UMKM Bu Inem',
  `tagline` VARCHAR(255) NULL DEFAULT 'Solusi Digital & Layanan UMKM Terpercaya',
  `description` TEXT NULL,
  `address` TEXT NULL,
  `phone` VARCHAR(30) NULL DEFAULT '0812-3456-7890',
  `whatsapp` VARCHAR(30) NULL DEFAULT '6281234567890',
  `email` VARCHAR(100) NULL DEFAULT 'halo@bu-inem.com',
  `customer_service_email` VARCHAR(100) NULL DEFAULT 'cs@bu-inem.com',
  `logo_url` VARCHAR(255) NULL,
  `website` VARCHAR(150) NULL DEFAULT 'https://bu-inem.com',
  `tax_rate` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'IDR',
  `receipt_footer` TEXT NULL,
  `social_media` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `business_settings` (`id`, `business_name`, `tagline`, `description`, `address`, `phone`, `whatsapp`, `email`, `customer_service_email`, `tax_rate`, `currency`, `receipt_footer`)
VALUES (1, 'UMKM Bu Inem', 'Solusi Digital & Layanan UMKM Terpercaya', 'Platform layanan digital, transformasi teknologi, dan pemberdayaan bisnis UMKM Indonesia.', 'Jl. Malioboro No. 45, D.I. Yogyakarta 55271', '0812-3456-7890', '6281234567890', 'halo@bu-inem.com', 'cs@bu-inem.com', 0.00, 'IDR', 'Terima kasih telah mempercayakan pertumbuhan bisnis Anda bersama UMKM Bu Inem.')
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- Table: leads
CREATE TABLE IF NOT EXISTS `leads` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(30) NULL,
  `source` VARCHAR(50) NOT NULL DEFAULT 'WEBSITE',
  `service_interest` VARCHAR(150) NULL,
  `estimated_value` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST') NOT NULL DEFAULT 'NEW',
  `assigned_to` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_lead_status` (`status`),
  INDEX `idx_lead_created` (`created_at`),
  INDEX `idx_lead_customer` (`customer_id`),
  CONSTRAINT `fk_lead_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: service_products
CREATE TABLE IF NOT EXISTS `service_products` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `short_description` VARCHAR(255) NULL,
  `full_description` TEXT NULL,
  `category_id` INT NULL,
  `base_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `discount_type` ENUM('PERCENTAGE', 'FIXED') NULL,
  `discount_value` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `final_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `duration` VARCHAR(50) NULL,
  `features` JSON NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `image_url` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_service_product_category` (`category_id`),
  INDEX `idx_service_product_active` (`active`, `featured`),
  CONSTRAINT `fk_service_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `service_products` (`id`, `slug`, `name`, `short_description`, `full_description`, `base_price`, `discount_type`, `discount_value`, `final_price`, `duration`, `features`, `active`, `featured`, `image_url`)
VALUES 
(1, 'website-company-profile', 'Website Company Profile UMKM', 'Website representatif profesional untuk memperkuat citra dan kredibilitas bisnis UMKM Anda.', 'Paket pembuatan website profil bisnis modern dengan desain responsif, optimasi SEO lokal, integrasi WhatsApp, formulir kontak, dan hosting cepat satu tahun.', 1500000.00, 'PERCENTAGE', 10.00, 1350000.00, '3-5 Hari Kerja', JSON_ARRAY('Desain Responsif Mobile & Desktop', 'Optimasi SEO On-Page', 'Integrasi Tombol WhatsApp Interaktif', 'Gratis Domain & Hosting 1 Tahun', 'Formulir Kontak Terhubung Email'), 1, 1, '/images/services/company-profile.webp'),
(2, 'website-toko-online-katalog', 'Website Katalog & Pemesanan Online', 'Solusi etalase digital interaktif tanpa ribet untuk menerima pesanan dan showcase produk 24/7.', 'Katalog digital dinamis dengan sistem pencarian instan, filter kategori, keranjang belanja, checkout cepat WhatsApp/Formulir, serta dashboard pengelolaan produk mandiri.', 2500000.00, 'FIXED', 300000.00, 2200000.00, '5-7 Hari Kerja', JSON_ARRAY('Katalog Produk Tanpa Batas', 'Sistem Pencarian & Filter Cepat', 'Checkout Keranjang WhatsApp Otomatis', 'Dashboard Manajemen Produk Mandiri', 'Panduan Pengelolaan Lengkap'), 1, 1, '/images/services/online-catalog.webp'),
(3, 'crm-customer-management-setup', 'Setup Sistem CRM & Pelanggan UMKM', 'Otomatisasi pencatatan prospek, follow-up pelanggan, dan riwayat transaksi bisnis Anda.', 'Implementasi sistem CRM terpusat untuk memantau siklus hidup pelanggan (Lead hingga Deal), mencatat riwayat transaksi, aktivasi retensi loyalitas, dan pelaporan penjualan periodik.', 3200000.00, NULL, 0.00, 3200000.00, '7-10 Hari Kerja', JSON_ARRAY('Pipeline Prospek / Kanban Visual', 'Database Pelanggan Terpusat (Customer 360)', 'Riwayat Aktivitas & Catatan Interaksi', 'Laporan Omset & Analitik Retensi', 'Pelatihan Staf Admin CRM'), 1, 1, '/images/services/crm-setup.webp'),
(4, 'integrasi-pembayaran-qris', 'Integrasi Pembayaran QRIS & Kasir Digital', 'Terima pembayaran digital instan dari seluruh e-wallet dan mobile banking nasional.', 'Setup gerbang pembayaran QRIS resmi/demo, pencatatan otomatis status transaksi berhasil, dan cetak bukti transaksi digital/thermal yang rapi.', 1200000.00, 'PERCENTAGE', 15.00, 1020000.00, '2-3 Hari Kerja', JSON_ARRAY('Pendaftaran QRIS Dinamis & Statis', 'Verifikasi Transaksi Real-time', 'Dukungan Struk Cetak Thermal 58mm', 'Pelaporan Rekonsiliasi Keuangan', 'Pendampingan Teknis'), 1, 0, '/images/services/qris-integration.webp'),
(5, 'pemeliharaan-maintenance-sistem', 'Layanan Pemeliharaan & Monitoring Sistem', 'Perlindungan berkala, update keamanan rutin, backup data, dan technical support prioritas.', 'Paket perawatan komprehensif bulanan untuk menjamin performa website, database, keamanan SSL, dan asistensi teknis cepat saat terjadi kendala operasional.', 750000.00, NULL, 0.00, 750000.00, '1 Bulan', JSON_ARRAY('Backup Database Otomatis Mingguan', 'Monitoring Server & Uptime 99.9%', 'Pembaruan Patch Keamanan Rutin', 'Dukungan Teknis Prioritas via WA', 'Laporan Kinerja Bulanan'), 1, 0, '/images/services/maintenance.webp'),
(6, 'pengembangan-aplikasi-kustom', 'Aplikasi Web Kustom & Database Sistem', 'Aplikasi bisnis dirancang spesifik sesuai alur kerja operasional unik UMKM Anda.', 'Pengembangan sistem web end-to-end yang disesuaikan dengan kebutuhan inventaris khusus, multi-cabang, otorisasi peran berjenjang, dan integrasi API pihak ketiga.', 5000000.00, 'PERCENTAGE', 5.00, 4750000.00, '14-21 Hari Kerja', JSON_ARRAY('Analisis Kebutuhan Bisnis Spesifik', 'Arsitektur Skalabel Java Spring + Next.js', 'Desain UI/UX Eksklusif & Intuitif', 'Database ACID Teruji Berperforma Tinggi', 'Garansi Bug Free 3 Bulan'), 1, 1, '/images/services/custom-app.webp')
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- Table: orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(64) NOT NULL UNIQUE,
  `customer_id` INT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(150) NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `status` ENUM('DRAFT', 'PENDING', 'WAITING_PAYMENT', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `payment_status` ENUM('UNPAID', 'PENDING', 'PAID', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'UNPAID',
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'CASH',
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_customer` (`customer_id`),
  INDEX `idx_orders_payment_status` (`payment_status`),
  INDEX `idx_orders_created` (`created_at`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `service_product_id` BIGINT UNSIGNED NULL,
  `product_name_snapshot` VARCHAR(150) NOT NULL,
  `unit_price_snapshot` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `quantity` INT NOT NULL DEFAULT 1,
  `discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `line_total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  INDEX `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_service` FOREIGN KEY (`service_product_id`) REFERENCES `service_products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: crm_activities
CREATE TABLE IF NOT EXISTS `crm_activities` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NULL,
  `lead_id` BIGINT UNSIGNED NULL,
  `order_id` BIGINT UNSIGNED NULL,
  `activity_type` VARCHAR(64) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `actor` VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  `metadata` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_crm_act_customer` (`customer_id`),
  INDEX `idx_crm_act_lead` (`lead_id`),
  INDEX `idx_crm_act_order` (`order_id`),
  INDEX `idx_crm_act_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: receipts
CREATE TABLE IF NOT EXISTS `receipts` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `receipt_number` VARCHAR(64) NOT NULL UNIQUE,
  `order_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `barcode_payload` VARCHAR(255) NOT NULL,
  `store_name` VARCHAR(150) NOT NULL,
  `store_address` TEXT NULL,
  `store_phone` VARCHAR(50) NULL,
  `customer_service_email` VARCHAR(100) NULL,
  `thank_you_message` TEXT NULL,
  `amount_due` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `amount_received` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `change_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `payment_method` VARCHAR(50) NOT NULL,
  `payment_reference` VARCHAR(100) NULL,
  `is_qris_dummy` TINYINT(1) NOT NULL DEFAULT 0,
  `printed_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_receipts_order` (`order_id`),
  CONSTRAINT `fk_receipts_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
