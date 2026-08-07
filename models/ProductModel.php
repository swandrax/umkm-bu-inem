<?php
// models/ProductModel.php - Full CRUD for Products & Categories

namespace Models;

use Config\Database;
use PDO;

class ProductModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAllActiveProducts(): array {
        $stmt = $this->db->query("
            SELECT p.id, p.code, p.name, p.category_id, c.name as category_name, p.price, p.stock, p.active 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.active = 1 
            ORDER BY p.name ASC
        ");
        return $stmt->fetchAll();
    }

    public function getAllProducts(): array {
        $stmt = $this->db->query("
            SELECT p.id, p.code, p.name, p.category_id, c.name as category_name, p.price, p.stock, p.active 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.id DESC
        ");
        return $stmt->fetchAll();
    }

    public function getAllCategories(): array {
        $stmt = $this->db->query("SELECT id, name, description FROM categories ORDER BY name ASC");
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT id, code, name, category_id, price, stock, active FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    // CRUD Methods
    public function createProduct(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO products (code, name, category_id, price, stock, active)
            VALUES (?, ?, ?, ?, ?, 1)
        ");
        return $stmt->execute([
            $data['code'],
            $data['name'],
            $data['category_id'],
            $data['price'],
            $data['stock']
        ]);
    }

    public function updateProduct(int $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE products 
            SET code = ?, name = ?, category_id = ?, price = ?, stock = ?, active = ?
            WHERE id = ?
        ");
        return $stmt->execute([
            $data['code'],
            $data['name'],
            $data['category_id'],
            $data['price'],
            $data['stock'],
            $data['active'] ?? 1,
            $id
        ]);
    }

    public function deleteProduct(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function createCategory(string $name, string $desc): bool {
        $stmt = $this->db->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
        return $stmt->execute([$name, $desc]);
    }

    public function deleteCategory(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM categories WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
