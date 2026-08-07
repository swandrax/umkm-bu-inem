package com.ibuinem.pos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Payment {
    private int id;
    private int saleId;
    private String paymentMethod;
    private BigDecimal amount;
    private String referenceNumber;
    private LocalDateTime paymentDate;
    private Status status;

    public enum Status {
        SUCCESS,
        PENDING,
        FAILED
    }

    public Payment() {
        this.amount = BigDecimal.ZERO;
        this.status = Status.SUCCESS;
    }

    public Payment(int saleId, String paymentMethod, BigDecimal amount, String referenceNumber) {
        this.saleId = saleId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.referenceNumber = referenceNumber;
        this.status = Status.SUCCESS;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSaleId() { return saleId; }
    public void setSaleId(int saleId) { this.saleId = saleId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
