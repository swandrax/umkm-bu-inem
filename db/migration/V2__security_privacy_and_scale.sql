-- Jalankan sekali setelah backup tervalidasi. Semua perubahan bersifat additive.
-- MySQL 8.0.13+ diperlukan untuk IF NOT EXISTS pada indeks.
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone_hash CHAR(64) NULL COMMENT 'SHA-256 normalisasi nomor; untuk deduplikasi tanpa membaca PII';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS consent_at DATETIME NULL COMMENT 'Persetujuan pencatatan data pelanggan';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL COMMENT 'Tombstone penghapusan sesuai permintaan subjek data';
ALTER TABLE sales ADD INDEX IF NOT EXISTS idx_sales_date_status (transaction_date, status);
ALTER TABLE sales ADD INDEX IF NOT EXISTS idx_sales_customer_date (customer_id, transaction_date);
ALTER TABLE sale_details ADD INDEX IF NOT EXISTS idx_sale_details_product (product_id);
ALTER TABLE payments ADD INDEX IF NOT EXISTS idx_payments_date_status (payment_date, status);
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id INT NULL,
  action VARCHAR(64) NOT NULL,
  resource_type VARCHAR(64) NOT NULL,
  resource_id VARCHAR(64) NULL,
  outcome ENUM('SUCCESS','DENIED','FAILURE') NOT NULL,
  request_id CHAR(36) NULL,
  ip_hash CHAR(64) NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_created (created_at),
  INDEX idx_audit_actor_created (actor_user_id, created_at),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
