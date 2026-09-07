package com.ibuinem.pos.mapper;

import com.ibuinem.pos.dto.customer.CustomerDto;
import com.ibuinem.pos.dto.customer.CustomerRequest;
import com.ibuinem.pos.model.Customer;

public class CustomerMapper {

    public static CustomerDto toDto(Customer c) {
        if (c == null) return null;
        return new CustomerDto(c);
    }

    public static Customer toEntity(CustomerRequest req) {
        if (req == null) return null;
        Customer c = new Customer();
        c.setName(req.getName().trim());
        c.setPhone(req.getPhone() != null ? req.getPhone().trim() : null);
        c.setAddress(req.getAddress() != null ? req.getAddress().trim() : null);
        c.setLoyaltyPoints(0);
        return c;
    }
}
