package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.Order;
import com.ibuinem.pos.model.OrderItem;

import java.sql.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class OrderDAO {

    public String generateOrderNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        int rand = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "ORD-" + dateStr + "-" + rand;
    }

    public boolean insert(Order order) {
        String orderSql = "INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, status, subtotal, discount_amount, tax_amount, total_amount, payment_status, payment_method, notes) " +
                          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String itemSql = "INSERT INTO order_items (order_id, service_product_id, product_name_snapshot, unit_price_snapshot, quantity, discount, line_total) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement pstmt = conn.prepareStatement(orderSql, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setString(1, order.getOrderNumber());
                if (order.getCustomerId() != null && order.getCustomerId() > 0) {
                    pstmt.setInt(2, order.getCustomerId());
                } else {
                    pstmt.setNull(2, Types.INTEGER);
                }
                pstmt.setString(3, order.getCustomerName());
                pstmt.setString(4, order.getCustomerEmail());
                pstmt.setString(5, order.getCustomerPhone());
                pstmt.setString(6, order.getStatus());
                pstmt.setBigDecimal(7, order.getSubtotal());
                pstmt.setBigDecimal(8, order.getDiscountAmount());
                pstmt.setBigDecimal(9, order.getTaxAmount());
                pstmt.setBigDecimal(10, order.getTotalAmount());
                pstmt.setString(11, order.getPaymentStatus());
                pstmt.setString(12, order.getPaymentMethod());
                pstmt.setString(13, order.getNotes());

                int affected = pstmt.executeUpdate();
                if (affected == 0) {
                    conn.rollback();
                    return false;
                }

                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        order.setId(rs.getLong(1));
                    }
                }

                // Insert items
                try (PreparedStatement itemPstmt = conn.prepareStatement(itemSql, Statement.RETURN_GENERATED_KEYS)) {
                    for (OrderItem item : order.getItems()) {
                        itemPstmt.setLong(1, order.getId());
                        if (item.getServiceProductId() != null && item.getServiceProductId() > 0) {
                            itemPstmt.setLong(2, item.getServiceProductId());
                        } else {
                            itemPstmt.setNull(2, Types.BIGINT);
                        }
                        itemPstmt.setString(3, item.getProductNameSnapshot());
                        itemPstmt.setBigDecimal(4, item.getUnitPriceSnapshot());
                        itemPstmt.setInt(5, item.getQuantity());
                        itemPstmt.setBigDecimal(6, item.getDiscount());
                        itemPstmt.setBigDecimal(7, item.getLineTotal());
                        itemPstmt.addBatch();
                    }
                    itemPstmt.executeBatch();
                }

                conn.commit();
                return true;
            } catch (Exception e) {
                conn.rollback();
                e.printStackTrace();
                return false;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Order getById(long id) {
        String sql = "SELECT * FROM orders WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Order o = mapResultSet(rs);
                    o.setItems(getOrderItems(conn, o.getId()));
                    return o;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Order getByOrderNumber(String orderNumber) {
        String sql = "SELECT * FROM orders WHERE order_number = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, orderNumber);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Order o = mapResultSet(rs);
                    o.setItems(getOrderItems(conn, o.getId()));
                    return o;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Order> getAll(String status, String paymentStatus, String search, int limit, int offset) {
        List<Order> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM orders WHERE 1=1 ");
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            sql.append("AND status = ? ");
        }
        if (paymentStatus != null && !paymentStatus.isBlank() && !paymentStatus.equalsIgnoreCase("ALL")) {
            sql.append("AND payment_status = ? ");
        }
        if (search != null && !search.isBlank()) {
            sql.append("AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?) ");
        }
        sql.append("ORDER BY id DESC LIMIT ? OFFSET ?");

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            int idx = 1;
            if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
                pstmt.setString(idx++, status);
            }
            if (paymentStatus != null && !paymentStatus.isBlank() && !paymentStatus.equalsIgnoreCase("ALL")) {
                pstmt.setString(idx++, paymentStatus);
            }
            if (search != null && !search.isBlank()) {
                String q = "%" + search.trim() + "%";
                pstmt.setString(idx++, q);
                pstmt.setString(idx++, q);
                pstmt.setString(idx++, q);
            }
            pstmt.setInt(idx++, limit > 0 ? limit : 20);
            pstmt.setInt(idx++, Math.max(0, offset));

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Order o = mapResultSet(rs);
                    o.setItems(getOrderItems(conn, o.getId()));
                    list.add(o);
                }
            }
        } catch (SQLException e) {
            System.err.println("Notice: orders read fallback: " + e.getMessage());
        }
        return list;
    }

    public boolean updatePaymentStatus(long id, String paymentStatus, String paymentMethod, String newOrderStatus) {
        String sql = "UPDATE orders SET payment_status = ?, payment_method = ?, status = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, paymentStatus);
            pstmt.setString(2, paymentMethod);
            pstmt.setString(3, newOrderStatus);
            pstmt.setLong(4, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateStatus(long id, String newStatus) {
        String sql = "UPDATE orders SET status = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, newStatus);
            pstmt.setLong(2, id);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private List<OrderItem> getOrderItems(Connection conn, long orderId) throws SQLException {
        List<OrderItem> items = new ArrayList<>();
        String sql = "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, orderId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    OrderItem item = new OrderItem();
                    item.setId(rs.getLong("id"));
                    item.setOrderId(rs.getLong("order_id"));
                    long spId = rs.getLong("service_product_id");
                    if (!rs.wasNull()) item.setServiceProductId(spId);
                    item.setProductNameSnapshot(rs.getString("product_name_snapshot"));
                    item.setUnitPriceSnapshot(rs.getBigDecimal("unit_price_snapshot"));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setDiscount(rs.getBigDecimal("discount"));
                    item.setLineTotal(rs.getBigDecimal("line_total"));
                    items.add(item);
                }
            }
        }
        return items;
    }

    private Order mapResultSet(ResultSet rs) throws SQLException {
        Order o = new Order();
        o.setId(rs.getLong("id"));
        o.setOrderNumber(rs.getString("order_number"));
        int cId = rs.getInt("customer_id");
        if (!rs.wasNull()) o.setCustomerId(cId);
        o.setCustomerName(rs.getString("customer_name"));
        o.setCustomerEmail(rs.getString("customer_email"));
        o.setCustomerPhone(rs.getString("customer_phone"));
        o.setStatus(rs.getString("status"));
        o.setSubtotal(rs.getBigDecimal("subtotal"));
        o.setDiscountAmount(rs.getBigDecimal("discount_amount"));
        o.setTaxAmount(rs.getBigDecimal("tax_amount"));
        o.setTotalAmount(rs.getBigDecimal("total_amount"));
        o.setPaymentStatus(rs.getString("payment_status"));
        o.setPaymentMethod(rs.getString("payment_method"));
        o.setNotes(rs.getString("notes"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) o.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) o.setUpdatedAt(ua.toLocalDateTime());

        return o;
    }
}
