package com.ibuinem.pos.controller;

import com.ibuinem.pos.dao.AnalyticsDAO;
import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.product.ProductDto;
import com.ibuinem.pos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsDAO analyticsDAO = new AnalyticsDAO();
    private final ProductService productService;

    public AnalyticsController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardAnalytics(
            @RequestParam(required = false, defaultValue = "Hari Ini") String filter
    ) {
        Map<String, Object> dashboard = new HashMap<>();

        BigDecimal todaySales = analyticsDAO.getTotalSales("Hari Ini");
        int todayTransactions = analyticsDAO.getTransactionCount("Hari Ini");
        int productsSold = analyticsDAO.getProductsSold("Hari Ini");
        int customers = analyticsDAO.getCustomerCount("Semua");

        dashboard.put("todaySales", todaySales);
        dashboard.put("todayTransactions", todayTransactions);
        dashboard.put("productsSold", productsSold);
        dashboard.put("customerCount", customers);
        dashboard.put("apiStatus", "ONLINE");

        // Charts
        dashboard.put("dailySalesTrend", analyticsDAO.getDailySalesChartData());
        dashboard.put("topProducts", analyticsDAO.getTopProductsChartData());
        dashboard.put("paymentMethodStats", analyticsDAO.getPaymentMethodChartData());

        // Low stock alerts
        List<ProductDto> lowStock = productService.searchProductDtos(null, 0, true, "Stok", 1, 10);
        dashboard.put("lowStockProducts", lowStock);

        return ResponseEntity.ok(ApiResponse.success("Data analytics dashboard berhasil diambil", dashboard));
    }
}
