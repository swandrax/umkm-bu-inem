package com.ibuinem.pos.service;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.dao.CrmActivityDAO;
import com.ibuinem.pos.dao.CustomerDAO;
import com.ibuinem.pos.dao.LeadDAO;
import com.ibuinem.pos.dto.crm.CrmDashboardDto;
import com.ibuinem.pos.model.CrmActivity;
import com.ibuinem.pos.model.Lead;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CrmService {

    private final CustomerDAO customerDAO = new CustomerDAO();
    private final LeadDAO leadDAO = new LeadDAO();
    private final CrmActivityDAO crmActivityDAO = new CrmActivityDAO();

    public CrmDashboardDto getDashboardMetrics() {
        CrmDashboardDto dto = new CrmDashboardDto();

        // 1. Total Customers
        try {
            dto.setTotalCustomers(customerDAO.getAll().size());
        } catch (Exception ignored) {}

        // 2. Leads metrics
        List<Lead> leads = leadDAO.getAll(null, null);
        long newCount = 0;
        long qualCount = 0;
        long wonCount = 0;
        long activeCount = 0;
        for (Lead l : leads) {
            String s = l.getStatus() != null ? l.getStatus().toUpperCase() : "NEW";
            if ("NEW".equals(s)) newCount++;
            if ("QUALIFIED".equals(s) || "PROPOSAL".equals(s) || "NEGOTIATION".equals(s)) qualCount++;
            if ("WON".equals(s)) wonCount++;
            if (!"WON".equals(s) && !"LOST".equals(s)) activeCount++;
        }
        dto.setNewLeads(newCount);
        dto.setQualifiedLeads(qualCount);
        dto.setWonDeals(wonCount);
        dto.setActiveLeads(activeCount);

        // 3. Orders & Revenue metrics
        calculateOrderMetrics(dto);

        // 4. Recent Activities
        dto.setRecentActivities(crmActivityDAO.getRecentActivities(15));

        return dto;
    }

    public List<CrmActivity> getRecentActivities(int limit) {
        return crmActivityDAO.getRecentActivities(limit);
    }

    public List<CrmActivity> getCustomerActivities(int customerId) {
        return crmActivityDAO.getByCustomerId(customerId);
    }

    private void calculateOrderMetrics(CrmDashboardDto dto) {
        // Query from orders table if available, fallback gracefully
        String sql = "SELECT COUNT(*) as total_count, " +
                     "SUM(CASE WHEN payment_status = 'PAID' THEN 1 ELSE 0 END) as paid_count, " +
                     "SUM(CASE WHEN payment_status != 'PAID' THEN 1 ELSE 0 END) as unpaid_count, " +
                     "SUM(CASE WHEN payment_status = 'PAID' THEN total_amount ELSE 0 END) as revenue_sum, " +
                     "SUM(discount_amount) as discount_sum " +
                     "FROM orders";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            if (rs.next()) {
                dto.setTotalOrders(rs.getLong("total_count"));
                dto.setPaidOrders(rs.getLong("paid_count"));
                dto.setUnpaidOrders(rs.getLong("unpaid_count"));
                BigDecimal rev = rs.getBigDecimal("revenue_sum");
                if (rev != null) dto.setTotalRevenue(rev);
                BigDecimal disc = rs.getBigDecimal("discount_sum");
                if (disc != null) dto.setTotalDiscounts(disc);
            }
        } catch (SQLException e) {
            // If orders table is empty or fallback to legacy sales
            calculateFromLegacySales(dto);
            return;
        }

        // Also breakdown payment methods
        String pmSql = "SELECT payment_method, COUNT(*) as cnt FROM orders GROUP BY payment_method";
        Map<String, Long> pms = new HashMap<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(pmSql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                pms.put(rs.getString("payment_method"), rs.getLong("cnt"));
            }
            dto.setPaymentMethods(pms);
        } catch (SQLException ignored) {}
    }

    private void calculateFromLegacySales(CrmDashboardDto dto) {
        String sql = "SELECT COUNT(*) as total_count, " +
                     "SUM(CASE WHEN status = 'PAID' THEN total ELSE 0 END) as revenue_sum, " +
                     "SUM(discount) as discount_sum " +
                     "FROM sales";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            if (rs.next()) {
                long total = rs.getLong("total_count");
                dto.setTotalOrders(total);
                dto.setPaidOrders(total);
                dto.setUnpaidOrders(0);
                BigDecimal rev = rs.getBigDecimal("revenue_sum");
                if (rev != null) dto.setTotalRevenue(rev);
                BigDecimal disc = rs.getBigDecimal("discount_sum");
                if (disc != null) dto.setTotalDiscounts(disc);
            }
        } catch (SQLException ignored) {}
    }
}
