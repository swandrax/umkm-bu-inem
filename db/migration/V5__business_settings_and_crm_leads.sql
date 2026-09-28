-- V5: Add Business Settings, CRM Leads, and non-destructive Customer extensions
-- Strictly additive: preserves all historical customers, sales, and users.

CREATE TABLE IF NOT EXISTS business_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_name VARCHAR(150) NOT NULL DEFAULT 'UMKM Bu Inem',
  tagline VARCHAR(255) NULL DEFAULT 'Solusi Digital & Layanan UMKM Terpercaya',
  description TEXT NULL,
  address TEXT NULL,
  phone VARCHAR(30) NULL DEFAULT '0812-3456-7890',
  whatsapp VARCHAR(30) NULL DEFAULT '6281234567890',
  email VARCHAR(100) NULL DEFAULT 'halo@bu-inem.com',
  customer_service_email VARCHAR(100) NULL DEFAULT 'cs@bu-inem.com',
  logo_url VARCHAR(255) NULL,
  website VARCHAR(150) NULL DEFAULT 'https://bu-inem.com',
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  receipt_footer TEXT NULL,
  social_media JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO business_settings (id, business_name, tagline, description, address, phone, whatsapp, email, customer_service_email, tax_rate, currency, receipt_footer)
VALUES (1, 'UMKM Bu Inem', 'Solusi Digital & Layanan UMKM Terpercaya', 'Platform layanan digital, transformasi teknologi, dan pemberdayaan bisnis UMKM Indonesia.', 'Jl. Malioboro No. 45, D.I. Yogyakarta 55271', '0812-3456-7890', '6281234567890', 'halo@bu-inem.com', 'cs@bu-inem.com', 0.00, 'IDR', 'Terima kasih telah mempercayakan pertumbuhan bisnis Anda bersama UMKM Bu Inem.')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Extend customers table non-destructively
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_code VARCHAR(50) NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS status ENUM('PROSPECT', 'LEAD', 'ACTIVE', 'INACTIVE', 'VIP') NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS source VARCHAR(50) NOT NULL DEFAULT 'WEBSITE';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name VARCHAR(150) NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email VARCHAR(150) NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL DEFAULT 'Yogyakarta';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS province VARCHAR(100) NULL DEFAULT 'D.I. Yogyakarta';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20) NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS notes TEXT NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- CRM Leads table
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  phone VARCHAR(30) NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'WEBSITE',
  service_interest VARCHAR(150) NULL,
  estimated_value DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST') NOT NULL DEFAULT 'NEW',
  assigned_to VARCHAR(100) NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lead_status (status),
  INDEX idx_lead_created (created_at),
  INDEX idx_lead_customer (customer_id),
  CONSTRAINT fk_lead_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
