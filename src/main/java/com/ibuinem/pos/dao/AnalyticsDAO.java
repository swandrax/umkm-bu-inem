package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.CustomerActivity;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnalyticsDAO {

    public BigDecimal getTotalSales(String filter) {
        String sql = "SELECT SUM(total) as total FROM sales WHERE status = 'PAID'";
        if ("TODAY".equals(filter) || "Hari Ini".equals(filter)) {
            sql += " AND CAST(transaction_date AS DATE) = CURRENT_DATE";
        } else if ("WEEK".equals(filter) || "Minggu Ini".equals(filter)) {
            sql += " AND transaction_date >= CURRENT_DATE - INTERVAL '7 days'";
        } else if ("MONTH".equals(filter) || "Bulan Ini".equals(filter)) {
            sql += " AND transaction_date >= CURRENT_DATE - INTERVAL '30 days'";
        }

        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                BigDecimal result = rs.getBigDecimal("total");
                return result != null ? result : BigDecimal.ZERO;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return BigDecimal.ZERO;
    }

    public int getTransactionCount(String filter) {
        String sql = "SELECT COUNT(id) as count FROM sales WHERE status = 'PAID'";
        if ("TODAY".equals(filter) || "Hari Ini".equals(filter)) {
            sql += " AND CAST(transaction_date AS DATE) = CURRENT_DATE";
        } else if ("WEEK".equals(filter) || "Minggu Ini".equals(filter)) {
            sql += " AND transaction_date >= CURRENT_DATE - INTERVAL '7 days'";
        } else if ("MONTH".equals(filter) || "Bulan Ini".equals(filter)) {
            sql += " AND transaction_date >= CURRENT_DATE - INTERVAL '30 days'";
        }

        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt("count");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int getProductsSold(String filter) {
        String sql = "SELECT SUM(sd.quantity) as count FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE s.status = 'PAID'";
        if ("TODAY".equals(filter) || "Hari Ini".equals(filter)) {
            sql += " AND CAST(s.transaction_date AS DATE) = CURRENT_DATE";
        }

        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt("count");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int getCustomerCount(String filter) {
        String sql = "SELECT COUNT(id) as count FROM customers";
        if ("TODAY".equals(filter) || "Hari Ini".equals(filter)) {
            sql += " WHERE CAST(created_at AS DATE) = CURRENT_DATE";
        }
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt("count");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public Map<String, BigDecimal> getDailySalesChartData() {
        Map<String, BigDecimal> data = new HashMap<>();
        String sql = "SELECT CAST(transaction_date AS DATE) as date, SUM(total) as total FROM sales WHERE status = 'PAID' GROUP BY CAST(transaction_date AS DATE) ORDER BY CAST(transaction_date AS DATE) ASC LIMIT 30";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                data.put(rs.getString("date"), rs.getBigDecimal("total"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return data;
    }
    
    public Map<String, Integer> getTopProductsChartData() {
        Map<String, Integer> data = new HashMap<>();
        String sql = "SELECT sd.product_name, SUM(sd.quantity) as qty FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE s.status = 'PAID' GROUP BY sd.product_name, sd.product_id ORDER BY qty DESC LIMIT 5";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                data.put(rs.getString("product_name"), rs.getInt("qty"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return data;
    }
    
    public Map<String, Integer> getPaymentMethodChartData() {
        Map<String, Integer> data = new HashMap<>();
        String sql = "SELECT payment_method, COUNT(id) as cnt FROM sales WHERE status = 'PAID' GROUP BY payment_method";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                data.put(rs.getString("payment_method"), rs.getInt("cnt"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return data;
    }

    public List<CustomerActivity> getCustomerActivity(String dateFilter) {
        List<CustomerActivity> activities = new ArrayList<>();
        String sql = "SELECT s.id, s.transaction_date, c.name as customer_name, c.phone, c.address, " +
                     "(SELECT SUM(quantity) FROM sale_details WHERE sale_id = s.id) as total_items, " +
                     "(SELECT COUNT(*) FROM sale_details WHERE sale_id = s.id) as total_products, " +
                     "s.total, p.name as package_name, s.payment_method, s.status as payment_status, s.order_status, " +
                     "sh.shipping_type, sh.shipping_status, sh.courier_notes " +
                     "FROM sales s " +
                     "LEFT JOIN customers c ON s.customer_id = c.id " +
                     "LEFT JOIN packages p ON s.package_id = p.id " +
                     "LEFT JOIN shipping sh ON s.id = sh.sale_id ";
                     
        if ("TODAY".equals(dateFilter) || "Hari Ini".equals(dateFilter)) {
            sql += "WHERE CAST(s.transaction_date AS DATE) = CURRENT_DATE ";
        }
        sql += "ORDER BY s.transaction_date DESC";

        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                CustomerActivity act = new CustomerActivity();
                act.setSaleId(rs.getInt("id"));
                act.setTransactionDate(rs.getTimestamp("transaction_date").toLocalDateTime());
                act.setCustomerName(rs.getString("customer_name") != null ? rs.getString("customer_name") : "Guest/Umum");
                act.setPhone(rs.getString("phone"));
                act.setAddress(rs.getString("address"));
                act.setTotalItems(rs.getInt("total_items"));
                act.setTotalProducts(rs.getInt("total_products"));
                act.setTotalPayment(rs.getBigDecimal("total"));
                act.setPackageName(rs.getString("package_name") != null ? rs.getString("package_name") : "-");
                act.setPaymentMethod(rs.getString("payment_method"));
                act.setPaymentStatus(rs.getString("payment_status"));
                act.setOrderStatus(rs.getString("order_status"));
                act.setShippingType(rs.getString("shipping_type") != null ? rs.getString("shipping_type") : "-");
                act.setShippingStatus(rs.getString("shipping_status") != null ? rs.getString("shipping_status") : "-");
                act.setCourierNotes(rs.getString("courier_notes"));
                activities.add(act);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return activities;
    }
}
