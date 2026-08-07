<?php
// index.php - Front Controller Router for PHP Web MVC

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/ProductModel.php';
require_once __DIR__ . '/models/CustomerModel.php';
require_once __DIR__ . '/models/OrderModel.php';
require_once __DIR__ . '/controllers/CatalogController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/AdminController.php';

use Controllers\CatalogController;
use Controllers\OrderController;
use Controllers\AdminController;

$route = $_GET['route'] ?? 'catalog';

switch ($route) {
    case 'catalog':
        $controller = new CatalogController();
        $controller->index();
        break;

    case 'api_catalog':
        $controller = new CatalogController();
        $controller->getCatalogApi();
        break;

    case 'checkout':
        $controller = new OrderController();
        $controller->checkout();
        break;

    case 'track':
        $controller = new OrderController();
        $controller->track();
        break;

    case 'receipt':
        $controller = new OrderController();
        $controller->receipt();
        break;

    // Web CRUD Admin Routes
    case 'admin':
        $controller = new AdminController();
        $controller->index();
        break;

    case 'save_product':
        $controller = new AdminController();
        $controller->saveProduct();
        break;

    case 'delete_product':
        $controller = new AdminController();
        $controller->deleteProduct();
        break;

    case 'save_customer':
        $controller = new AdminController();
        $controller->saveCustomer();
        break;

    case 'delete_customer':
        $controller = new AdminController();
        $controller->deleteCustomer();
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Route tidak ditemukan']);
        break;
}
