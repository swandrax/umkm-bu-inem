package com.ibuinem.pos.dto.customer;

import com.ibuinem.pos.model.Customer;

import java.time.LocalDateTime;

public class CustomerDto {
    private int id;
    private String name;
    private String phone;
    private String address;
    private int loyaltyPoints;
    private LocalDateTime createdAt;

    public CustomerDto() {}

    public CustomerDto(Customer c) {
        if (c != null) {
            this.id = c.getId();
            this.name = c.getName();
            this.phone = c.getPhone();
            this.address = c.getAddress();
            this.loyaltyPoints = c.getLoyaltyPoints();
            this.createdAt = c.getCreatedAt();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
