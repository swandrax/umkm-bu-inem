package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.model.DeliveryLog;
import com.ibuinem.pos.model.Shipping;
import com.ibuinem.pos.service.ShippingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/shipping")
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Shipping>>> getAllShipping() {
        List<Shipping> list = shippingService.getAllShipping();
        return ResponseEntity.ok(ApiResponse.success("Daftar pengiriman berhasil diambil", list));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<ApiResponse<List<DeliveryLog>>> getDeliveryLogs(@PathVariable int id) {
        List<DeliveryLog> logs = shippingService.getDeliveryLogs(id);
        return ResponseEntity.ok(ApiResponse.success("Log pengiriman berhasil diambil", logs));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(@PathVariable int id,
                                                          @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String description = body.getOrDefault("description", "Status diperbarui");

        boolean success = shippingService.updateStatus(id, status, description);
        if (!success) {
            throw new BusinessException("Gagal memperbarui status pengiriman", "SHIPPING_UPDATE_FAILED");
        }

        return ResponseEntity.ok(ApiResponse.success("Status pengiriman berhasil diperbarui", null));
    }
}
