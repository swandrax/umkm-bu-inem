<?php
/**
 * @deprecated This legacy PHP endpoint has been modernized and migrated to the Java 21 Spring Boot REST API
 * (/api/v1/products, /api/v1/categories, /api/v1/sales, /api/v1/customers).
 * Preserved for backwards compatibility.
 */
header('X-API-Deprecated: true; modern-endpoint="/api/v1/*"');
header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

if ($action === 'get_catalog') {
    // Get Categories
    $catStmt = $pdo->query("SELECT id, name FROM categories ORDER BY name ASC");
    $categories = $catStmt->fetchAll();

    // Get Active Products
    $prodStmt = $pdo->query("
        SELECT p.id, p.code, p.name, p.category_id, c.name as category_name, p.price, p.stock 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.active = 1 
        ORDER BY p.name ASC
    ");
    $products = $prodStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'categories' => $categories,
        'products' => $products
    ]);
    exit;
}

if ($action === 'checkout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
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
    $items = $input['items'];

    try {
        $pdo->beginTransaction();

        // 1. Find or Create Customer
        $customerId = null;
        if (!empty($customerPhone)) {
            $custStmt = $pdo->prepare("SELECT id FROM customers WHERE phone = ?");
            $custStmt->execute([$customerPhone]);
            $existingCust = $custStmt->fetch();
            if ($existingCust) {
                $customerId = $existingCust['id'];
            } else {
                $insCust = $pdo->prepare("INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)");
                $insCust->execute([$customerName, $customerPhone, $shippingAddress]);
                $customerId = $pdo->lastInsertId();
            }
        }

        // 2. Generate Transaction Number TRX-WEB-timestamp
        $trxNum = 'WEB-' . date('YmdHis') . rand(100, 999);

        // 3. Calculate Subtotal
        $subtotal = 0;
        $validatedItems = [];
        foreach ($items as $item) {
            $pStmt = $pdo->prepare("SELECT id, name, price, stock FROM products WHERE id = ? AND active = 1");
            $pStmt->execute([$item['id']]);
            $prod = $pStmt->fetch();
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

        // 4. Insert Sale
        $saleStmt = $pdo->prepare("
            INSERT INTO sales (transaction_number, user_id, customer_id, package_id, subtotal, discount, tax, total, payment_method, cash_amount, change_amount, status, transaction_date)
            VALUES (?, 1, ?, NULL, ?, 0, 0, ?, ?, ?, 0, 'PAID', NOW())
        ");
        $saleStmt->execute([$trxNum, $customerId, $subtotal, $subtotal, $paymentMethod, $subtotal]);
        $saleId = $pdo->lastInsertId();

        // 5. Insert Sale Details & Deduct Stock
        $detailStmt = $pdo->prepare("
            INSERT INTO sale_details (sale_id, product_id, product_name, price, quantity, subtotal)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

        foreach ($validatedItems as $v) {
            $detailStmt->execute([$saleId, $v['product_id'], $v['product_name'], $v['price'], $v['quantity'], $v['subtotal']]);
            $stockStmt->execute([$v['quantity'], $v['product_id']]);
        }

        // 6. Insert Shipping
        $shipStmt = $pdo->prepare("
            INSERT INTO shipping (sale_id, shipping_type, shipping_status, customer_notes, courier_notes)
            VALUES (?, ?, 'MENUNGGU', ?, ?)
        ");
        $shipStmt->execute([$saleId, $shippingType, $shippingAddress, $courierNotes]);

        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Pesanan berhasil dikirim ke Kasir!',
            'transaction_number' => $trxNum,
            'total' => $subtotal
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
