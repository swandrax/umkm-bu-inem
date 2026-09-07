package com.ibuinem.pos.controller;

import com.ibuinem.pos.dao.PaymentDAO;
import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.model.Payment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentDAO paymentDAO = new PaymentDAO();

    @GetMapping
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        List<Payment> payments = paymentDAO.getAll();
        return ResponseEntity.ok(ApiResponse.success("Data pembayaran berhasil diambil", payments));
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsBySaleId(@PathVariable int saleId) {
        List<Payment> payments = paymentDAO.getBySaleId(saleId);
        return ResponseEntity.ok(ApiResponse.success("Data pembayaran berhasil diambil", payments));
    }
}
