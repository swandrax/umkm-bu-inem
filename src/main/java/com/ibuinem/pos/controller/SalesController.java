package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.sales.CheckoutRequest;
import com.ibuinem.pos.dto.sales.ReceiptDto;
import com.ibuinem.pos.dto.sales.SaleResponseDto;
import com.ibuinem.pos.model.User;
import com.ibuinem.pos.service.AuthService;
import com.ibuinem.pos.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
public class SalesController {

    private final SaleService saleService;
    private final AuthService authService;

    public SalesController(SaleService saleService, AuthService authService) {
        this.saleService = saleService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SaleResponseDto>> checkout(@Valid @RequestBody CheckoutRequest req) {
        User currentUser = authService.getCurrentUser();
        int cashierId = currentUser != null ? currentUser.getId() : 1; // Default admin if fallback

        SaleResponseDto response = saleService.checkout(req, cashierId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaksi berhasil diproses", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SaleResponseDto>>> getSales(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String transactionNumber
    ) {
        List<SaleResponseDto> sales = saleService.searchSalesDtos(startDate, endDate, transactionNumber);
        return ResponseEntity.ok(ApiResponse.success("Daftar transaksi berhasil diambil", sales));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SaleResponseDto>> getSaleById(@PathVariable int id) {
        SaleResponseDto sale = saleService.getSaleResponseDtoById(id);
        return ResponseEntity.ok(ApiResponse.success("Detail transaksi berhasil diambil", sale));
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<ApiResponse<ReceiptDto>> getReceipt(@PathVariable int id) {
        ReceiptDto receipt = saleService.getReceiptDto(id);
        return ResponseEntity.ok(ApiResponse.success("Data struk berhasil diambil", receipt));
    }
}
