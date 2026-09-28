package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.CrmActivity;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CrmActivityDAO {

    public List<CrmActivity> getRecentActivities(int limit) {
        List<CrmActivity> list = new ArrayList<>();
        String sql = "SELECT * FROM crm_activities ORDER BY id DESC LIMIT ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, limit > 0 ? limit : 20);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSet(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Notice: crm_activities read fallback: " + e.getMessage());
        }
        return list;
    }

    public List<CrmActivity> getByCustomerId(int customerId) {
        List<CrmActivity> list = new ArrayList<>();
        String sql = "SELECT * FROM crm_activities WHERE customer_id = ? ORDER BY id DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, customerId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSet(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean insert(CrmActivity act) {
        String sql = "INSERT INTO crm_activities (customer_id, lead_id, order_id, activity_type, title, description, actor, metadata) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            if (act.getCustomerId() != null && act.getCustomerId() > 0) {
                pstmt.setInt(1, act.getCustomerId());
            } else {
                pstmt.setNull(1, Types.INTEGER);
            }
            if (act.getLeadId() != null && act.getLeadId() > 0) {
                pstmt.setLong(2, act.getLeadId());
            } else {
                pstmt.setNull(2, Types.BIGINT);
            }
            if (act.getOrderId() != null && act.getOrderId() > 0) {
                pstmt.setLong(3, act.getOrderId());
            } else {
                pstmt.setNull(3, Types.BIGINT);
            }
            pstmt.setString(4, act.getActivityType());
            pstmt.setString(5, act.getTitle());
            pstmt.setString(6, act.getDescription());
            pstmt.setString(7, act.getActor());
            pstmt.setString(8, act.getMetadata());

            int affected = pstmt.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        act.setId(rs.getLong(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private CrmActivity mapResultSet(ResultSet rs) throws SQLException {
        CrmActivity a = new CrmActivity();
        a.setId(rs.getLong("id"));
        int cId = rs.getInt("customer_id");
        if (!rs.wasNull()) a.setCustomerId(cId);
        long lId = rs.getLong("lead_id");
        if (!rs.wasNull()) a.setLeadId(lId);
        long oId = rs.getLong("order_id");
        if (!rs.wasNull()) a.setOrderId(oId);
        a.setActivityType(rs.getString("activity_type"));
        a.setTitle(rs.getString("title"));
        a.setDescription(rs.getString("description"));
        a.setActor(rs.getString("actor"));
        a.setMetadata(rs.getString("metadata"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) a.setCreatedAt(ca.toLocalDateTime());
        return a;
    }
}
