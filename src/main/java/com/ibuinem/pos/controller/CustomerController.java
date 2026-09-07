package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.customer.CustomerDto;
import com.ibuinem.pos.dto.customer.CustomerRequest;
import com.ibuinem.pos.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerDto>>> getAllCustomers() {
        List<CustomerDto> list = customerService.getAllCustomerDtos();
        return ResponseEntity.ok(ApiResponse.success("Daftar pelanggan berhasil diambil", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto>> getCustomerById(@PathVariable int id) {
        CustomerDto dto = customerService.getCustomerDtoById(id);
        return ResponseEntity.ok(ApiResponse.success("Detail pelanggan berhasil diambil", dto));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<ApiResponse<CustomerDto>> getCustomerByPhone(@PathVariable String phone) {
        CustomerDto dto = customerService.getCustomerDtoByPhone(phone);
        return ResponseEntity.ok(ApiResponse.success("Detail pelanggan berhasil diambil", dto));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerDto>> createCustomer(@Valid @RequestBody CustomerRequest req) {
        CustomerDto created = customerService.createCustomer(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Data pelanggan berhasil disimpan", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto>> updateCustomer(@PathVariable int id,
                                                                   @Valid @RequestBody CustomerRequest req) {
        CustomerDto updated = customerService.updateCustomer(id, req);
        return ResponseEntity.ok(ApiResponse.success("Data pelanggan berhasil diperbarui", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable int id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Data pelanggan berhasil dihapus", null));
    }
}
