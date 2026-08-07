package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.*;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class SaleDAO {

    private final ProductDAO productDAO = new ProductDAO();
    private final PaymentDAO paymentDAO = new PaymentDAO();

    /**
     * Generate unique transaction number TRX-YYYYMMDD-XXXX
     */
    public String generateTransactionNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "TRX-" + dateStr + "-";
        String sql = "SELECT COUNT(*) FROM sales WHERE transaction_number LIKE ?";
        int count = 0;
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, prefix + "%");
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    count = rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return prefix + String.format("%04d", count + 1);
    }

    /**
     * Atomic transaction creation (Sales + Sale Details + Stock Deduction + Payment + Shipping)
     */
    public boolean saveTransaction(Sale sale, List<CartItem> cartItems, Shipping shipping) {
        Connection conn = null;
        try {
            conn = DatabaseConfig.getConnection();
            conn.setAutoCommit(false); // Begin transaction

            // 1. Insert Sales Header
            String insertSaleSql = "INSERT INTO sales (transaction_number, user_id, customer_id, package_id, transaction_date, subtotal, discount, tax, total, payment_method, cash_amount, change_amount, status, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            int saleId = 0;
            try (PreparedStatement ps = conn.prepareStatement(insertSaleSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, sale.getTransactionNumber());
                ps.setInt(2, sale.getUserId());
                if (sale.getCustomerId() != null) ps.setInt(3, sale.getCustomerId()); else ps.setNull(3, Types.INTEGER);
                if (sale.getPackageId() != null) ps.setInt(4, sale.getPackageId()); else ps.setNull(4, Types.INTEGER);
                ps.setTimestamp(5, Timestamp.valueOf(LocalDateTime.now()));
                ps.setBigDecimal(6, sale.getSubtotal());
                ps.setBigDecimal(7, sale.getDiscount());
                ps.setBigDecimal(8, sale.getTax());
                ps.setBigDecimal(9, sale.getTotal());
                ps.setString(10, sale.getPaymentMethod());
                ps.setBigDecimal(11, sale.getCashAmount());
                ps.setBigDecimal(12, sale.getChangeAmount());
                ps.setString(13, sale.getStatus().name());
                ps.setString(14, sale.getOrderStatus());

                int affected = ps.executeUpdate();
                if (affected == 0) {
                    conn.rollback();
                    return false;
                }
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        saleId = rs.getInt(1);
                        sale.setId(saleId);
                    }
                }
            }

            // 2. Insert Sale Details & Deduct Stock
            String insertDetailSql = "INSERT INTO sale_details (sale_id, product_id, product_name, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement psDetail = conn.prepareStatement(insertDetailSql)) {
                for (CartItem item : cartItems) {
                    Product p = item.getProduct();
                    int qty = item.getQuantity();
                    BigDecimal itemSubtotal = item.getSubtotal();

                    // Insert detail
                    psDetail.setInt(1, saleId);
                    psDetail.setInt(2, p.getId());
                    psDetail.setString(3, p.getName());
                    psDetail.setBigDecimal(4, p.getPrice());
                    psDetail.setInt(5, qty);
                    psDetail.setBigDecimal(6, itemSubtotal);
                    psDetail.addBatch();

                    // Deduct product stock in DB real-time with constraint check
                    boolean stockUpdated = productDAO.updateStock(conn, p.getId(), qty);
                    if (!stockUpdated) {
                        conn.rollback();
                        throw new SQLException("Stok tidak mencukupi untuk produk: " + p.getName());
                    }
                }
                psDetail.executeBatch();
            }

            // 3. Insert Payment record
            Payment payment = new Payment();
            payment.setSaleId(saleId);
            payment.setPaymentMethod(sale.getPaymentMethod());
            payment.setAmount(sale.getTotal());
            payment.setReferenceNumber("REF-" + System.currentTimeMillis());
            payment.setStatus(Payment.Status.SUCCESS);
            paymentDAO.insert(conn, payment);

            // 4. Insert Shipping if applicable
            if (shipping != null) {
                ShippingDAO shippingDAO = new ShippingDAO();
                shipping.setSaleId(saleId);
                shippingDAO.insert(shipping, conn);
                
                // insert initial delivery log
                String logSql = "INSERT INTO delivery_logs (shipping_id, status, description) VALUES (?, ?, ?)";
                try (PreparedStatement logStmt = conn.prepareStatement(logSql)) {
                    logStmt.setInt(1, shipping.getId());
                    logStmt.setString(2, shipping.getShippingStatus());
                    logStmt.setString(3, "Pesanan Dibuat");
                    logStmt.executeUpdate();
                }
            }

            conn.commit(); // Commit transaction
            return true;

        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            e.printStackTrace();
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public List<Sale> searchSales(LocalDate startDate, LocalDate endDate, String transactionNumber) {
        List<Sale> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT s.*, u.full_name AS user_name " +
            "FROM sales s " +
            "JOIN users u ON s.user_id = u.id " +
            "WHERE 1=1 "
        );

        if (startDate != null) {
            sql.append("AND s.transaction_date >= ? ");
        }
        if (endDate != null) {
            sql.append("AND s.transaction_date <= ? ");
        }
        if (transactionNumber != null && !transactionNumber.trim().isEmpty()) {
            sql.append("AND s.transaction_number LIKE ? ");
        }

        sql.append("ORDER BY s.transaction_date DESC");

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            int paramIdx = 1;
            if (startDate != null) {
                ps.setTimestamp(paramIdx++, Timestamp.valueOf(startDate.atStartOfDay()));
            }
            if (endDate != null) {
                ps.setTimestamp(paramIdx++, Timestamp.valueOf(endDate.atTime(LocalTime.MAX)));
            }
            if (transactionNumber != null && !transactionNumber.trim().isEmpty()) {
                ps.setString(paramIdx++, "%" + transactionNumber.trim() + "%");
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Sale sale = mapResultSetToSale(rs);
                    list.add(sale);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Sale getById(int saleId) {
        String sql = "SELECT s.*, u.full_name AS user_name " +
                     "FROM sales s " +
                     "JOIN users u ON s.user_id = u.id " +
                     "WHERE s.id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, saleId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Sale sale = mapResultSetToSale(rs);
                    sale.setDetails(getDetailsBySaleId(saleId));
                    return sale;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Sale getByTransactionNumber(String trxNum) {
        String sql = "SELECT s.*, u.full_name AS user_name " +
                     "FROM sales s " +
                     "JOIN users u ON s.user_id = u.id " +
                     "WHERE s.transaction_number = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, trxNum);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Sale sale = mapResultSetToSale(rs);
                    sale.setDetails(getDetailsBySaleId(sale.getId()));
                    return sale;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<SaleDetail> getDetailsBySaleId(int saleId) {
        List<SaleDetail> list = new ArrayList<>();
        String sql = "SELECT * FROM sale_details WHERE sale_id = ? ORDER BY id ASC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, saleId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    SaleDetail sd = new SaleDetail();
                    sd.setId(rs.getInt("id"));
                    sd.setSaleId(rs.getInt("sale_id"));
                    sd.setProductId(rs.getInt("product_id"));
                    sd.setProductName(rs.getString("product_name"));
                    sd.setPrice(rs.getBigDecimal("price"));
                    sd.setQuantity(rs.getInt("quantity"));
                    sd.setSubtotal(rs.getBigDecimal("subtotal"));
                    list.add(sd);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * Dashboard Real-time Summary metrics
     */
    public ReportSummary getDashboardSummary() {
        ReportSummary summary = new ReportSummary();
        LocalDate today = LocalDate.now();

        // 1. Total Sales Today
        String sqlToday = "SELECT SUM(total), COUNT(id) FROM sales WHERE DATE(transaction_date) = ? AND status = 'PAID'";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sqlToday)) {
            ps.setDate(1, java.sql.Date.valueOf(today));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    BigDecimal todaySales = rs.getBigDecimal(1);
                    summary.setTotalSalesToday(todaySales != null ? todaySales : BigDecimal.ZERO);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // 2. Total Revenue All Time & Total Transactions All Time
        String sqlAllTime = "SELECT SUM(total), COUNT(id) FROM sales WHERE status = 'PAID'";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sqlAllTime);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                BigDecimal revenue = rs.getBigDecimal(1);
                int count = rs.getInt(2);
                summary.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);
                summary.setTotalTransactions(count);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // 3. Total Products Sold
        String sqlItems = "SELECT SUM(sd.quantity) FROM sale_details sd JOIN sales s ON sd.sale_id = s.id WHERE s.status = 'PAID'";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sqlItems);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                summary.setProductsSold(rs.getInt(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return summary;
    }

    private Sale mapResultSetToSale(ResultSet rs) throws SQLException {
        Sale s = new Sale();
        s.setId(rs.getInt("id"));
        s.setTransactionNumber(rs.getString("transaction_number"));
        s.setUserId(rs.getInt("user_id"));
        s.setUserName(rs.getString("user_name"));
        Timestamp ts = rs.getTimestamp("transaction_date");
        if (ts != null) s.setTransactionDate(ts.toLocalDateTime());
        s.setSubtotal(rs.getBigDecimal("subtotal"));
        s.setDiscount(rs.getBigDecimal("discount"));
        s.setTax(rs.getBigDecimal("tax"));
        s.setTotal(rs.getBigDecimal("total"));
        s.setPaymentMethod(rs.getString("payment_method"));
        s.setCashAmount(rs.getBigDecimal("cash_amount"));
        s.setChangeAmount(rs.getBigDecimal("change_amount"));
        s.setStatus(Sale.Status.valueOf(rs.getString("status")));
        s.setOrderStatus(rs.getString("order_status"));
        
        int custId = rs.getInt("customer_id");
        if (!rs.wasNull()) s.setCustomerId(custId);
        
        int pkgId = rs.getInt("package_id");
        if (!rs.wasNull()) s.setPackageId(pkgId);

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) s.setCreatedAt(createdAt.toLocalDateTime());
        return s;
    }
}
