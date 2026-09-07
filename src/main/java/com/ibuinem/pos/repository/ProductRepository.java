package com.ibuinem.pos.repository;

import com.ibuinem.pos.dao.ProductDAO;
import com.ibuinem.pos.model.Product;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ProductRepository {

    private final ProductDAO productDAO = new ProductDAO();

    public List<Product> getAll() {
        return productDAO.getAll();
    }

    public Product getById(int id) {
        return productDAO.getById(id);
    }

    public Product getByCode(String code) {
        return productDAO.getByCode(code);
    }

    public boolean insert(Product product) {
        return productDAO.insert(product);
    }

    public boolean update(Product product) {
        return productDAO.update(product);
    }

    public boolean delete(int id) {
        return productDAO.delete(id);
    }

    public boolean hardDelete(int id) {
        return productDAO.hardDelete(id);
    }

    public boolean updateStock(Connection conn, int productId, int quantityDeduction) throws SQLException {
        return productDAO.updateStock(conn, productId, quantityDeduction);
    }

    public List<Product> search(String keyword, int categoryId, boolean onlyActive, String sortBy) {
        return productDAO.search(keyword, categoryId, onlyActive, sortBy);
    }

    public List<Product> getLowStockProducts(int threshold) {
        return productDAO.getLowStockProducts(threshold);
    }
}
