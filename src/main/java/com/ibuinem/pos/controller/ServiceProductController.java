package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.service.ServiceProductDto;
import com.ibuinem.pos.dto.service.ServiceProductRequest;
import com.ibuinem.pos.service.ServiceProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class ServiceProductController {

    private final ServiceProductService serviceProductService;

    public ServiceProductController(ServiceProductService serviceProductService) {
        this.serviceProductService = serviceProductService;
    }

    /**
     * Public & Authenticated: List service products with optional filtering
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceProductDto>>> getAll(
            @RequestParam(required = false) Boolean onlyActive,
            @RequestParam(required = false) Integer categoryId) {
        List<ServiceProductDto> services = serviceProductService.getAll(onlyActive, categoryId);
        return ResponseEntity.ok(ApiResponse.success("Daftar layanan berhasil diambil", services));
    }

    /**
     * Public & Authenticated: Get service product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceProductDto>> getById(@PathVariable long id) {
        ServiceProductDto service = serviceProductService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Detail layanan berhasil diambil", service));
    }

    /**
     * Public & Authenticated: Get service product by SEO slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ServiceProductDto>> getBySlug(@PathVariable String slug) {
        ServiceProductDto service = serviceProductService.getBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Detail layanan berhasil diambil", service));
    }

    /**
     * Admin only: Create new service product
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ServiceProductDto>> create(@Valid @RequestBody ServiceProductRequest request) {
        ServiceProductDto created = serviceProductService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Layanan baru berhasil ditambahkan", created));
    }

    /**
     * Admin only: Update service product
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ServiceProductDto>> update(
            @PathVariable long id,
            @Valid @RequestBody ServiceProductRequest request) {
        ServiceProductDto updated = serviceProductService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Layanan berhasil diperbarui", updated));
    }

    /**
     * Admin only: Delete service product
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable long id) {
        serviceProductService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Layanan berhasil dihapus", null));
    }
}
