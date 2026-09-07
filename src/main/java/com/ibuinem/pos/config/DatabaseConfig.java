package com.ibuinem.pos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceUtils;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Configuration class for managing MySQL Database Connection.
 * Supports Spring-managed DataSource and transaction management,
 * while preserving standalone desktop fallback.
 */
@Configuration
public class DatabaseConfig {

    private static final String DEFAULT_HOST = System.getenv("DB_HOST") != null ? System.getenv("DB_HOST") : "localhost";
    private static final String DEFAULT_PORT = System.getenv("DB_PORT") != null ? System.getenv("DB_PORT") : "3306";
    private static final String DEFAULT_DB_NAME = System.getenv("DB_NAME") != null ? System.getenv("DB_NAME") : "jajanan_ibu_inem";
    private static final String DEFAULT_USER = System.getenv("DB_USERNAME") != null ? System.getenv("DB_USERNAME") : "root";
    private static final String DEFAULT_PASSWORD = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "";

    private static String dbHost = DEFAULT_HOST;
    private static String dbPort = DEFAULT_PORT;
    private static String dbName = DEFAULT_DB_NAME;
    private static String dbUser = DEFAULT_USER;
    private static String dbPassword = DEFAULT_PASSWORD;

    private static DataSource springDataSource;

    public DatabaseConfig(DataSource dataSource) {
        DatabaseConfig.springDataSource = dataSource;
    }

    public DatabaseConfig() {
    }

    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException ignored) {}
        }
    }

    public static Connection getConnection() throws SQLException {
        if (springDataSource != null) {
            return DataSourceUtils.getConnection(springDataSource);
        }
        String dbUrl = System.getenv("DB_URL");
        if (dbUrl != null && !dbUrl.isEmpty()) {
            return DriverManager.getConnection(dbUrl, dbUser, dbPassword);
        }
        String url = String.format(
            "jdbc:postgresql://%s:%s/%s?sslmode=require",
            dbHost, dbPort, dbName
        );
        return DriverManager.getConnection(url, dbUser, dbPassword);
    }

    public static DataSource getDataSource() {
        return springDataSource;
    }

    public static void setDataSource(DataSource dataSource) {
        springDataSource = dataSource;
    }

    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("Database connection failed: " + e.getMessage());
            return false;
        }
    }

    public static void setCredentials(String host, String port, String database, String user, String password) {
        dbHost = host;
        dbPort = port;
        dbName = database;
        dbUser = user;
        dbPassword = password;
    }
}
