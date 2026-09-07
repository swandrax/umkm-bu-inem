package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.category.CategoryDto;
import com.ibuinem.pos.dto.category.CategoryRequest;
import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        List<CategoryDto> list = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Daftar kategori berhasil diambil", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryById(@PathVariable int id) {
        CategoryDto dto = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Detail kategori berhasil diambil", dto));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CategoryRequest req) {
        CategoryDto created = categoryService.createCategory(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Kategori berhasil dibuat", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(@PathVariable int id,
                                                                   @Valid @RequestBody CategoryRequest req) {
        CategoryDto updated = categoryService.updateCategory(id, req);
        return ResponseEntity.ok(ApiResponse.success("Kategori berhasil diperbarui", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Kategori berhasil dihapus", null));
    }
}
