package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.Receipt;

import java.sql.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

public class ReceiptDAO {

    public String generateReceiptNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        int rand = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "RCP-" + dateStr + "-" + rand;
    }

    public boolean insert(Receipt r) {
        String sql = "INSERT INTO receipts (receipt_number, order_id, barcode_payload, store_name, store_address, store_phone, customer_service_email, thank_you_message, amount_due, amount_received, change_amount, payment_method, payment_reference, is_qris_dummy, printed_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE " +
                     "amount_received = VALUES(amount_received), change_amount = VALUES(change_amount), payment_reference = VALUES(payment_reference)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, r.getReceiptNumber());
            pstmt.setLong(2, r.getOrderId());
            pstmt.setString(3, r.getBarcodePayload());
            pstmt.setString(4, r.getStoreName());
            pstmt.setString(5, r.getStoreAddress());
            pstmt.setString(6, r.getStorePhone());
            pstmt.setString(7, r.getCustomerServiceEmail());
            pstmt.setString(8, r.getThankYouMessage());
            pstmt.setBigDecimal(9, r.getAmountDue());
            pstmt.setBigDecimal(10, r.getAmountReceived());
            pstmt.setBigDecimal(11, r.getChangeAmount());
            pstmt.setString(12, r.getPaymentMethod());
            pstmt.setString(13, r.getPaymentReference());
            pstmt.setBoolean(14, r.isQrisDummy());
            if (r.getPrintedAt() != null) {
                pstmt.setTimestamp(15, Timestamp.valueOf(r.getPrintedAt()));
            } else {
                pstmt.setNull(15, Types.TIMESTAMP);
            }

            int affected = pstmt.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        r.setId(rs.getLong(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Receipt getByOrderId(long orderId) {
        String sql = "SELECT * FROM receipts WHERE order_id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, orderId);
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

    public Receipt getByReceiptNumber(String receiptNumber) {
        String sql = "SELECT * FROM receipts WHERE receipt_number = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, receiptNumber);
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

    private Receipt mapResultSet(ResultSet rs) throws SQLException {
        Receipt r = new Receipt();
        r.setId(rs.getLong("id"));
        r.setReceiptNumber(rs.getString("receipt_number"));
        r.setOrderId(rs.getLong("order_id"));
        r.setBarcodePayload(rs.getString("barcode_payload"));
        r.setStoreName(rs.getString("store_name"));
        r.setStoreAddress(rs.getString("store_address"));
        r.setStorePhone(rs.getString("store_phone"));
        r.setCustomerServiceEmail(rs.getString("customer_service_email"));
        r.setThankYouMessage(rs.getString("thank_you_message"));
        r.setAmountDue(rs.getBigDecimal("amount_due"));
        r.setAmountReceived(rs.getBigDecimal("amount_received"));
        r.setChangeAmount(rs.getBigDecimal("change_amount"));
        r.setPaymentMethod(rs.getString("payment_method"));
        r.setPaymentReference(rs.getString("payment_reference"));
        r.setQrisDummy(rs.getBoolean("is_qris_dummy"));

        Timestamp pa = rs.getTimestamp("printed_at");
        if (pa != null) r.setPrintedAt(pa.toLocalDateTime());
        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) r.setCreatedAt(ca.toLocalDateTime());

        return r;
    }
}
