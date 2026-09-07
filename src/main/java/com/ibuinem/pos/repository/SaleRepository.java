package com.ibuinem.pos.repository;

import com.ibuinem.pos.dao.SaleDAO;
import com.ibuinem.pos.model.CartItem;
import com.ibuinem.pos.model.ReportSummary;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.model.Shipping;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class SaleRepository {

    private final SaleDAO saleDAO = new SaleDAO();

    public String generateTransactionNumber() {
        return saleDAO.generateTransactionNumber();
    }

    public boolean saveTransaction(Sale sale, List<CartItem> cartItems, Shipping shipping) {
        return saleDAO.saveTransaction(sale, cartItems, shipping);
    }

    public List<Sale> searchSales(LocalDate startDate, LocalDate endDate, String transactionNumber) {
        return saleDAO.searchSales(startDate, endDate, transactionNumber);
    }

    public Sale getById(int saleId) {
        return saleDAO.getById(saleId);
    }

    public Sale getByTransactionNumber(String trxNum) {
        return saleDAO.getByTransactionNumber(trxNum);
    }

    public ReportSummary getDashboardSummary() {
        return saleDAO.getDashboardSummary();
    }
}
