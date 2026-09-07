package com.ibuinem.pos.dto.sales;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {

    @NotNull(message = "Product ID wajib diisi")
    private Integer productId;

    @NotNull(message = "Quantity wajib diisi")
    @Min(value = 1, message = "Quantity minimal 1")
    private Integer quantity;

    public CartItemRequest() {}

    public CartItemRequest(Integer productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
