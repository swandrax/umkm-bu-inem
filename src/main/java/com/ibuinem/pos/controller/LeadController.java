package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.crm.LeadDto;
import com.ibuinem.pos.dto.crm.LeadRequest;
import com.ibuinem.pos.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    /**
     * Admin/CRM: Get all leads with optional status and search filter
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<LeadDto>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<LeadDto> list = leadService.getAll(status, search);
        return ResponseEntity.ok(ApiResponse.success("Daftar prospek berhasil diambil", list));
    }

    /**
     * Admin/CRM: Get lead by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<LeadDto>> getById(@PathVariable long id) {
        LeadDto lead = leadService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Detail prospek berhasil diambil", lead));
    }

    /**
     * Public or Admin: Create new lead / contact inquiry
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LeadDto>> create(
            @Valid @RequestBody LeadRequest request,
            Authentication auth) {
        String actor = auth != null ? auth.getName() : "PUBLIC_FORM";
        LeadDto created = leadService.create(request, actor);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Prospek/konsultasi Anda telah diterima! Tim kami akan segera menghubungi.", created));
    }

    /**
     * Admin/CRM: Update lead
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<LeadDto>> update(
            @PathVariable long id,
            @Valid @RequestBody LeadRequest request,
            Authentication auth) {
        String actor = auth != null ? auth.getName() : "ADMIN";
        LeadDto updated = leadService.update(id, request, actor);
        return ResponseEntity.ok(ApiResponse.success("Prospek berhasil diperbarui", updated));
    }

    /**
     * Admin/CRM: Update lead pipeline status (Kanban stage transition)
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<LeadDto>> updateStatus(
            @PathVariable long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status baru wajib disertakan", "INVALID_STATUS"));
        }
        String actor = auth != null ? auth.getName() : "ADMIN";
        LeadDto updated = leadService.updateStatus(id, newStatus.toUpperCase().trim(), actor);
        return ResponseEntity.ok(ApiResponse.success("Tahapan prospek berhasil diperbarui", updated));
    }

    /**
     * Admin/CRM: Delete lead
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable long id) {
        leadService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Prospek berhasil dihapus", null));
    }
}
