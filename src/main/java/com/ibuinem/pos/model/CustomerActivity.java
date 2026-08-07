package com.ibuinem.pos.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CustomerActivity {
    private int saleId;
    private LocalDateTime transactionDate;
    private String customerName;
    private String phone;
    private String address;
    private int totalItems;
    private int totalProducts;
    private BigDecimal totalPayment;
    private String packageName;
    private String packageBenefit;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private String shippingType;
    private String shippingStatus;
    private String courierNotes;

    public CustomerActivity() {}

    public int getSaleId() { return saleId; }
    public void setSaleId(int saleId) { this.saleId = saleId; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getTotalItems() { return totalItems; }
    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }

    public int getTotalProducts() { return totalProducts; }
    public void setTotalProducts(int totalProducts) { this.totalProducts = totalProducts; }

    public BigDecimal getTotalPayment() { return totalPayment; }
    public void setTotalPayment(BigDecimal totalPayment) { this.totalPayment = totalPayment; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getPackageBenefit() { return packageBenefit; }
    public void setPackageBenefit(String packageBenefit) { this.packageBenefit = packageBenefit; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public String getShippingType() { return shippingType; }
    public void setShippingType(String shippingType) { this.shippingType = shippingType; }

    public String getShippingStatus() { return shippingStatus; }
    public void setShippingStatus(String shippingStatus) { this.shippingStatus = shippingStatus; }

    public String getCourierNotes() { return courierNotes; }
    public void setCourierNotes(String courierNotes) { this.courierNotes = courierNotes; }
}
