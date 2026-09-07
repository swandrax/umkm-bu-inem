package com.ibuinem.pos.repository;

import com.ibuinem.pos.dao.UserDAO;
import com.ibuinem.pos.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    private final UserDAO userDAO = new UserDAO();

    public User authenticate(String username, String password) {
        return userDAO.authenticate(username, password);
    }

    public List<User> getAll() {
        return userDAO.getAll();
    }

    public User getById(int id) {
        return userDAO.getById(id);
    }

    public User getByUsername(String username) {
        return userDAO.getByUsername(username);
    }

    public boolean insert(User user) {
        return userDAO.insert(user);
    }

    public boolean update(User user) {
        return userDAO.update(user);
    }

    public boolean toggleActive(int id, boolean active) {
        return userDAO.toggleActive(id, active);
    }

    public boolean resetPassword(int id, String newPassword) {
        return userDAO.resetPassword(id, newPassword);
    }
}
