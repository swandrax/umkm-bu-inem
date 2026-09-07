package com.ibuinem.pos.dto.sales;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;
import java.util.List;

public class CheckoutRequest {

    private Integer customerId;
    private Integer packageId;

    @NotBlank(message = "Metode pembayaran wajib dipilih")
    private String paymentMethod = "CASH";

    private BigDecimal cashAmount = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal tax = BigDecimal.ZERO;

    @NotEmpty(message = "Keranjang belanja tidak boleh kosong")
    @Valid
    private List<CartItemRequest> items;

    private ShippingRequest shipping;

    public CheckoutRequest() {}

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Integer getPackageId() {
        return packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getCashAmount() {
        return cashAmount;
    }

    public void setCashAmount(BigDecimal cashAmount) {
        this.cashAmount = cashAmount;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public List<CartItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CartItemRequest> items) {
        this.items = items;
    }

    public ShippingRequest getShipping() {
        return shipping;
    }

    public void setShipping(ShippingRequest shipping) {
        this.shipping = shipping;
    }
}
