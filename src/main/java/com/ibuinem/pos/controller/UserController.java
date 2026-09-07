package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.auth.CreateUserRequest;
import com.ibuinem.pos.dto.auth.UpdateUserRequest;
import com.ibuinem.pos.dto.auth.UserDto;
import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUserDtos();
        return ResponseEntity.ok(ApiResponse.success("Daftar pengguna berhasil diambil", users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable int id) {
        UserDto user = userService.getUserDtoById(id);
        return ResponseEntity.ok(ApiResponse.success("Detail pengguna berhasil diambil", user));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody CreateUserRequest req) {
        UserDto created = userService.createUserFromRequest(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pengguna berhasil dibuat", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable int id,
                                                           @Valid @RequestBody UpdateUserRequest req) {
        UserDto updated = userService.updateUserFromRequest(id, req);
        return ResponseEntity.ok(ApiResponse.success("Pengguna berhasil diperbarui", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Pengguna berhasil dinonaktifkan", null));
    }
}
