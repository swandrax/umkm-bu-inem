package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.auth.LoginRequest;
import com.ibuinem.pos.dto.auth.LoginResponse;
import com.ibuinem.pos.dto.auth.UserDto;
import com.ibuinem.pos.dto.auth.RegisterRequest;
import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Pendaftaran akun berhasil", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.success("Login berhasil", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.success("Logout berhasil", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> me() {
        UserDto currentUser = authService.getCurrentUserDto();
        return ResponseEntity.ok(ApiResponse.success("Informasi pengguna saat ini", currentUser));
    }
}
