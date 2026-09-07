package com.ibuinem.pos.dto.customer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CustomerRequest {

    @NotBlank(message = "Nama pelanggan wajib diisi")
    @Size(max = 150, message = "Nama pelanggan maksimal 150 karakter")
    private String name;

    @Size(max = 20, message = "Nomor telepon maksimal 20 karakter")
    private String phone;

    private String address;

    public CustomerRequest() {}

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
}
