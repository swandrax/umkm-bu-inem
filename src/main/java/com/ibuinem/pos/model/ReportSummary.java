package com.ibuinem.pos.model;

import java.math.BigDecimal;

public class ReportSummary {
    private BigDecimal totalSalesToday;
    private BigDecimal totalRevenue;
    private int totalTransactions;
    private int productsSold;

    public ReportSummary() {
        this.totalSalesToday = BigDecimal.ZERO;
        this.totalRevenue = BigDecimal.ZERO;
        this.totalTransactions = 0;
        this.productsSold = 0;
    }

    public BigDecimal getTotalSalesToday() { return totalSalesToday; }
    public void setTotalSalesToday(BigDecimal totalSalesToday) { this.totalSalesToday = totalSalesToday; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public int getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(int totalTransactions) { this.totalTransactions = totalTransactions; }

    public int getProductsSold() { return productsSold; }
    public void setProductsSold(int productsSold) { this.productsSold = productsSold; }
}
