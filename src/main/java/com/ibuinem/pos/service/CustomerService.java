package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.CustomerDAO;
import com.ibuinem.pos.model.Customer;

import java.util.List;

public class CustomerService {
    private final CustomerDAO customerDAO = new CustomerDAO();

    public List<Customer> getAll() {
        return customerDAO.getAll();
    }

    public Customer getById(int id) {
        return customerDAO.getById(id);
    }

    public boolean addCustomer(Customer customer) {
        return customerDAO.insert(customer);
    }
}
