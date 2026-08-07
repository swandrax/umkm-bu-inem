package com.ibuinem.pos.model;

import java.math.BigDecimal;

public class SaleDetail {
    private int id;
    private int saleId;
    private int productId;
    private String productName;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;

    public SaleDetail() {
        this.price = BigDecimal.ZERO;
        this.quantity = 1;
        this.subtotal = BigDecimal.ZERO;
    }

    public SaleDetail(int productId, String productName, BigDecimal price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSaleId() { return saleId; }
    public void setSaleId(int saleId) { this.saleId = saleId; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
        if (this.price != null) {
            this.subtotal = this.price.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
