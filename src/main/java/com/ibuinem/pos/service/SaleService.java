package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.CustomerDAO;
import com.ibuinem.pos.dao.SaleDAO;
import com.ibuinem.pos.model.CartItem;
import com.ibuinem.pos.model.Product;
import com.ibuinem.pos.model.ReportSummary;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.model.Shipping;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class SaleService {

    private final SaleDAO saleDAO = new SaleDAO();
    private final CustomerDAO customerDAO = new CustomerDAO();

    public String generateTransactionNumber() {
        return saleDAO.generateTransactionNumber();
    }

    public String processCheckout(Sale sale, List<CartItem> cartItems, Shipping shipping) {
        if (cartItems == null || cartItems.isEmpty()) {
            return "Keranjang belanja kosong! Silakan pilih produk terlebih dahulu.";
        }

        if (sale.getUserId() <= 0) {
            return "Informasi kasir tidak valid! Silakan login ulang.";
        }

        // Validate cart items and stock
        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            if (item.getQuantity() <= 0) {
                return "Quantity produk '" + p.getName() + "' tidak boleh <= 0!";
            }
            if (p.getStock() < item.getQuantity()) {
                return "Stok tidak mencukupi untuk '" + p.getName() + "'. Sisa stok: " + p.getStock();
            }
        }

        // Validate Cash payment
        if ("CASH".equalsIgnoreCase(sale.getPaymentMethod())) {
            if (sale.getCashAmount().compareTo(sale.getTotal()) < 0) {
                return "Nominal pembayaran tunai kurang! Total: " + sale.getTotal() + ", Bayar: " + sale.getCashAmount();
            }
        } else {
            // Non-cash payment (QRIS, Debit, E-Wallet, etc.) -> Status Lunas, Change = 0
            sale.setCashAmount(sale.getTotal());
            sale.setChangeAmount(BigDecimal.ZERO);
        }

        boolean success = saleDAO.saveTransaction(sale, cartItems, shipping);
        if (success) {
            // Automatically award loyalty points if customer is selected (1 point per Rp 10,000)
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
