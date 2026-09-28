package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.order.*;
import com.ibuinem.pos.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Public: Place a new service order with server-calculated totals
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderDto order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pesanan berhasil dibuat. Silakan lanjutkan pembayaran.", order));
    }

    /**
     * Public: Get order details by orderNumber
     */
    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDto>> getByOrderNumber(@PathVariable String orderNumber) {
        OrderDto order = orderService.getByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Data pesanan berhasil diambil", order));
    }

    /**
     * Public: Real-time status synchronization endpoint for controlled polling
     */
    @GetMapping("/{orderNumber}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderStatus(@PathVariable String orderNumber) {
        OrderDto order = orderService.getByOrderNumber(orderNumber);
        Map<String, Object> statusMap = new HashMap<>();
        statusMap.put("orderNumber", order.getOrderNumber());
        statusMap.put("orderStatus", order.getStatus());
        statusMap.put("paymentStatus", order.getPaymentStatus());
        statusMap.put("paymentMethod", order.getPaymentMethod());
        statusMap.put("totalAmount", order.getTotalAmount());
        statusMap.put("isPaid", "PAID".equalsIgnoreCase(order.getPaymentStatus()));
        statusMap.put("updatedAt", order.getUpdatedAt());
        return ResponseEntity.ok(ApiResponse.success("Status pesanan real-time", statusMap));
    }

    /**
     * Public / Dev / Admin: Simulate QRIS Dummy payment lifecycle
     */
    @PostMapping("/{orderNumber}/simulate-qris")
    public ResponseEntity<ApiResponse<PaymentProofDto>> simulateQris(
            @PathVariable String orderNumber,
            @RequestBody(required = false) Map<String, String> body) {
        String action = body != null && body.containsKey("action") ? body.get("action") : "SUCCESS";
        PaymentProofDto proof = orderService.processDummyQrisSimulation(orderNumber, action);
        return ResponseEntity.ok(ApiResponse.success("Simulasi pembayaran QRIS Demo berhasil diproses", proof));
    }

    /**
     * Cashier / Admin / Public Order Flow: Process Cash payment with change calculation
     */
    @PostMapping("/{orderNumber}/pay-cash")
    public ResponseEntity<ApiResponse<PaymentProofDto>> payCash(
            @PathVariable String orderNumber,
            @Valid @RequestBody CashPaymentRequest request,
            Authentication auth) {
        String operator = auth != null ? auth.getName() : "KASIR_UMKM";
        PaymentProofDto proof = orderService.processCashPayment(orderNumber, request.getAmountReceived(), operator);
        return ResponseEntity.ok(ApiResponse.success("Pembayaran tunai berhasil diverifikasi", proof));
    }

    /**
     * Public: Get payment proof
     */
    @GetMapping("/{orderNumber}/payment-proof")
    public ResponseEntity<ApiResponse<PaymentProofDto>> getPaymentProof(@PathVariable String orderNumber) {
        PaymentProofDto proof = orderService.getPaymentProof(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Bukti pembayaran digital berhasil diambil", proof));
    }

    /**
     * Public: Get printable / thermal digital receipt
     */
    @GetMapping("/{orderNumber}/receipt")
    public ResponseEntity<ApiResponse<DigitalReceiptDto>> getDigitalReceipt(@PathVariable String orderNumber) {
        DigitalReceiptDto receipt = orderService.getDigitalReceipt(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Struk digital berhasil diambil", receipt));
    }

    /**
     * Admin/CRM: Get all orders with filtering and pagination
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        List<OrderDto> orders = orderService.getAll(status, paymentStatus, search, limit, offset);
        return ResponseEntity.ok(ApiResponse.success("Daftar pesanan CRM berhasil diambil", orders));
    }
}
