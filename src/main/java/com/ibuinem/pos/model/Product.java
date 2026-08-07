package com.ibuinem.pos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Product {
    private int id;
    private String code;
    private String name;
    private int categoryId;
    private String categoryName; // Helper for display
    private BigDecimal price;
    private int stock;
    private boolean active;
    private int soldQuantity;
    private BigDecimal revenue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Product() {
        this.price = BigDecimal.ZERO;
        this.stock = 0;
        this.active = true;
        this.soldQuantity = 0;
        this.revenue = BigDecimal.ZERO;
    }

    public Product(int id, String code, String name, int categoryId, String categoryName, BigDecimal price, int stock, boolean active) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.price = price;
        this.stock = stock;
        this.active = active;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }



    public int getSoldQuantity() { return soldQuantity; }
    public void setSoldQuantity(int soldQuantity) { this.soldQuantity = soldQuantity; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return name + " (" + code + ")";
    }
}
