package com.ibuinem.pos.repository;

import com.ibuinem.pos.dao.CategoryDAO;
import com.ibuinem.pos.model.Category;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategoryRepository {

    private final CategoryDAO categoryDAO = new CategoryDAO();

    public List<Category> getAll() {
        return categoryDAO.getAll();
    }

    public Category getById(int id) {
        return categoryDAO.getById(id);
    }

    public boolean insert(Category category) {
        return categoryDAO.insert(category);
    }

    public boolean update(Category category) {
        return categoryDAO.update(category);
    }

    public boolean delete(int id) {
        return categoryDAO.delete(id);
    }
}
