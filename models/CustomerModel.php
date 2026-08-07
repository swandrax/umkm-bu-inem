<?php
// models/CustomerModel.php - Full CRUD for Customers

namespace Models;

use Config\Database;
use PDO;

class CustomerModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT id, name, phone, address, created_at FROM customers ORDER BY id DESC");
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT id, name, phone, address, created_at FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        $res = $stmt->fetch();
        return $res ?: null;
    }

    public function findOrCreate(string $name, string $phone, string $address): int {
        if (!empty($phone)) {
            $stmt = $this->db->prepare("SELECT id FROM customers WHERE phone = ?");
            $stmt->execute([$phone]);
            $existing = $stmt->fetch();
            if ($existing) {
                return (int)$existing['id'];
            }
        }

        $ins = $this->db->prepare("INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)");
        $ins->execute([$name, $phone, $address]);
        return (int)$this->db->lastInsertId();
    }

    public function create(string $name, string $phone, string $address): bool {
        $stmt = $this->db->prepare("INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)");
        return $stmt->execute([$name, $phone, $address]);
    }

    public function update(int $id, string $name, string $phone, string $address): bool {
        $stmt = $this->db->prepare("UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?");
        return $stmt->execute([$name, $phone, $address, $id]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM customers WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
