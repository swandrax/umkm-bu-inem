package com.ibuinem.pos.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentProofDto {
    private String orderNumber;
    private String paymentReference;
    private String customerName;
    private String paymentMethod;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime paidAt;
    private String operatorReference;
    private boolean qrisDummy = false;
    private String testNotice;

    public PaymentProofDto() {}

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public String getOperatorReference() { return operatorReference; }
    public void setOperatorReference(String operatorReference) { this.operatorReference = operatorReference; }

    public boolean isQrisDummy() { return qrisDummy; }
    public void setQrisDummy(boolean qrisDummy) { this.qrisDummy = qrisDummy; }

    public String getTestNotice() { return testNotice; }
    public void setTestNotice(String testNotice) { this.testNotice = testNotice; }
}
