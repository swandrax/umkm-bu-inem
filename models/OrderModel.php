<?php
// models/OrderModel.php

namespace Models;

use Config\Database;
use Exception;
use PDO;

class OrderModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getOrderByTransactionNumber(string $trxNum): ?array {
        $stmt = $this->db->prepare("
            SELECT s.*, c.name as customer_name, c.phone as customer_phone, 
                   sh.id as shipping_id, sh.shipping_type, sh.shipping_status, sh.customer_notes, sh.courier_notes
            FROM sales s
            LEFT JOIN customers c ON s.customer_id = c.id
            LEFT JOIN shipping sh ON sh.sale_id = s.id
            WHERE s.transaction_number = ?
        ");
        $stmt->execute([$trxNum]);
        $res = $stmt->fetch();
        return $res ?: null;
    }

    public function getOrderDetails(int $saleId): array {
        $stmt = $this->db->prepare("SELECT * FROM sale_details WHERE sale_id = ?");
        $stmt->execute([$saleId]);
        return $stmt->fetchAll();
    }

    public function getDeliveryLogs(int $shippingId): array {
        $stmt = $this->db->prepare("SELECT * FROM delivery_logs WHERE shipping_id = ? ORDER BY timestamp DESC");
        $stmt->execute([$shippingId]);
        return $stmt->fetchAll();
    }

    public function createOrder(int $customerId, array $items, string $shippingType, string $shippingAddress, string $courierNotes, string $paymentMethod): array {
        $this->db->beginTransaction();

        try {
            $trxNum = 'WEB-' . date('YmdHis') . rand(100, 999);
            $subtotal = 0;
            $validatedItems = [];

            $prodModel = new ProductModel();
            foreach ($items as $item) {
                $prod = $prodModel->getById((int)$item['id']);
                if ($prod) {
                    $qty = (int)$item['quantity'];
                    if ($qty > $prod['stock']) {
                        throw new Exception("Stok untuk " . $prod['name'] . " tidak mencukupi (Tersedia: " . $prod['stock'] . ")");
                    }
                    $itemSubtotal = $prod['price'] * $qty;
                    $subtotal += $itemSubtotal;
                    $validatedItems[] = [
                        'product_id' => $prod['id'],
                        'product_name' => $prod['name'],
                        'price' => $prod['price'],
                        'quantity' => $qty,
                        'subtotal' => $itemSubtotal
                    ];
                }
            }

            if (empty($validatedItems)) {
                throw new Exception("Item tidak ditemukan atau stok habis!");
            }

            // Insert Sale
            $saleStmt = $this->db->prepare("
                INSERT INTO sales (transaction_number, user_id, customer_id, package_id, subtotal, discount, tax, total, payment_method, cash_amount, change_amount, status, transaction_date)
                VALUES (?, 1, ?, NULL, ?, 0, 0, ?, ?, ?, 0, 'PAID', NOW())
            ");
            $saleStmt->execute([$trxNum, $customerId, $subtotal, $subtotal, $paymentMethod, $subtotal]);
            $saleId = (int)$this->db->lastInsertId();

            // Insert Sale Details & Deduct Stock
            $detailStmt = $this->db->prepare("
                INSERT INTO sale_details (sale_id, product_id, product_name, price, quantity, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stockStmt = $this->db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

            foreach ($validatedItems as $v) {
                $detailStmt->execute([$saleId, $v['product_id'], $v['product_name'], $v['price'], $v['quantity'], $v['subtotal']]);
                $stockStmt->execute([$v['quantity'], $v['product_id']]);
            }

            // Insert Shipping
            $shipStmt = $this->db->prepare("
                INSERT INTO shipping (sale_id, shipping_type, shipping_status, customer_notes, courier_notes)
                VALUES (?, ?, 'MENUNGGU', ?, ?)
            ");
            $shipStmt->execute([$saleId, $shippingType, $shippingAddress, $courierNotes]);

            $this->db->commit();

            return [
                'success' => true,
                'transaction_number' => $trxNum,
                'total' => $subtotal
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
