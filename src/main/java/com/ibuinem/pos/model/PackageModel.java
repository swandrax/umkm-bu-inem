package com.ibuinem.pos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PackageModel {
    private int id;
    private String name;
    private BigDecimal price;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;

    public PackageModel() {}

    public PackageModel(int id, String name, BigDecimal price, String description, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return name;
    }
}
