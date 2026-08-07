package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.UserDAO;
import com.ibuinem.pos.model.User;

public class AuthService {

    private final UserDAO userDAO = new UserDAO();

    public User login(String username, String password) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return null;
        }
        return userDAO.authenticate(username.trim(), password);
    }
}
