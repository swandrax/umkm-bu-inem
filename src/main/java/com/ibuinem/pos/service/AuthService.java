package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.UserDAO;
import com.ibuinem.pos.dto.auth.LoginRequest;
import com.ibuinem.pos.dto.auth.LoginResponse;
import com.ibuinem.pos.dto.auth.UserDto;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.model.User;
import com.ibuinem.pos.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserDAO userDAO = new UserDAO();
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthService() {
        this.jwtService = null;
        this.passwordEncoder = null;
    }

    public LoginResponse authenticate(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            throw new BadCredentialsException("Username dan password tidak boleh kosong");
        }

        User user = userDAO.getByUsername(request.getUsername().trim());
        if (user == null || !user.isActive()) {
            throw new BadCredentialsException("Username atau password salah");
        }

        if (passwordEncoder != null) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Username atau password salah");
            }
        } else {
            if (!request.getPassword().equals(user.getPassword())) {
                throw new BadCredentialsException("Username atau password salah");
            }
        }

        if (jwtService == null) {
            throw new BusinessException("JWT Service tidak terkonfigurasi");
        }

        String token = jwtService.generateToken(user);
        long expiresIn = jwtService.getExpirationMs();

        return new LoginResponse(token, expiresIn, new UserDto(user));
    }

    public LoginResponse register(com.ibuinem.pos.dto.auth.RegisterRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null || request.getFullName() == null) {
            throw new com.ibuinem.pos.exception.ValidationException("Semua bidang formulir wajib diisi");
        }

        String username = request.getUsername().trim().toLowerCase();
        User existing = userDAO.getByUsername(username);
        if (existing != null) {
            throw new com.ibuinem.pos.exception.ValidationException("Username '" + username + "' sudah digunakan. Silakan gunakan username lain.");
        }

        String encodedPassword = passwordEncoder != null ? passwordEncoder.encode(request.getPassword()) : request.getPassword();

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(encodedPassword);
        newUser.setFullName(request.getFullName().trim());
        newUser.setRole(User.Role.CASHIER);
        newUser.setActive(true);

        boolean inserted = userDAO.insert(newUser);
        if (!inserted) {
            throw new BusinessException("Gagal mendaftarkan akun ke database");
        }

        User created = userDAO.getByUsername(username);
        if (created == null) {
            created = newUser;
        }

        String token = jwtService != null ? jwtService.generateToken(created) : "TOKEN";
        long expiresIn = jwtService != null ? jwtService.getExpirationMs() : 86400000;

        return new LoginResponse(token, expiresIn, new UserDto(created));
    }

    public UserDto getCurrentUserDto() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadCredentialsException("Pengguna tidak terautentikasi");
        }

        String username = auth.getName();
        User user = userDAO.getByUsername(username);
        if (user == null) {
            throw new BadCredentialsException("Pengguna tidak ditemukan");
        }

        return new UserDto(user);
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userDAO.getByUsername(auth.getName());
    }

    // Preserve legacy Swing signature
    public User login(String username, String password) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return null;
        }
        return userDAO.authenticate(username.trim(), password);
    }
}
