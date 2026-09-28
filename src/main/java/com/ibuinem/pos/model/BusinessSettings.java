package com.ibuinem.pos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BusinessSettings {
    private int id;
    private String businessName;
    private String tagline;
    private String description;
    private String address;
    private String phone;
    private String whatsapp;
    private String email;
    private String customerServiceEmail;
    private String logoUrl;
    private String website;
    private BigDecimal taxRate;
    private String currency;
    private String receiptFooter;
    private String socialMedia;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BusinessSettings() {
        this.businessName = "UMKM Bu Inem";
        this.tagline = "Solusi Digital & Layanan UMKM Terpercaya";
        this.phone = "0812-3456-7890";
        this.whatsapp = "6281234567890";
        this.email = "halo@bu-inem.com";
        this.customerServiceEmail = "cs@bu-inem.com";
        this.taxRate = BigDecimal.ZERO;
        this.currency = "IDR";
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCustomerServiceEmail() { return customerServiceEmail; }
    public void setCustomerServiceEmail(String customerServiceEmail) { this.customerServiceEmail = customerServiceEmail; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getReceiptFooter() { return receiptFooter; }
    public void setReceiptFooter(String receiptFooter) { this.receiptFooter = receiptFooter; }

    public String getSocialMedia() { return socialMedia; }
    public void setSocialMedia(String socialMedia) { this.socialMedia = socialMedia; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
