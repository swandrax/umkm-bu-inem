package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.CategoryDAO;
import com.ibuinem.pos.dto.category.CategoryDto;
import com.ibuinem.pos.dto.category.CategoryRequest;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.Category;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryDAO categoryDAO = new CategoryDAO();

    public List<CategoryDto> getAllCategories() {
        return categoryDAO.getAll().stream().map(CategoryDto::new).collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(int id) {
        Category c = categoryDAO.getById(id);
        if (c == null) {
            throw new NotFoundException("Kategori dengan ID " + id + " tidak ditemukan");
        }
        return new CategoryDto(c);
    }

    public CategoryDto createCategory(CategoryRequest req) {
        Category c = new Category();
        c.setName(req.getName().trim());
        c.setDescription(req.getDescription() != null ? req.getDescription().trim() : null);

        boolean inserted = categoryDAO.insert(c);
        if (!inserted) {
            throw new BusinessException("Gagal menambahkan kategori baru", "CATEGORY_CREATION_FAILED");
        }
        return new CategoryDto(c);
    }

    public CategoryDto updateCategory(int id, CategoryRequest req) {
        Category existing = categoryDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("Kategori dengan ID " + id + " tidak ditemukan");
        }

        existing.setName(req.getName().trim());
        existing.setDescription(req.getDescription() != null ? req.getDescription().trim() : null);

        boolean updated = categoryDAO.update(existing);
        if (!updated) {
            throw new BusinessException("Gagal memperbarui kategori", "CATEGORY_UPDATE_FAILED");
        }
        return new CategoryDto(existing);
    }

    public void deleteCategory(int id) {
        Category existing = categoryDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("Kategori dengan ID " + id + " tidak ditemukan");
        }
        boolean deleted = categoryDAO.delete(id);
        if (!deleted) {
            throw new BusinessException("Gagal menghapus kategori. Pastikan tidak ada produk terkait.", "CATEGORY_DELETE_FAILED");
        }
    }
}
