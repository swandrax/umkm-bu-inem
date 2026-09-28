package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.Lead;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LeadDAO {

    public List<Lead> getAll(String status, String search) {
        List<Lead> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM leads WHERE 1=1 ");
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            sql.append("AND status = ? ");
        }
        if (search != null && !search.isBlank()) {
            sql.append("AND (name LIKE ? OR email LIKE ? OR phone LIKE ?) ");
        }
        sql.append("ORDER BY id DESC");

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            int idx = 1;
            if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
                pstmt.setString(idx++, status);
            }
            if (search != null && !search.isBlank()) {
                String q = "%" + search.trim() + "%";
                pstmt.setString(idx++, q);
                pstmt.setString(idx++, q);
                pstmt.setString(idx++, q);
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSet(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Notice: leads read fallback: " + e.getMessage());
        }
        return list;
    }

    public Lead getById(long id) {
        String sql = "SELECT * FROM leads WHERE id = ?";
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

    public boolean insert(Lead lead) {
        String sql = "INSERT INTO leads (customer_id, name, email, phone, source, service_interest, estimated_value, status, assigned_to, notes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            if (lead.getCustomerId() != null && lead.getCustomerId() > 0) {
                pstmt.setInt(1, lead.getCustomerId());
            } else {
                pstmt.setNull(1, Types.INTEGER);
            }
            pstmt.setString(2, lead.getName());
            pstmt.setString(3, lead.getEmail());
            pstmt.setString(4, lead.getPhone());
            pstmt.setString(5, lead.getSource() != null ? lead.getSource() : "WEBSITE");
            pstmt.setString(6, lead.getServiceInterest());
            pstmt.setBigDecimal(7, lead.getEstimatedValue());
            pstmt.setString(8, lead.getStatus() != null ? lead.getStatus() : "NEW");
            pstmt.setString(9, lead.getAssignedTo());
            pstmt.setString(10, lead.getNotes());

            int affected = pstmt.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        lead.setId(rs.getLong(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean update(Lead lead) {
        String sql = "UPDATE leads SET customer_id = ?, name = ?, email = ?, phone = ?, source = ?, service_interest = ?, estimated_value = ?, status = ?, assigned_to = ?, notes = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            if (lead.getCustomerId() != null && lead.getCustomerId() > 0) {
                pstmt.setInt(1, lead.getCustomerId());
            } else {
                pstmt.setNull(1, Types.INTEGER);
            }
            pstmt.setString(2, lead.getName());
            pstmt.setString(3, lead.getEmail());
            pstmt.setString(4, lead.getPhone());
            pstmt.setString(5, lead.getSource());
            pstmt.setString(6, lead.getServiceInterest());
            pstmt.setBigDecimal(7, lead.getEstimatedValue());
            pstmt.setString(8, lead.getStatus());
            pstmt.setString(9, lead.getAssignedTo());
            pstmt.setString(10, lead.getNotes());
            pstmt.setLong(11, lead.getId());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateStatus(long id, String newStatus) {
        String sql = "UPDATE leads SET status = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, newStatus);
            pstmt.setLong(2, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean delete(long id) {
        String sql = "DELETE FROM leads WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private Lead mapResultSet(ResultSet rs) throws SQLException {
        Lead l = new Lead();
        l.setId(rs.getLong("id"));
        int custId = rs.getInt("customer_id");
        if (!rs.wasNull()) {
            l.setCustomerId(custId);
        }
        l.setName(rs.getString("name"));
        l.setEmail(rs.getString("email"));
        l.setPhone(rs.getString("phone"));
        l.setSource(rs.getString("source"));
        l.setServiceInterest(rs.getString("service_interest"));
        l.setEstimatedValue(rs.getBigDecimal("estimated_value"));
        l.setStatus(rs.getString("status"));
        l.setAssignedTo(rs.getString("assigned_to"));
        l.setNotes(rs.getString("notes"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) l.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) l.setUpdatedAt(ua.toLocalDateTime());

        return l;
    }
}
