package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.BusinessSettings;

import java.sql.*;

public class BusinessSettingsDAO {

    public BusinessSettings getSettings() {
        String sql = "SELECT * FROM business_settings ORDER BY id ASC LIMIT 1";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return mapResultSet(rs);
            }
        } catch (SQLException e) {
            // If table does not exist or database is starting up, fallback to default values safely
            System.err.println("Notice: business_settings read fallback: " + e.getMessage());
        }
        // Return default instance
        return new BusinessSettings();
    }

    public boolean updateSettings(BusinessSettings settings) {
        String sql = "INSERT INTO business_settings (id, business_name, tagline, description, address, phone, whatsapp, email, customer_service_email, logo_url, website, tax_rate, currency, receipt_footer, social_media) " +
                     "VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE " +
                     "business_name = VALUES(business_name), tagline = VALUES(tagline), description = VALUES(description), " +
                     "address = VALUES(address), phone = VALUES(phone), whatsapp = VALUES(whatsapp), email = VALUES(email), " +
                     "customer_service_email = VALUES(customer_service_email), logo_url = VALUES(logo_url), website = VALUES(website), " +
                     "tax_rate = VALUES(tax_rate), currency = VALUES(currency), receipt_footer = VALUES(receipt_footer), social_media = VALUES(social_media), updated_at = CURRENT_TIMESTAMP";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, settings.getBusinessName());
            pstmt.setString(2, settings.getTagline());
            pstmt.setString(3, settings.getDescription());
            pstmt.setString(4, settings.getAddress());
            pstmt.setString(5, settings.getPhone());
            pstmt.setString(6, settings.getWhatsapp());
            pstmt.setString(7, settings.getEmail());
            pstmt.setString(8, settings.getCustomerServiceEmail());
            pstmt.setString(9, settings.getLogoUrl());
            pstmt.setString(10, settings.getWebsite());
            pstmt.setBigDecimal(11, settings.getTaxRate());
            pstmt.setString(12, settings.getCurrency());
            pstmt.setString(13, settings.getReceiptFooter());
            pstmt.setString(14, settings.getSocialMedia());

            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private BusinessSettings mapResultSet(ResultSet rs) throws SQLException {
        BusinessSettings s = new BusinessSettings();
        s.setId(rs.getInt("id"));
        s.setBusinessName(rs.getString("business_name"));
        s.setTagline(rs.getString("tagline"));
        s.setDescription(rs.getString("description"));
        s.setAddress(rs.getString("address"));
        s.setPhone(rs.getString("phone"));
        s.setWhatsapp(rs.getString("whatsapp"));
        s.setEmail(rs.getString("email"));
        s.setCustomerServiceEmail(rs.getString("customer_service_email"));
        s.setLogoUrl(rs.getString("logo_url"));
        s.setWebsite(rs.getString("website"));
        s.setTaxRate(rs.getBigDecimal("tax_rate"));
        s.setCurrency(rs.getString("currency"));
        s.setReceiptFooter(rs.getString("receipt_footer"));
        s.setSocialMedia(rs.getString("social_media"));
        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) s.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) s.setUpdatedAt(ua.toLocalDateTime());
        return s;
    }
}
