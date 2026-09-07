package com.ibuinem.pos.dto.sales;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ReceiptDto {
    private String storeName = "JAJANAN IBU INEM";
    private String storeAddress = "Jl. Khas Kuliner No. 88, Jakarta";
    private String storePhone = "0812-3456-7890";
    private String transactionNumber;
    private LocalDateTime transactionDate;
    private String cashierName;
    private String customerName;
    private List<ReceiptItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal total;
    private String paymentMethod;
    private BigDecimal cashAmount;
    private BigDecimal changeAmount;
    private String qrCodeContent;
    private String footerMessage = "Terima Kasih Atas Kunjungan Anda\nBarang yang sudah dibeli tidak dapat ditukar";

    public static class ReceiptItemDto {
        private String productName;
        private int quantity;
        private BigDecimal price;
        private BigDecimal subtotal;

        public ReceiptItemDto() {}

        public ReceiptItemDto(String productName, int quantity, BigDecimal price, BigDecimal subtotal) {
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
            this.subtotal = subtotal;
        }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    public ReceiptDto() {}

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
    public String getStoreAddress() { return storeAddress; }
    public void setStoreAddress(String storeAddress) { this.storeAddress = storeAddress; }
    public String getStorePhone() { return storePhone; }
    public void setStorePhone(String storePhone) { this.storePhone = storePhone; }
    public String getTransactionNumber() { return transactionNumber; }
    public void setTransactionNumber(String transactionNumber) { this.transactionNumber = transactionNumber; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    public String getCashierName() { return cashierName; }
    public void setCashierName(String cashierName) { this.cashierName = cashierName; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public List<ReceiptItemDto> getItems() { return items; }
    public void setItems(List<ReceiptItemDto> items) { this.items = items; }
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
    public String getQrCodeContent() { return qrCodeContent; }
    public void setQrCodeContent(String qrCodeContent) { this.qrCodeContent = qrCodeContent; }
    public String getFooterMessage() { return footerMessage; }
    public void setFooterMessage(String footerMessage) { this.footerMessage = footerMessage; }
}
