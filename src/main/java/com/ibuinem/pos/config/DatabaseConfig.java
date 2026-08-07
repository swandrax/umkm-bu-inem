package com.ibuinem.pos.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Configuration class for managing MySQL Database Connection.
 * Connects to local MySQL (phpMyAdmin / Laragon / XAMPP).
 */
public class DatabaseConfig {

    private static final String DEFAULT_HOST = "localhost";
    private static final String DEFAULT_PORT = "3306";
    private static final String DEFAULT_DB_NAME = "jajanan_ibu_inem";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = ""; // Default Laragon/XAMPP password

    private static String dbHost = DEFAULT_HOST;
    private static String dbPort = DEFAULT_PORT;
    private static String dbName = DEFAULT_DB_NAME;
    private static String dbUser = DEFAULT_USER;
    private static String dbPassword = DEFAULT_PASSWORD;

    static {
        try {
            // Explicitly load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found: " + e.getMessage());
        }
    }

    public static Connection getConnection() throws SQLException {
        String url = String.format(
            "jdbc:mysql://%s:%s/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Jakarta&useUnicode=true&characterEncoding=UTF-8&autoReconnect=true",
            dbHost, dbPort, dbName
        );
        return DriverManager.getConnection(url, dbUser, dbPassword);
    }

    /**
     * Test database connectivity.
     * @return true if successfully connected, false otherwise.
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("Database connection failed: " + e.getMessage());
            return false;
        }
    }

    // Setters for dynamic connection settings if needed
    public static void setCredentials(String host, String port, String database, String user, String password) {
        dbHost = host;
        dbPort = port;
        dbName = database;
        dbUser = user;
        dbPassword = password;
    }
}
