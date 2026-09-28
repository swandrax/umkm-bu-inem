package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.settings.BusinessSettingsDto;
import com.ibuinem.pos.service.BusinessSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/business-settings")
public class BusinessSettingsController {

    private final BusinessSettingsService businessSettingsService;

    public BusinessSettingsController(BusinessSettingsService businessSettingsService) {
        this.businessSettingsService = businessSettingsService;
    }

    /**
     * Public & Authenticated: Fetch active business identity & configuration
     */
    @GetMapping
    public ResponseEntity<ApiResponse<BusinessSettingsDto>> getSettings() {
        BusinessSettingsDto settings = businessSettingsService.getSettings();
        return ResponseEntity.ok(ApiResponse.success("Pengaturan bisnis berhasil diambil", settings));
    }

    /**
     * Admin only: Update business identity, contact, tax, receipt footer
     */
    @PutMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<BusinessSettingsDto>> updateSettings(@RequestBody BusinessSettingsDto request) {
        BusinessSettingsDto updated = businessSettingsService.updateSettings(request);
        return ResponseEntity.ok(ApiResponse.success("Pengaturan bisnis berhasil diperbarui", updated));
    }
}
