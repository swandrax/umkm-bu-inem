-- V7: Add Orders and Order Items domain
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(64) NOT NULL UNIQUE,
  customer_id INT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NULL,
  customer_phone VARCHAR(30) NOT NULL,
  status ENUM('DRAFT', 'PENDING', 'WAITING_PAYMENT', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  payment_status ENUM('UNPAID', 'PENDING', 'PAID', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'UNPAID',
  payment_method VARCHAR(50) NOT NULL DEFAULT 'CASH',
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_status (status),
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_payment_status (payment_status),
  INDEX idx_orders_created (created_at),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  service_product_id BIGINT UNSIGNED NULL,
  product_name_snapshot VARCHAR(150) NOT NULL,
  unit_price_snapshot DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  quantity INT NOT NULL DEFAULT 1,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  line_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  INDEX idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_service FOREIGN KEY (service_product_id) REFERENCES service_products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
