package com.ibuinem.pos.dto.order;

import java.math.BigDecimal;

public class OrderItemDto {
    private Long id;
    private Long serviceProductId;
    private String productName;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal discount;
    private BigDecimal lineTotal;

    public OrderItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getServiceProductId() { return serviceProductId; }
    public void setServiceProductId(Long serviceProductId) { this.serviceProductId = serviceProductId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}
