package com.ibuinem.pos.dto.category;

import com.ibuinem.pos.model.Category;

import java.time.LocalDateTime;

public class CategoryDto {
    private int id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    public CategoryDto() {}

    public CategoryDto(Category c) {
        if (c != null) {
            this.id = c.getId();
            this.name = c.getName();
            this.description = c.getDescription();
            this.createdAt = c.getCreatedAt();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
