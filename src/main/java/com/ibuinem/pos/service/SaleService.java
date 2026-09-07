package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.CustomerDAO;
import com.ibuinem.pos.dao.ProductDAO;
import com.ibuinem.pos.dao.SaleDAO;
import com.ibuinem.pos.dao.UserDAO;
import com.ibuinem.pos.dto.sales.CartItemRequest;
import com.ibuinem.pos.dto.sales.CheckoutRequest;
import com.ibuinem.pos.dto.sales.ReceiptDto;
import com.ibuinem.pos.dto.sales.SaleResponseDto;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleService {

    private final SaleDAO saleDAO = new SaleDAO();
    private final CustomerDAO customerDAO = new CustomerDAO();
    private final ProductDAO productDAO = new ProductDAO();
    private final UserDAO userDAO = new UserDAO();

    public String generateTransactionNumber() {
        return saleDAO.generateTransactionNumber();
    }

    /**
     * 13-Step Atomic Checkout Transaction:
     * 1. Validate cashier/user existence and active status
     * 2. Validate product existence and active state
     * 3. Validate real-time stock
     * 4. Calculate subtotal server-side
     * 5. Calculate discount
     * 6. Calculate tax
     * 7. Calculate grand total
     * 8. Validate payment amount
     * 9. Insert sale header
     * 10. Insert sale details
     * 11. Insert payment record
     * 12. Decrement product stock
     * 13. Commit transaction (automatic with @Transactional)
     */
    @Transactional(rollbackFor = Exception.class)
    public SaleResponseDto checkout(CheckoutRequest req, int cashierUserId) {
        // Step 1: Validate cashier/user
        User cashier = userDAO.getById(cashierUserId);
        if (cashier == null || !cashier.isActive()) {
            throw new BusinessException("Informasi kasir tidak valid atau nonaktif", "INVALID_CASHIER");
        }

        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new BusinessException("Keranjang belanja kosong", "EMPTY_CART");
        }

        // Step 2 & 3: Validate product existence & stock, prepare cart items
        BigDecimal calculatedSubtotal = BigDecimal.ZERO;
        List<CartItem> cartItems = new ArrayList<>();

        for (CartItemRequest itemReq : req.getItems()) {
            Product product = productDAO.getById(itemReq.getProductId());
            if (product == null || !product.isActive()) {
                throw new BusinessException("Produk dengan ID " + itemReq.getProductId() + " tidak ditemukan atau tidak aktif", "PRODUCT_NOT_AVAILABLE");
            }
            if (itemReq.getQuantity() <= 0) {
                throw new BusinessException("Jumlah produk '" + product.getName() + "' tidak valid", "INVALID_QUANTITY");
            }
            if (product.getStock() < itemReq.getQuantity()) {
                throw new BusinessException("Stok tidak mencukupi untuk '" + product.getName() + "'. Sisa stok: " + product.getStock(), "INSUFFICIENT_STOCK");
            }

            CartItem cartItem = new CartItem(product, itemReq.getQuantity());
            cartItems.add(cartItem);

            // Step 4: Calculate subtotal
            calculatedSubtotal = calculatedSubtotal.add(cartItem.getSubtotal());
        }

        // Step 5: Calculate discount
        BigDecimal discount = req.getDiscount() != null && req.getDiscount().compareTo(BigDecimal.ZERO) >= 0 ? req.getDiscount() : BigDecimal.ZERO;

        // Step 6: Calculate tax
        BigDecimal tax = req.getTax() != null && req.getTax().compareTo(BigDecimal.ZERO) >= 0 ? req.getTax() : BigDecimal.ZERO;

        // Step 7: Calculate grand total
        BigDecimal grandTotal = calculatedSubtotal.subtract(discount).add(tax);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) {
            grandTotal = BigDecimal.ZERO;
        }

        // Step 8: Validate payment amount
        String paymentMethod = req.getPaymentMethod() != null ? req.getPaymentMethod().toUpperCase() : "CASH";
        BigDecimal cashAmount = req.getCashAmount() != null ? req.getCashAmount() : BigDecimal.ZERO;
        BigDecimal changeAmount = BigDecimal.ZERO;

        if ("CASH".equalsIgnoreCase(paymentMethod)) {
            if (cashAmount.compareTo(grandTotal) < 0) {
                throw new BusinessException("Nominal pembayaran tunai kurang! Total: " + grandTotal + ", Diterima: " + cashAmount, "INSUFFICIENT_PAYMENT");
            }
            changeAmount = cashAmount.subtract(grandTotal);
        } else {
            // Non-cash: payment is full
            cashAmount = grandTotal;
            changeAmount = BigDecimal.ZERO;
        }

        // Step 9: Create Sale object
        Sale sale = new Sale();
        sale.setTransactionNumber(saleDAO.generateTransactionNumber());
        sale.setUserId(cashierUserId);
        sale.setUserName(cashier.getFullName());
        sale.setCustomerId(req.getCustomerId());
        sale.setPackageId(req.getPackageId());
        sale.setSubtotal(calculatedSubtotal);
        sale.setDiscount(discount);
        sale.setTax(tax);
        sale.setTotal(grandTotal);
        sale.setPaymentMethod(paymentMethod);
        sale.setCashAmount(cashAmount);
        sale.setChangeAmount(changeAmount);
        sale.setStatus(Sale.Status.PAID);
        sale.setOrderStatus("SELESAI");

        // Shipping if provided
        Shipping shipping = null;
        if (req.getShipping() != null) {
            shipping = new Shipping();
            shipping.setShippingType(req.getShipping().getShippingType());
            shipping.setShippingStatus("MENUNGGU");
            shipping.setCustomerNotes(req.getShipping().getCustomerNotes());
            shipping.setCourierNotes(req.getShipping().getCourierNotes());
        }

        // Steps 9-13: Execute atomic database operations in SaleDAO
        boolean success = saleDAO.saveTransaction(sale, cartItems, shipping);
        if (!success) {
            throw new BusinessException("Gagal menyimpan transaksi kasir ke database", "TRANSACTION_SAVE_FAILED");
        }

        // Award loyalty points if customer is registered
        if (req.getCustomerId() != null && req.getCustomerId() > 0) {
            int earnedPoints = grandTotal.divideToIntegralValue(new BigDecimal("10000")).intValue();
            if (earnedPoints > 0) {
                customerDAO.addPoints(req.getCustomerId(), earnedPoints);
            }
        }

        // Fetch saved sale with full details
        Sale savedSale = saleDAO.getById(sale.getId());
        return new SaleResponseDto(savedSale);
    }

    public List<SaleResponseDto> searchSalesDtos(LocalDate startDate, LocalDate endDate, String transactionNumber) {
        List<Sale> sales = saleDAO.searchSales(startDate, endDate, transactionNumber);
        return sales.stream().map(SaleResponseDto::new).collect(Collectors.toList());
    }

    public SaleResponseDto getSaleResponseDtoById(int id) {
        Sale sale = saleDAO.getById(id);
        if (sale == null) {
            throw new NotFoundException("Transaksi dengan ID " + id + " tidak ditemukan");
        }
        return new SaleResponseDto(sale);
    }

    public ReceiptDto getReceiptDto(int saleId) {
        Sale sale = saleDAO.getById(saleId);
        if (sale == null) {
            throw new NotFoundException("Transaksi dengan ID " + saleId + " tidak ditemukan");
        }

        ReceiptDto receipt = new ReceiptDto();
        receipt.setTransactionNumber(sale.getTransactionNumber());
        receipt.setTransactionDate(sale.getTransactionDate() != null ? sale.getTransactionDate() : LocalDateTime.now());
        receipt.setCashierName(sale.getUserName());
        receipt.setSubtotal(sale.getSubtotal());
        receipt.setDiscount(sale.getDiscount());
        receipt.setTax(sale.getTax());
        receipt.setTotal(sale.getTotal());
        receipt.setPaymentMethod(sale.getPaymentMethod());
        receipt.setCashAmount(sale.getCashAmount());
        receipt.setChangeAmount(sale.getChangeAmount());
        receipt.setQrCodeContent(sale.getTransactionNumber());

        if (sale.getCustomerId() != null) {
            Customer c = customerDAO.getById(sale.getCustomerId());
            if (c != null) {
                receipt.setCustomerName(c.getName());
            }
        }

        List<ReceiptDto.ReceiptItemDto> items = new ArrayList<>();
        if (sale.getDetails() != null) {
            for (SaleDetail d : sale.getDetails()) {
                items.add(new ReceiptDto.ReceiptItemDto(
                        d.getProductName(),
                        d.getQuantity(),
                        d.getPrice(),
                        d.getSubtotal()
                ));
            }
        }
        receipt.setItems(items);

        return receipt;
    }

    // Preserve legacy Swing processCheckout method
    public String processCheckout(Sale sale, List<CartItem> cartItems, Shipping shipping) {
        if (cartItems == null || cartItems.isEmpty()) {
            return "Keranjang belanja kosong! Silakan pilih produk terlebih dahulu.";
        }

        if (sale.getUserId() <= 0) {
            return "Informasi kasir tidak valid! Silakan login ulang.";
        }

        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            if (item.getQuantity() <= 0) {
                return "Quantity produk '" + p.getName() + "' tidak boleh <= 0!";
            }
            if (p.getStock() < item.getQuantity()) {
                return "Stok tidak mencukupi untuk '" + p.getName() + "'. Sisa stok: " + p.getStock();
            }
        }

        if ("CASH".equalsIgnoreCase(sale.getPaymentMethod())) {
            if (sale.getCashAmount().compareTo(sale.getTotal()) < 0) {
                return "Nominal pembayaran tunai kurang! Total: " + sale.getTotal() + ", Bayar: " + sale.getCashAmount();
            }
        } else {
            sale.setCashAmount(sale.getTotal());
            sale.setChangeAmount(BigDecimal.ZERO);
        }

        boolean success = saleDAO.saveTransaction(sale, cartItems, shipping);
        if (success) {
            if (sale.getCustomerId() != null && sale.getCustomerId() > 0) {
                int earnedPoints = sale.getTotal().divideToIntegralValue(new BigDecimal("10000")).intValue();
                if (earnedPoints > 0) {
                    customerDAO.addPoints(sale.getCustomerId(), earnedPoints);
                }
            }
            return null;
        }
        return "Gagal memproses transaksi ke database!";
    }

    public List<Sale> searchSalesHistory(LocalDate startDate, LocalDate endDate, String transactionNumber) {
        return saleDAO.searchSales(startDate, endDate, transactionNumber);
    }

    public Sale getSaleDetails(int saleId) {
        return saleDAO.getById(saleId);
    }

    public ReportSummary getDashboardSummary() {
        return saleDAO.getDashboardSummary();
    }
}
