package com.ibuinem.pos.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "Nama kategori wajib diisi")
    @Size(max = 100, message = "Nama kategori maksimal 100 karakter")
    private String name;

    @Size(max = 255, message = "Deskripsi maksimal 255 karakter")
    private String description;

    public CategoryRequest() {}

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
}
