-- Payment provider state dipisah dari payments agar satu sale dapat retry tanpa kehilangan bukti percobaan.
CREATE TABLE IF NOT EXISTS payment_attempts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  provider ENUM('XENDIT') NOT NULL,
  provider_payment_request_id VARCHAR(100) NULL,
  merchant_reference_id VARCHAR(100) NOT NULL,
  channel_code VARCHAR(64) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'IDR',
  status ENUM('PENDING','SUCCEEDED','FAILED','EXPIRED','CANCELED') NOT NULL DEFAULT 'PENDING',
  expires_at DATETIME NULL,
  provider_payload JSON NULL COMMENT 'minimised response, never credentials or customer card data',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_payment_attempt_provider_request (provider, provider_payment_request_id),
  UNIQUE KEY uk_payment_attempt_reference (merchant_reference_id),
  KEY idx_payment_attempt_sale_status (sale_id, status),
  CONSTRAINT fk_payment_attempt_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Menjadikan retry callback aman: satu webhook-id hanya boleh diproses sekali.
CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider ENUM('XENDIT') NOT NULL,
  webhook_id VARCHAR(128) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  provider_payment_request_id VARCHAR(100) NULL,
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME NULL,
  outcome ENUM('RECEIVED','PROCESSED','DUPLICATE','REJECTED','FAILED') NOT NULL DEFAULT 'RECEIVED',
  payload_sha256 CHAR(64) NOT NULL,
  UNIQUE KEY uk_webhook_provider_id (provider, webhook_id),
  KEY idx_webhook_provider_request (provider, provider_payment_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
