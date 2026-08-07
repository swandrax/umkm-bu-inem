package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.Shipping;

import java.sql.*;

public class ShippingDAO {

    public boolean insert(Shipping shipping, Connection conn) throws SQLException {
        String sql = "INSERT INTO shipping (sale_id, shipping_type, shipping_status, customer_notes, courier_notes) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setInt(1, shipping.getSaleId());
            pstmt.setString(2, shipping.getShippingType());
            pstmt.setString(3, shipping.getShippingStatus());
            pstmt.setString(4, shipping.getCustomerNotes());
            pstmt.setString(5, shipping.getCourierNotes());
            int affected = pstmt.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        shipping.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        }
        return false;
    }

    public boolean updateStatus(int shippingId, String newStatus, String logDescription) {
        String updateSql = "UPDATE shipping SET shipping_status = ? WHERE id = ?";
        String logSql = "INSERT INTO delivery_logs (shipping_id, status, description) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(updateSql);
                 PreparedStatement logStmt = conn.prepareStatement(logSql)) {
                
                pstmt.setString(1, newStatus);
                pstmt.setInt(2, shippingId);
                pstmt.executeUpdate();

                logStmt.setInt(1, shippingId);
                logStmt.setString(2, newStatus);
                logStmt.setString(3, logDescription);
                logStmt.executeUpdate();

                conn.commit();
                return true;
            } catch (SQLException e) {
                conn.rollback();
                e.printStackTrace();
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public java.util.List<Shipping> getAllShipping() {
        java.util.List<Shipping> list = new java.util.ArrayList<>();
        String sql = "SELECT s.* FROM shipping s ORDER BY s.id DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Shipping sh = new Shipping();
                sh.setId(rs.getInt("id"));
                sh.setSaleId(rs.getInt("sale_id"));
                sh.setShippingType(rs.getString("shipping_type"));
                sh.setShippingStatus(rs.getString("shipping_status"));
                sh.setCustomerNotes(rs.getString("customer_notes"));
                sh.setCourierNotes(rs.getString("courier_notes"));
                list.add(sh);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public java.util.List<com.ibuinem.pos.model.DeliveryLog> getDeliveryLogs(int shippingId) {
        java.util.List<com.ibuinem.pos.model.DeliveryLog> logs = new java.util.ArrayList<>();
        String sql = "SELECT * FROM delivery_logs WHERE shipping_id = ? ORDER BY timestamp DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, shippingId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    com.ibuinem.pos.model.DeliveryLog log = new com.ibuinem.pos.model.DeliveryLog();
                    log.setId(rs.getInt("id"));
                    log.setShippingId(rs.getInt("shipping_id"));
                    log.setStatus(rs.getString("status"));
                    Timestamp ts = rs.getTimestamp("timestamp");
                    if (ts != null) log.setTimestamp(ts.toLocalDateTime());
                    log.setDescription(rs.getString("description"));
                    logs.add(log);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return logs;
    }
}
