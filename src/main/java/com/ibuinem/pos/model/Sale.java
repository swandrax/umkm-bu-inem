package com.ibuinem.pos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Sale {
    private int id;
    private String transactionNumber;
    private int userId;
    private String userName; // Helper for display
    private LocalDateTime transactionDate;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal total;
    private String paymentMethod;
    private BigDecimal cashAmount;
    private BigDecimal changeAmount;
    private Status status;
    private String orderStatus;
    private Integer customerId;
    private Integer packageId;
    private LocalDateTime createdAt;
    private List<SaleDetail> details;

    public enum Status {
        PAID,
        CANCELLED
    }

    public Sale() {
        this.subtotal = BigDecimal.ZERO;
        this.discount = BigDecimal.ZERO;
        this.tax = BigDecimal.ZERO;
        this.total = BigDecimal.ZERO;
        this.cashAmount = BigDecimal.ZERO;
        this.changeAmount = BigDecimal.ZERO;
        this.paymentMethod = "CASH";
        this.status = Status.PAID;
        this.orderStatus = "SELESAI";
        this.details = new ArrayList<>();
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTransactionNumber() { return transactionNumber; }
    public void setTransactionNumber(String transactionNumber) { this.transactionNumber = transactionNumber; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getCashAmount() { return cashAmount; }
    public void setCashAmount(BigDecimal cashAmount) { this.cashAmount = cashAmount; }

    public BigDecimal getChangeAmount() { return changeAmount; }
    public void setChangeAmount(BigDecimal changeAmount) { this.changeAmount = changeAmount; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getPackageId() { return packageId; }
    public void setPackageId(Integer packageId) { this.packageId = packageId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<SaleDetail> getDetails() { return details; }
    public void setDetails(List<SaleDetail> details) { this.details = details; }
}
