package com.ibuinem.pos.model;

import java.time.LocalDateTime;

public class Customer {
    private int id;
    private String name;
    private String phone;
    private String address;
    private int loyaltyPoints;
    private LocalDateTime createdAt;

    public Customer() {}

    public Customer(int id, String name, String phone, String address, int loyaltyPoints, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.loyaltyPoints = loyaltyPoints;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public int getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(int loyaltyPoints) { this.loyaltyPoints = loyaltyPoints; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return name + (phone != null && !phone.isEmpty() ? " - " + phone : "") + " (" + loyaltyPoints + " Poin)";
    }
}
