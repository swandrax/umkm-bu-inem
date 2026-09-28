package com.ibuinem.pos.dto.crm;

import com.ibuinem.pos.model.CrmActivity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CrmDashboardDto {
    private long totalCustomers;
    private long activeLeads;
    private long newLeads;
    private long qualifiedLeads;
    private long wonDeals;
    private long totalOrders;
    private long paidOrders;
    private long unpaidOrders;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private BigDecimal totalDiscounts = BigDecimal.ZERO;
    private Map<String, Long> paymentMethods = new HashMap<>();
    private List<CrmActivity> recentActivities = new ArrayList<>();

    public CrmDashboardDto() {}

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getActiveLeads() { return activeLeads; }
    public void setActiveLeads(long activeLeads) { this.activeLeads = activeLeads; }

    public long getNewLeads() { return newLeads; }
    public void setNewLeads(long newLeads) { this.newLeads = newLeads; }

    public long getQualifiedLeads() { return qualifiedLeads; }
    public void setQualifiedLeads(long qualifiedLeads) { this.qualifiedLeads = qualifiedLeads; }

    public long getWonDeals() { return wonDeals; }
    public void setWonDeals(long wonDeals) { this.wonDeals = wonDeals; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPaidOrders() { return paidOrders; }
    public void setPaidOrders(long paidOrders) { this.paidOrders = paidOrders; }

    public long getUnpaidOrders() { return unpaidOrders; }
    public void setUnpaidOrders(long unpaidOrders) { this.unpaidOrders = unpaidOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getTotalDiscounts() { return totalDiscounts; }
    public void setTotalDiscounts(BigDecimal totalDiscounts) { this.totalDiscounts = totalDiscounts; }

    public Map<String, Long> getPaymentMethods() { return paymentMethods; }
    public void setPaymentMethods(Map<String, Long> paymentMethods) { this.paymentMethods = paymentMethods; }

    public List<CrmActivity> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<CrmActivity> recentActivities) { this.recentActivities = recentActivities; }
}
