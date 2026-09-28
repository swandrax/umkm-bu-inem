package com.ibuinem.pos.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderItemRequest {
    @NotNull(message = "ID Layanan wajib ditentukan")
    private Long serviceProductId;

    @Min(value = 1, message = "Jumlah minimal 1")
    private int quantity = 1;

    public OrderItemRequest() {}

    public OrderItemRequest(Long serviceProductId, int quantity) {
        this.serviceProductId = serviceProductId;
        this.quantity = quantity;
    }

    public Long getServiceProductId() { return serviceProductId; }
    public void setServiceProductId(Long serviceProductId) { this.serviceProductId = serviceProductId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
