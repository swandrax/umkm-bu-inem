<?php
// controllers/CatalogController.php

namespace Controllers;

use Models\ProductModel;

class CatalogController {
    private ProductModel $productModel;

    public function __construct() {
        $this->productModel = new ProductModel();
    }

    public function index(): void {
        $categories = $this->productModel->getAllCategories();
        $products = $this->productModel->getAllActiveProducts();
        
        require_once __DIR__ . '/../views/layout/header.php';
        require_once __DIR__ . '/../views/catalog.php';
        require_once __DIR__ . '/../views/layout/footer.php';
    }

    public function getCatalogApi(): void {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'categories' => $this->productModel->getAllCategories(),
            'products' => $this->productModel->getAllActiveProducts()
        ]);
        exit;
    }
}
