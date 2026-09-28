package com.ibuinem.pos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Receipt {
    private Long id;
    private String receiptNumber;
    private Long orderId;
    private String barcodePayload;
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private String customerServiceEmail;
    private String thankYouMessage;
    private BigDecimal amountDue = BigDecimal.ZERO;
    private BigDecimal amountReceived = BigDecimal.ZERO;
    private BigDecimal changeAmount = BigDecimal.ZERO;
    private String paymentMethod;
    private String paymentReference;
    private boolean qrisDummy = false;
    private LocalDateTime printedAt;
    private LocalDateTime createdAt;

    public Receipt() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getBarcodePayload() { return barcodePayload; }
    public void setBarcodePayload(String barcodePayload) { this.barcodePayload = barcodePayload; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getStoreAddress() { return storeAddress; }
    public void setStoreAddress(String storeAddress) { this.storeAddress = storeAddress; }

    public String getStorePhone() { return storePhone; }
    public void setStorePhone(String storePhone) { this.storePhone = storePhone; }

    public String getCustomerServiceEmail() { return customerServiceEmail; }
    public void setCustomerServiceEmail(String customerServiceEmail) { this.customerServiceEmail = customerServiceEmail; }

    public String getThankYouMessage() { return thankYouMessage; }
    public void setThankYouMessage(String thankYouMessage) { this.thankYouMessage = thankYouMessage; }

    public BigDecimal getAmountDue() { return amountDue; }
    public void setAmountDue(BigDecimal amountDue) { this.amountDue = amountDue; }

    public BigDecimal getAmountReceived() { return amountReceived; }
    public void setAmountReceived(BigDecimal amountReceived) { this.amountReceived = amountReceived; }

    public BigDecimal getChangeAmount() { return changeAmount; }
    public void setChangeAmount(BigDecimal changeAmount) { this.changeAmount = changeAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public boolean isQrisDummy() { return qrisDummy; }
    public void setQrisDummy(boolean qrisDummy) { this.qrisDummy = qrisDummy; }

    public LocalDateTime getPrintedAt() { return printedAt; }
    public void setPrintedAt(LocalDateTime printedAt) { this.printedAt = printedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
