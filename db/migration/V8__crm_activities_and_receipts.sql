-- V8: Add unified CRM Activities and digital Receipts
CREATE TABLE IF NOT EXISTS crm_activities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  lead_id BIGINT UNSIGNED NULL,
  order_id BIGINT UNSIGNED NULL,
  activity_type VARCHAR(64) NOT NULL, -- LEAD_CREATED, CUSTOMER_CONTACTED, ORDER_CREATED, PAYMENT_INITIATED, PAYMENT_CONFIRMED, RECEIPT_PRINTED, NOTE_CREATED, STATUS_CHANGED
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  actor VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_crm_act_customer (customer_id),
  INDEX idx_crm_act_lead (lead_id),
  INDEX idx_crm_act_order (order_id),
  INDEX idx_crm_act_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS receipts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  receipt_number VARCHAR(64) NOT NULL UNIQUE,
  order_id BIGINT UNSIGNED NOT NULL UNIQUE,
  barcode_payload VARCHAR(255) NOT NULL,
  store_name VARCHAR(150) NOT NULL,
  store_address TEXT NULL,
  store_phone VARCHAR(50) NULL,
  customer_service_email VARCHAR(100) NULL,
  thank_you_message TEXT NULL,
  amount_due DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  amount_received DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  change_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  payment_method VARCHAR(50) NOT NULL,
  payment_reference VARCHAR(100) NULL,
  is_qris_dummy TINYINT(1) NOT NULL DEFAULT 0,
  printed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_receipts_order (order_id),
  CONSTRAINT fk_receipts_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
