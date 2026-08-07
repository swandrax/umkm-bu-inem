package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.Product;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    public List<Product> getAll() {
        return search(null, 0, false, "Nama");
    }

    public List<Product> getAllActive() {
        return search(null, 0, true, "Nama");
    }

    public List<Product> search(String query, int categoryId, boolean onlyActive, String sortBy) {
        List<Product> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT p.*, c.name AS category_name, " +
            "(SELECT COALESCE(SUM(sd.quantity), 0) FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE sd.product_id = p.id AND s.status = 'PAID') AS sold_quantity, " +
            "(SELECT COALESCE(SUM(sd.subtotal), 0) FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE sd.product_id = p.id AND s.status = 'PAID') AS revenue " +
            "FROM products p " +
            "JOIN categories c ON p.category_id = c.id " +
            "WHERE 1=1 "
        );

        if (onlyActive) {
            sql.append("AND p.active = 1 ");
        }

        if (categoryId > 0) {
            sql.append("AND p.category_id = ? ");
        }

        if (query != null && !query.trim().isEmpty()) {
            sql.append("AND (p.name LIKE ? OR p.code LIKE ?) ");
        }

        if ("Harga".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY p.price ASC");
        } else if ("Stok".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY p.stock ASC");
        } else if ("Produk Terlaris".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY sold_quantity DESC");
        } else {
            sql.append("ORDER BY p.name ASC");
        }

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            int paramIndex = 1;
            if (categoryId > 0) {
                ps.setInt(paramIndex++, categoryId);
            }
            if (query != null && !query.trim().isEmpty()) {
                String searchPattern = "%" + query.trim() + "%";
                ps.setString(paramIndex++, searchPattern);
                ps.setString(paramIndex++, searchPattern);
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToProduct(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Product getById(int id) {
        String sql = "SELECT p.*, c.name AS category_name, " +
                     "(SELECT COALESCE(SUM(sd.quantity), 0) FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE sd.product_id = p.id AND s.status = 'PAID') AS sold_quantity, " +
                     "(SELECT COALESCE(SUM(sd.subtotal), 0) FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE sd.product_id = p.id AND s.status = 'PAID') AS revenue " +
                     "FROM products p " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE p.id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToProduct(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Product getByCode(String code) {
        String sql = "SELECT p.*, c.name AS category_name, " +
                     "(SELECT COALESCE(SUM(sd.quantity), 0) FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE sd.product_id = p.id AND s.status = 'PAID') AS sold_quantity, " +
                     "(SELECT COALESCE(SUM(sd.subtotal), 0) FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE sd.product_id = p.id AND s.status = 'PAID') AS revenue " +
                     "FROM products p " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE p.code = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, code);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToProduct(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean insert(Product product) {
        String sql = "INSERT INTO products (code, name, category_id, price, stock, active) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, product.getCode());
            ps.setString(2, product.getName());
            ps.setInt(3, product.getCategoryId());
            ps.setBigDecimal(4, product.getPrice());
            ps.setInt(5, product.getStock());
            ps.setBoolean(6, product.isActive());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        product.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean update(Product product) {
        String sql = "UPDATE products SET code = ?, name = ?, category_id = ?, price = ?, stock = ?, active = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, product.getCode());
            ps.setString(2, product.getName());
            ps.setInt(3, product.getCategoryId());
            ps.setBigDecimal(4, product.getPrice());
            ps.setInt(5, product.getStock());
            ps.setBoolean(6, product.isActive());
            ps.setInt(7, product.getId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean delete(int id) {
        // Soft delete (setting active = 0) to maintain transaction history integrity
        String sql = "UPDATE products SET active = 0 WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean hardDelete(int id) {
        String sql = "DELETE FROM products WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateStock(Connection conn, int productId, int quantityDeduction) throws SQLException {
        String sql = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantityDeduction);
            ps.setInt(2, productId);
            ps.setInt(3, quantityDeduction);
            return ps.executeUpdate() > 0;
        }
    }

    private Product mapResultSetToProduct(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setId(rs.getInt("id"));
        p.setCode(rs.getString("code"));
        p.setName(rs.getString("name"));
        p.setCategoryId(rs.getInt("category_id"));
        p.setCategoryName(rs.getString("category_name"));
        p.setPrice(rs.getBigDecimal("price"));
        p.setStock(rs.getInt("stock"));
        p.setActive(rs.getBoolean("active"));
        
        try {
            p.setSoldQuantity(rs.getInt("sold_quantity"));
            p.setRevenue(rs.getBigDecimal("revenue"));
        } catch (SQLException ignored) {
            // Might not be present in some basic queries
        }

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) p.setCreatedAt(createdAt.toLocalDateTime());

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) p.setUpdatedAt(updatedAt.toLocalDateTime());

        return p;
    }

    public List<Product> getLowStockProducts(int threshold) {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT p.*, c.name AS category_name FROM products p " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE p.active = 1 AND p.stock <= ? ORDER BY p.stock ASC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, threshold);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToProduct(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
