package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.CategoryDAO;
import com.ibuinem.pos.dao.ProductDAO;
import com.ibuinem.pos.model.Category;
import com.ibuinem.pos.model.Product;

import java.math.BigDecimal;
import java.util.List;

public class ProductService {

    private final ProductDAO productDAO = new ProductDAO();
    private final CategoryDAO categoryDAO = new CategoryDAO();

    public List<Product> getAllProducts() {
        return productDAO.getAll();
    }

    public List<Product> getActiveProducts() {
        return productDAO.getAllActive();
    }

    public List<Product> searchProducts(String query, int categoryId, boolean onlyActive, String sortBy) {
        return productDAO.search(query, categoryId, onlyActive, sortBy);
    }

    public List<Product> searchProducts(String query, int categoryId, boolean onlyActive) {
        return searchProducts(query, categoryId, onlyActive, "Nama");
    }

    public List<Category> getAllCategories() {
        return categoryDAO.getAll();
    }

    public String saveProduct(Product product) {
        // Validation rules
        if (product.getCode() == null || product.getCode().trim().isEmpty()) {
            return "Kode produk tidak boleh kosong!";
        }
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return "Nama produk tidak boleh kosong!";
        }
        if (product.getCategoryId() <= 0) {
            return "Pilih kategori produk yang valid!";
        }
        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            return "Harga produk tidak boleh minus!";
        }
        if (product.getStock() < 0) {
            return "Stok produk tidak boleh minus!";
        }

        if (product.getId() == 0) {
            // Check code uniqueness for new product
            Product existing = productDAO.getByCode(product.getCode().trim());
            if (existing != null) {
                return "Kode produk '" + product.getCode() + "' sudah terdaftar!";
            }
            boolean success = productDAO.insert(product);
            return success ? null : "Gagal menambahkan produk ke database!";
        } else {
            // Check code uniqueness for update
            Product existing = productDAO.getByCode(product.getCode().trim());
            if (existing != null && existing.getId() != product.getId()) {
                return "Kode produk '" + product.getCode() + "' sudah digunakan oleh produk lain!";
            }
            boolean success = productDAO.update(product);
            return success ? null : "Gagal mengupdate produk di database!";
        }
    }

    public String deleteProduct(int productId) {
        boolean success = productDAO.delete(productId);
        return success ? null : "Gagal menghapus produk!";
    }

    public List<Product> getLowStockProducts(int threshold) {
        return productDAO.getLowStockProducts(threshold);
    }
}
