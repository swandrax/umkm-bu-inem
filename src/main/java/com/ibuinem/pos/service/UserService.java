package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.UserDAO;
import com.ibuinem.pos.dto.auth.CreateUserRequest;
import com.ibuinem.pos.dto.auth.UpdateUserRequest;
import com.ibuinem.pos.dto.auth.UserDto;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserDAO userDAO;

    public UserService() {
        this.userDAO = new UserDAO();
    }

    public List<UserDto> getAllUserDtos() {
        return userDAO.getAll().stream().map(UserDto::new).collect(Collectors.toList());
    }

    public UserDto getUserDtoById(int id) {
        User user = userDAO.getById(id);
        if (user == null) {
            throw new NotFoundException("User dengan ID " + id + " tidak ditemukan");
        }
        return new UserDto(user);
    }

    public UserDto createUserFromRequest(CreateUserRequest req) {
        User existing = userDAO.getByUsername(req.getUsername().trim());
        if (existing != null) {
            throw new BusinessException("Username '" + req.getUsername() + "' sudah terdaftar", "USERNAME_ALREADY_EXISTS");
        }

        User user = new User();
        user.setUsername(req.getUsername().trim());
        user.setPassword(req.getPassword());
        user.setFullName(req.getFullName().trim());
        user.setRole(User.Role.valueOf(req.getRole()));
        user.setActive(req.isActive());

        boolean success = userDAO.insert(user);
        if (!success) {
            throw new BusinessException("Gagal menyimpan pengguna baru", "USER_CREATION_FAILED");
        }

        User created = userDAO.getByUsername(user.getUsername());
        return new UserDto(created);
    }

    public UserDto updateUserFromRequest(int id, UpdateUserRequest req) {
        User existing = userDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("User dengan ID " + id + " tidak ditemukan");
        }

        existing.setFullName(req.getFullName().trim());
        existing.setRole(User.Role.valueOf(req.getRole()));
        existing.setActive(req.isActive());

        boolean updated = userDAO.update(existing);
        if (!updated) {
            throw new BusinessException("Gagal memperbarui pengguna", "USER_UPDATE_FAILED");
        }

        if (req.getNewPassword() != null && !req.getNewPassword().trim().isEmpty()) {
            userDAO.resetPassword(id, req.getNewPassword().trim());
        }

        return new UserDto(userDAO.getById(id));
    }

    public void deleteUser(int id) {
        User existing = userDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("User dengan ID " + id + " tidak ditemukan");
        }
        // Soft delete toggle active to false
        userDAO.toggleActive(id, false);
    }

    // Preserve legacy Swing methods
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
