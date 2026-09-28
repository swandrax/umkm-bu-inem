package com.ibuinem.pos.dao;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.ServiceProduct;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ServiceProductDAO {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<ServiceProduct> getAll(Boolean onlyActive, Integer categoryId) {
        List<ServiceProduct> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT sp.*, c.name as category_name FROM service_products sp LEFT JOIN categories c ON sp.category_id = c.id WHERE 1=1 ");
        if (Boolean.TRUE.equals(onlyActive)) {
            sql.append("AND sp.active = 1 ");
        }
        if (categoryId != null && categoryId > 0) {
            sql.append("AND sp.category_id = ? ");
        }
        sql.append("ORDER BY sp.featured DESC, sp.id ASC");

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            if (categoryId != null && categoryId > 0) {
                pstmt.setInt(1, categoryId);
            }
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSet(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Notice: service_products read fallback: " + e.getMessage());
        }
        return list;
    }

    public ServiceProduct getById(long id) {
        String sql = "SELECT sp.*, c.name as category_name FROM service_products sp LEFT JOIN categories c ON sp.category_id = c.id WHERE sp.id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSet(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public ServiceProduct getBySlug(String slug) {
        String sql = "SELECT sp.*, c.name as category_name FROM service_products sp LEFT JOIN categories c ON sp.category_id = c.id WHERE sp.slug = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, slug);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSet(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean insert(ServiceProduct sp) {
        String sql = "INSERT INTO service_products (slug, name, short_description, full_description, category_id, base_price, discount_type, discount_value, final_price, duration, features, active, featured, image_url) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            setStatementParams(pstmt, sp);
            int affected = pstmt.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        sp.setId(rs.getLong(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean update(ServiceProduct sp) {
        String sql = "UPDATE service_products SET slug = ?, name = ?, short_description = ?, full_description = ?, category_id = ?, base_price = ?, discount_type = ?, discount_value = ?, final_price = ?, duration = ?, features = ?, active = ?, featured = ?, image_url = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            setStatementParams(pstmt, sp);
            pstmt.setLong(15, sp.getId());
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean delete(long id) {
        String sql = "DELETE FROM service_products WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private void setStatementParams(PreparedStatement pstmt, ServiceProduct sp) throws SQLException {
        pstmt.setString(1, sp.getSlug());
        pstmt.setString(2, sp.getName());
        pstmt.setString(3, sp.getShortDescription());
        pstmt.setString(4, sp.getFullDescription());
        if (sp.getCategoryId() != null && sp.getCategoryId() > 0) {
            pstmt.setInt(5, sp.getCategoryId());
        } else {
            pstmt.setNull(5, Types.INTEGER);
        }
        pstmt.setBigDecimal(6, sp.getBasePrice());
        pstmt.setString(7, sp.getDiscountType());
        pstmt.setBigDecimal(8, sp.getDiscountValue());
        pstmt.setBigDecimal(9, sp.getFinalPrice());
        pstmt.setString(10, sp.getDuration());

        String jsonFeatures = "[]";
        try {
            if (sp.getFeatures() != null) {
                jsonFeatures = objectMapper.writeValueAsString(sp.getFeatures());
            }
        } catch (Exception ignored) {}
        pstmt.setString(11, jsonFeatures);

        pstmt.setBoolean(12, sp.isActive());
        pstmt.setBoolean(13, sp.isFeatured());
        pstmt.setString(14, sp.getImageUrl());
    }

    private ServiceProduct mapResultSet(ResultSet rs) throws SQLException {
        ServiceProduct sp = new ServiceProduct();
        sp.setId(rs.getLong("id"));
        sp.setSlug(rs.getString("slug"));
        sp.setName(rs.getString("name"));
        sp.setShortDescription(rs.getString("short_description"));
        sp.setFullDescription(rs.getString("full_description"));
        int catId = rs.getInt("category_id");
        if (!rs.wasNull()) {
            sp.setCategoryId(catId);
        }
        sp.setCategoryName(rs.getString("category_name"));
        sp.setBasePrice(rs.getBigDecimal("base_price"));
        sp.setDiscountType(rs.getString("discount_type"));
        sp.setDiscountValue(rs.getBigDecimal("discount_value"));
        sp.setFinalPrice(rs.getBigDecimal("final_price"));
        sp.setDuration(rs.getString("duration"));

        String rawFeatures = rs.getString("features");
        if (rawFeatures != null && !rawFeatures.isBlank()) {
            try {
                List<String> list = objectMapper.readValue(rawFeatures, new TypeReference<List<String>>() {});
                sp.setFeatures(list);
            } catch (Exception e) {
                sp.setFeatures(new ArrayList<>());
            }
        }

        sp.setActive(rs.getBoolean("active"));
        sp.setFeatured(rs.getBoolean("featured"));
        sp.setImageUrl(rs.getString("image_url"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) sp.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) sp.setUpdatedAt(ua.toLocalDateTime());

        return sp;
    }
}
