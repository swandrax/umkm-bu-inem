package com.ibuinem.pos.service;

import com.ibuinem.pos.barcode.BarcodeGenerator;
import com.ibuinem.pos.dao.CategoryDAO;
import com.ibuinem.pos.dao.ProductDAO;
import com.ibuinem.pos.dto.product.ProductDto;
import com.ibuinem.pos.dto.product.ProductRequest;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.Category;
import com.ibuinem.pos.model.Product;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductDAO productDAO = new ProductDAO();
    private final CategoryDAO categoryDAO = new CategoryDAO();

    public List<ProductDto> searchProductDtos(String query, Integer categoryId, Boolean onlyActive, String sortBy, Integer page, Integer limit) {
        int catId = categoryId != null ? categoryId : 0;
        boolean activeOnly = onlyActive != null ? onlyActive : false;
        String sort = sortBy != null ? sortBy : "Nama";

        List<Product> products = productDAO.search(query, catId, activeOnly, sort);
        List<ProductDto> dtos = products.stream().map(ProductDto::new).collect(Collectors.toList());

        if (page != null && limit != null && page > 0 && limit > 0) {
            int fromIndex = (page - 1) * limit;
            if (fromIndex >= dtos.size()) {
                return List.of();
            }
            int toIndex = Math.min(fromIndex + limit, dtos.size());
            return dtos.subList(fromIndex, toIndex);
        }
        return dtos;
    }

    public int countProducts(String query, Integer categoryId, Boolean onlyActive) {
        int catId = categoryId != null ? categoryId : 0;
        boolean activeOnly = onlyActive != null ? onlyActive : false;
        return productDAO.search(query, catId, activeOnly, "Nama").size();
    }

    public ProductDto getProductDtoById(int id) {
        Product p = productDAO.getById(id);
        if (p == null) {
            throw new NotFoundException("Produk dengan ID " + id + " tidak ditemukan");
        }
        return new ProductDto(p);
    }

    public ProductDto getProductDtoByCode(String code) {
        Product p = productDAO.getByCode(code);
        if (p == null) {
            throw new NotFoundException("Produk dengan kode " + code + " tidak ditemukan");
        }
        return new ProductDto(p);
    }

    public ProductDto createProduct(ProductRequest req) {
        Product existing = productDAO.getByCode(req.getCode().trim());
        if (existing != null) {
            throw new BusinessException("Kode produk '" + req.getCode() + "' sudah terdaftar!", "DUPLICATE_PRODUCT_CODE");
        }

        Category cat = categoryDAO.getById(req.getCategoryId());
        if (cat == null) {
            throw new BusinessException("Kategori tidak valid", "INVALID_CATEGORY");
        }

        Product p = new Product();
        p.setCode(req.getCode().trim());
        p.setName(req.getName().trim());
        p.setCategoryId(req.getCategoryId());
        p.setCategoryName(cat.getName());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock());
        p.setActive(req.isActive());

        boolean success = productDAO.insert(p);
        if (!success) {
            throw new BusinessException("Gagal menambahkan produk ke database!", "PRODUCT_INSERT_FAILED");
        }

        return new ProductDto(productDAO.getById(p.getId()));
    }

    public ProductDto updateProduct(int id, ProductRequest req) {
        Product existing = productDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("Produk dengan ID " + id + " tidak ditemukan");
        }

        Product codeOwner = productDAO.getByCode(req.getCode().trim());
        if (codeOwner != null && codeOwner.getId() != id) {
            throw new BusinessException("Kode produk '" + req.getCode() + "' sudah digunakan produk lain!", "DUPLICATE_PRODUCT_CODE");
        }

        Category cat = categoryDAO.getById(req.getCategoryId());
        if (cat == null) {
            throw new BusinessException("Kategori tidak valid", "INVALID_CATEGORY");
        }

        existing.setCode(req.getCode().trim());
        existing.setName(req.getName().trim());
        existing.setCategoryId(req.getCategoryId());
        existing.setCategoryName(cat.getName());
        existing.setPrice(req.getPrice());
        existing.setStock(req.getStock());
        existing.setActive(req.isActive());

        boolean success = productDAO.update(existing);
        if (!success) {
            throw new BusinessException("Gagal memperbarui produk", "PRODUCT_UPDATE_FAILED");
        }

        return new ProductDto(productDAO.getById(id));
    }

    public void deleteProductById(int id) {
        Product existing = productDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("Produk dengan ID " + id + " tidak ditemukan");
        }
        // Soft delete toggle active to false or hard delete
        existing.setActive(false);
        productDAO.update(existing);
    }

    public byte[] generateBarcodePng(int productId) {
        Product p = productDAO.getById(productId);
        if (p == null) {
            throw new NotFoundException("Produk dengan ID " + productId + " tidak ditemukan");
        }

        BufferedImage img = BarcodeGenerator.generateBarcode(p.getCode(), 300, 100);
        if (img == null) {
            throw new BusinessException("Gagal mengenerate barcode untuk kode: " + p.getCode());
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(img, "PNG", baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new BusinessException("Gagal mengonversi barcode image: " + e.getMessage());
        }
    }

    // Preserve existing legacy/Swing methods
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
            Product existing = productDAO.getByCode(product.getCode().trim());
            if (existing != null) {
                return "Kode produk '" + product.getCode() + "' sudah terdaftar!";
            }
            boolean success = productDAO.insert(product);
            return success ? null : "Gagal menambahkan produk ke database!";
        } else {
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
