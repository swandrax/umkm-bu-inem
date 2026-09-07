package com.ibuinem.pos.repository;

import com.ibuinem.pos.dao.CustomerDAO;
import com.ibuinem.pos.model.Customer;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class CustomerRepository {

    private final CustomerDAO customerDAO = new CustomerDAO();

    public List<Customer> getAll() {
        return customerDAO.getAll();
    }

    public Customer getById(int id) {
        return customerDAO.getById(id);
    }

    public Customer getByPhone(String phone) {
        return customerDAO.getByPhone(phone);
    }

    public boolean insert(Customer customer) {
        return customerDAO.insert(customer);
    }

    public boolean update(Customer customer) {
        return customerDAO.update(customer);
    }

    public boolean delete(int id) {
        return customerDAO.delete(id);
    }

    public boolean addPoints(int customerId, int pointsToAdd) {
        return customerDAO.addPoints(customerId, pointsToAdd);
    }

    public List<Customer> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return customerDAO.getAll();
        }
        String lower = keyword.trim().toLowerCase();
        return customerDAO.getAll().stream()
                .filter(c -> (c.getName() != null && c.getName().toLowerCase().contains(lower)) ||
                             (c.getPhone() != null && c.getPhone().contains(lower)))
                .collect(Collectors.toList());
    }
}
