package com.ibuinem.pos.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Username wajib diisi")
    @Size(min = 3, max = 50, message = "Username minimal 3 karakter dan maksimal 50 karakter")
    private String username;

    @NotBlank(message = "Password wajib diisi")
    @Size(min = 4, message = "Password minimal 4 karakter")
    private String password;

    @NotBlank(message = "Nama lengkap wajib diisi")
    private String fullName;

    public RegisterRequest() {}

    public RegisterRequest(String username, String password, String fullName) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
    }

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
}
