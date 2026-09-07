package com.ibuinem.pos.dto.product;

import com.ibuinem.pos.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {
    private int id;
    private String code;
    private String name;
    private int categoryId;
    private String categoryName;
    private BigDecimal price;
    private int stock;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductDto() {}

    public ProductDto(Product p) {
        if (p != null) {
            this.id = p.getId();
            this.code = p.getCode();
            this.name = p.getName();
            this.categoryId = p.getCategoryId();
            this.categoryName = p.getCategoryName();
            this.price = p.getPrice();
            this.stock = p.getStock();
            this.active = p.isActive();
            this.createdAt = p.getCreatedAt();
            this.updatedAt = p.getUpdatedAt();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
