package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.crm.CrmDashboardDto;
import com.ibuinem.pos.model.CrmActivity;
import com.ibuinem.pos.service.CrmService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/crm")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class CrmController {

    private final CrmService crmService;

    public CrmController(CrmService crmService) {
        this.crmService = crmService;
    }

    /**
     * CRM Dashboard metrics: Leads, conversions, pipeline, revenue, retention indicators
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<CrmDashboardDto>> getDashboardMetrics() {
        CrmDashboardDto metrics = crmService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success("Metrik CRM berhasil diambil", metrics));
    }

    /**
     * Recent CRM activities timeline
     */
    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<CrmActivity>>> getRecentActivities(
            @RequestParam(defaultValue = "20") int limit) {
        List<CrmActivity> activities = crmService.getRecentActivities(limit);
        return ResponseEntity.ok(ApiResponse.success("Aktivitas CRM berhasil diambil", activities));
    }

    /**
     * Customer 360 Activity timeline
     */
    @GetMapping("/customers/{customerId}/activities")
    public ResponseEntity<ApiResponse<List<CrmActivity>>> getCustomerActivities(
            @PathVariable int customerId) {
        List<CrmActivity> activities = crmService.getCustomerActivities(customerId);
        return ResponseEntity.ok(ApiResponse.success("Riwayat interaksi pelanggan berhasil diambil", activities));
    }
}
