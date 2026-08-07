<?php
// controllers/OrderController.php

namespace Controllers;

use Models\CustomerModel;
use Models\OrderModel;

class OrderController {
    private CustomerModel $customerModel;
    private OrderModel $orderModel;

    public function __construct() {
        $this->customerModel = new CustomerModel();
        $this->orderModel = new OrderModel();
    }

    public function track(): void {
        $trx = trim($_GET['trx'] ?? '');
        $order = null;
        $logs = [];

        if (!empty($trx)) {
            $order = $this->orderModel->getOrderByTransactionNumber($trx);
            if ($order && isset($order['shipping_id'])) {
                $logs = $this->orderModel->getDeliveryLogs((int)$order['shipping_id']);
            }
        }

        require_once __DIR__ . '/../views/layout/header.php';
        require_once __DIR__ . '/../views/track.php';
        require_once __DIR__ . '/../views/layout/footer.php';
    }

    public function receipt(): void {
        $trx = trim($_GET['trx'] ?? '');
        $order = $this->orderModel->getOrderByTransactionNumber($trx);
        
        if (!$order) {
            die('Struk tidak ditemukan!');
        }

        $details = $this->orderModel->getOrderDetails((int)$order['id']);
        require_once __DIR__ . '/../views/receipt.php';
    }

    public function checkout(): void {
        header('Content-Type: application/json');

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['items'])) {
            echo json_encode(['success' => false, 'message' => 'Keranjang belanja kosong!']);
            exit;
        }

        $customerName = trim($input['customer_name'] ?? 'Customer Web');
        $customerPhone = trim($input['customer_phone'] ?? '');
        $shippingType = trim($input['shipping_type'] ?? 'TAKEAWAY');
        $shippingAddress = trim($input['shipping_address'] ?? '');
        $courierNotes = trim($input['courier_notes'] ?? '');
        $paymentMethod = trim($input['payment_method'] ?? 'QRIS');

        $customerId = $this->customerModel->findOrCreate($customerName, $customerPhone, $shippingAddress);
        $result = $this->orderModel->createOrder(
            $customerId,
            $input['items'],
            $shippingType,
            $shippingAddress,
            $courierNotes,
            $paymentMethod
        );

        echo json_encode($result);
        exit;
    }
}
