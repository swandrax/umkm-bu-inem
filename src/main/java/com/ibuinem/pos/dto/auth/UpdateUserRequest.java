package com.ibuinem.pos.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateUserRequest {

    @NotBlank(message = "Nama lengkap wajib diisi")
    private String fullName;

    @NotBlank(message = "Role wajib diisi")
    @Pattern(regexp = "SUPER_ADMIN|ADMIN|CASHIER|CUSTOMER", message = "Role tidak valid")
    private String role;

    private boolean active;

    private String newPassword;

    public UpdateUserRequest() {}

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

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
