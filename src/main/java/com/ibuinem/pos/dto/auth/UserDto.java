package com.ibuinem.pos.dto.auth;

import com.ibuinem.pos.model.User;

import java.time.LocalDateTime;

public class UserDto {
    private int id;
    private String username;
    private String fullName;
    private String role;
    private boolean active;
    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(User user) {
        if (user != null) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.fullName = user.getFullName();
            this.role = user.getRole() != null ? user.getRole().name() : null;
            this.active = user.isActive();
            this.createdAt = user.getCreatedAt();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
