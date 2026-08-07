<?php
// controllers/AdminController.php - Web Admin Panel Controller

namespace Controllers;

use Models\ProductModel;
use Models\CustomerModel;
use Models\OrderModel;

class AdminController {
    private ProductModel $productModel;
    private CustomerModel $customerModel;

    public function __construct() {
        $this->productModel = new ProductModel();
        $this->customerModel = new CustomerModel();
    }

    public function index(): void {
        $products = $this->productModel->getAllProducts();
        $categories = $this->productModel->getAllCategories();
        $customers = $this->customerModel->getAll();

        require_once __DIR__ . '/../views/layout/header.php';
        require_once __DIR__ . '/../views/admin.php';
        require_once __DIR__ . '/../views/layout/footer.php';
    }

    public function saveProduct(): void {
        header('Content-Type: application/json');
        $id = (int)($_POST['id'] ?? 0);
        $data = [
            'code' => trim($_POST['code'] ?? ''),
            'name' => trim($_POST['name'] ?? ''),
            'category_id' => (int)($_POST['category_id'] ?? 1),
            'price' => (float)($_POST['price'] ?? 0),
            'stock' => (int)($_POST['stock'] ?? 0),
            'active' => isset($_POST['active']) ? 1 : 0
        ];

        if (empty($data['code']) || empty($data['name'])) {
            echo json_encode(['success' => false, 'message' => 'Kode dan Nama produk wajib diisi!']);
            exit;
        }

        if ($id > 0) {
            $ok = $this->productModel->updateProduct($id, $data);
        } else {
            $ok = $this->productModel->createProduct($data);
        }

        echo json_encode(['success' => $ok, 'message' => $ok ? 'Produk berhasil disimpan!' : 'Gagal menyimpan produk!']);
        exit;
    }

    public function deleteProduct(): void {
        header('Content-Type: application/json');
        $id = (int)($_GET['id'] ?? 0);
        $ok = $this->productModel->deleteProduct($id);
        echo json_encode(['success' => $ok, 'message' => $ok ? 'Produk dihapus!' : 'Gagal menghapus produk!']);
        exit;
    }

    public function saveCustomer(): void {
        header('Content-Type: application/json');
        $id = (int)($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address'] ?? '');

        if (empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Nama customer wajib diisi!']);
            exit;
        }

        if ($id > 0) {
            $ok = $this->customerModel->update($id, $name, $phone, $address);
        } else {
            $ok = $this->customerModel->create($name, $phone, $address);
        }

        echo json_encode(['success' => $ok, 'message' => $ok ? 'Customer disimpan!' : 'Gagal menyimpan customer!']);
        exit;
    }

    public function deleteCustomer(): void {
        header('Content-Type: application/json');
        $id = (int)($_GET['id'] ?? 0);
        $ok = $this->customerModel->delete($id);
        echo json_encode(['success' => $ok, 'message' => $ok ? 'Customer dihapus!' : 'Gagal menghapus customer!']);
        exit;
    }
}
