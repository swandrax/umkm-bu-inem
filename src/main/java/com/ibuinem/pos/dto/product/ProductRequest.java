package com.ibuinem.pos.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "Kode produk wajib diisi")
    @Size(max = 50, message = "Kode produk maksimal 50 karakter")
    private String code;

    @NotBlank(message = "Nama produk wajib diisi")
    @Size(max = 150, message = "Nama produk maksimal 150 karakter")
    private String name;

    @NotNull(message = "Kategori produk wajib dipilih")
    @Min(value = 1, message = "Kategori produk tidak valid")
    private Integer categoryId;

    @NotNull(message = "Harga produk wajib diisi")
    @DecimalMin(value = "0.0", message = "Harga produk tidak boleh minus")
    private BigDecimal price;

    @NotNull(message = "Stok produk wajib diisi")
    @Min(value = 0, message = "Stok produk tidak boleh minus")
    private Integer stock;

    private boolean active = true;

    public ProductRequest() {}

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

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
