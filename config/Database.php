<?php
// config/Database.php - PDO Singleton Database Connection

namespace Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    private function __construct() {}
    private function __clone() {}

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = '127.0.0.1';
            $port = '3306';
            $dbname = 'jajanan_ibu_inem';
            $username = 'root';
            $password = '';

            try {
                self::$instance = new PDO(
                    "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
                    $username,
                    $password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );
            } catch (PDOException $e) {
                die(json_encode(['error' => 'Koneksi Database Gagal: ' . $e->getMessage()]));
            }
        }
        return self::$instance;
    }
}
