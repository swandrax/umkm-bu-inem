package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.AnalyticsDAO;
import com.ibuinem.pos.model.CustomerActivity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AnalyticsService {
    private final AnalyticsDAO analyticsDAO = new AnalyticsDAO();

    public BigDecimal getTotalSales(String filter) {
        return analyticsDAO.getTotalSales(filter);
    }

    public int getTransactionCount(String filter) {
        return analyticsDAO.getTransactionCount(filter);
    }

    public int getProductsSold(String filter) {
        return analyticsDAO.getProductsSold(filter);
    }

    public int getCustomerCount(String filter) {
        return analyticsDAO.getCustomerCount(filter);
    }

    public Map<String, BigDecimal> getDailySalesChartData() {
        return analyticsDAO.getDailySalesChartData();
    }

    public Map<String, Integer> getTopProductsChartData() {
        return analyticsDAO.getTopProductsChartData();
    }

    public Map<String, Integer> getPaymentMethodChartData() {
        return analyticsDAO.getPaymentMethodChartData();
    }

    public List<CustomerActivity> getCustomerActivity(String dateFilter) {
        return analyticsDAO.getCustomerActivity(dateFilter);
    }
}
