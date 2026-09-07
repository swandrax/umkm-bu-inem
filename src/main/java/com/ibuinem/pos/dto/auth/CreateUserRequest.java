package com.ibuinem.pos.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CreateUserRequest {

    @NotBlank(message = "Username wajib diisi")
    private String username;

    @NotBlank(message = "Password wajib diisi")
    private String password;

    @NotBlank(message = "Nama lengkap wajib diisi")
    private String fullName;

    @NotBlank(message = "Role wajib diisi (ADMIN atau CASHIER)")
    @Pattern(regexp = "ADMIN|CASHIER", message = "Role harus ADMIN atau CASHIER")
    private String role;

    private boolean active = true;

    public CreateUserRequest() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
