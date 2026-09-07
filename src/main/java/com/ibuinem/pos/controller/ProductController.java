package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.product.ProductDto;
import com.ibuinem.pos.dto.product.ProductRequest;
import com.ibuinem.pos.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "50") Integer limit
    ) {
        List<ProductDto> list = productService.searchProductDtos(search, categoryId, active, sortBy, page, limit);
        int total = productService.countProducts(search, categoryId, active);

        Map<String, Object> meta = new HashMap<>();
        meta.put("page", page);
        meta.put("limit", limit);
        meta.put("total", total);

        return ResponseEntity.ok(ApiResponse.success("Daftar produk berhasil diambil", list, meta));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable int id) {
        ProductDto dto = productService.getProductDtoById(id);
        return ResponseEntity.ok(ApiResponse.success("Detail produk berhasil diambil", dto));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductByCode(@PathVariable String code) {
        ProductDto dto = productService.getProductDtoByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Detail produk berhasil diambil", dto));
    }

    @GetMapping(value = "/{id}/barcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getProductBarcode(@PathVariable int id) {
        byte[] imageBytes = productService.generateBarcodePng(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductRequest req) {
        ProductDto created = productService.createProduct(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Produk berhasil ditambahkan", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@PathVariable int id,
                                                                 @Valid @RequestBody ProductRequest req) {
        ProductDto updated = productService.updateProduct(id, req);
        return ResponseEntity.ok(ApiResponse.success("Produk berhasil diperbarui", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable int id) {
        productService.deleteProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Produk berhasil dinonaktifkan", null));
    }
}
