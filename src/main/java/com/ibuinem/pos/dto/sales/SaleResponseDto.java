package com.ibuinem.pos.dto.sales;

import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.model.SaleDetail;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SaleResponseDto {
    private int id;
    private String transactionNumber;
    private int userId;
    private String userName;
    private Integer customerId;
    private Integer packageId;
    private LocalDateTime transactionDate;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal total;
    private String paymentMethod;
    private BigDecimal cashAmount;
    private BigDecimal changeAmount;
    private String status;
    private String orderStatus;
    private List<SaleDetailDto> details = new ArrayList<>();

    public static class SaleDetailDto {
        private int id;
        private int productId;
        private String productName;
        private BigDecimal price;
        private int quantity;
        private BigDecimal subtotal;

        public SaleDetailDto() {}

        public SaleDetailDto(SaleDetail d) {
            if (d != null) {
                this.id = d.getId();
                this.productId = d.getProductId();
                this.productName = d.getProductName();
                this.price = d.getPrice();
                this.quantity = d.getQuantity();
                this.subtotal = d.getSubtotal();
            }
        }

        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public int getProductId() { return productId; }
        public void setProductId(int productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    public SaleResponseDto() {}

    public SaleResponseDto(Sale sale) {
        if (sale != null) {
            this.id = sale.getId();
            this.transactionNumber = sale.getTransactionNumber();
            this.userId = sale.getUserId();
            this.userName = sale.getUserName();
            this.customerId = sale.getCustomerId();
            this.packageId = sale.getPackageId();
            this.transactionDate = sale.getTransactionDate();
            this.subtotal = sale.getSubtotal();
            this.discount = sale.getDiscount();
            this.tax = sale.getTax();
            this.total = sale.getTotal();
            this.paymentMethod = sale.getPaymentMethod();
            this.cashAmount = sale.getCashAmount();
            this.changeAmount = sale.getChangeAmount();
            this.status = sale.getStatus() != null ? sale.getStatus().name() : "PAID";
            this.orderStatus = sale.getOrderStatus();
            if (sale.getDetails() != null) {
                for (SaleDetail d : sale.getDetails()) {
                    this.details.add(new SaleDetailDto(d));
                }
            }
        }
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTransactionNumber() { return transactionNumber; }
    public void setTransactionNumber(String transactionNumber) { this.transactionNumber = transactionNumber; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
    public Integer getPackageId() { return packageId; }
    public void setPackageId(Integer packageId) { this.packageId = packageId; }
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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    public List<SaleDetailDto> getDetails() { return details; }
    public void setDetails(List<SaleDetailDto> details) { this.details = details; }
}
