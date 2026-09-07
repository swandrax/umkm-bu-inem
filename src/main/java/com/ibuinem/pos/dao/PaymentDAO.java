package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.Payment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PaymentDAO {

    public boolean insert(Connection conn, Payment payment) throws SQLException {
        String sql = "INSERT INTO payments (sale_id, payment_method, amount, reference_number, status) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, payment.getSaleId());
            ps.setString(2, payment.getPaymentMethod());
            ps.setBigDecimal(3, payment.getAmount());
            ps.setString(4, payment.getReferenceNumber());
            ps.setString(5, payment.getStatus().name());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        payment.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        }
        return false;
    }

    public List<Payment> getAll() {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT * FROM payments ORDER BY id DESC LIMIT 200";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapResultSetToPayment(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Payment> getBySaleId(int saleId) {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT * FROM payments WHERE sale_id = ? ORDER BY id ASC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, saleId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToPayment(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    private Payment mapResultSetToPayment(ResultSet rs) throws SQLException {
        Payment p = new Payment();
        p.setId(rs.getInt("id"));
        p.setSaleId(rs.getInt("sale_id"));
        p.setPaymentMethod(rs.getString("payment_method"));
        p.setAmount(rs.getBigDecimal("amount"));
        p.setReferenceNumber(rs.getString("reference_number"));
        p.setStatus(Payment.Status.valueOf(rs.getString("status")));
        Timestamp ts = rs.getTimestamp("payment_date");
        if (ts != null) {
            p.setPaymentDate(ts.toLocalDateTime());
        }
        return p;
    }
}
