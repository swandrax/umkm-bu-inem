package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.UserDAO;
import com.ibuinem.pos.model.User;

import java.util.List;

public class UserService {

    private final UserDAO userDAO;

    public UserService() {
        this.userDAO = new UserDAO();
    }

    public List<User> getAllUsers() {
        return userDAO.getAll();
    }

    public User getUserById(int id) {
        return userDAO.getById(id);
    }

    public boolean createUser(User user) {
        if (user == null || user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return false;
        }
        return userDAO.insert(user);
    }

    public boolean updateUser(User user) {
        if (user == null || user.getId() <= 0) {
            return false;
        }
        return userDAO.update(user);
    }

    public boolean resetPassword(int userId, String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return false;
        }
        return userDAO.resetPassword(userId, newPassword);
    }

    public boolean toggleActive(int userId, boolean active) {
        return userDAO.toggleActive(userId, active);
    }
}
