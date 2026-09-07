package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.CustomerDAO;
import com.ibuinem.pos.dto.customer.CustomerDto;
import com.ibuinem.pos.dto.customer.CustomerRequest;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.Customer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    private final CustomerDAO customerDAO = new CustomerDAO();

    public List<CustomerDto> getAllCustomerDtos() {
        return customerDAO.getAll().stream().map(CustomerDto::new).collect(Collectors.toList());
    }

    public CustomerDto getCustomerDtoById(int id) {
        Customer c = customerDAO.getById(id);
        if (c == null) {
            throw new NotFoundException("Pelanggan dengan ID " + id + " tidak ditemukan");
        }
        return new CustomerDto(c);
    }

    public CustomerDto getCustomerDtoByPhone(String phone) {
        Customer c = customerDAO.getByPhone(phone);
        if (c == null) {
            throw new NotFoundException("Pelanggan dengan nomor telepon " + phone + " tidak ditemukan");
        }
        return new CustomerDto(c);
    }

    public CustomerDto createCustomer(CustomerRequest req) {
        if (req.getPhone() != null && !req.getPhone().trim().isEmpty()) {
            Customer existing = customerDAO.getByPhone(req.getPhone().trim());
            if (existing != null) {
                return new CustomerDto(existing);
            }
        }

        Customer c = new Customer();
        c.setName(req.getName().trim());
        c.setPhone(req.getPhone() != null ? req.getPhone().trim() : null);
        c.setAddress(req.getAddress() != null ? req.getAddress().trim() : null);

        boolean success = customerDAO.insert(c);
        if (!success) {
            throw new BusinessException("Gagal menambahkan pelanggan baru", "CUSTOMER_INSERT_FAILED");
        }

        return new CustomerDto(c);
    }

    public CustomerDto updateCustomer(int id, CustomerRequest req) {
        Customer existing = customerDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("Pelanggan dengan ID " + id + " tidak ditemukan");
        }

        existing.setName(req.getName().trim());
        existing.setPhone(req.getPhone() != null ? req.getPhone().trim() : null);
        existing.setAddress(req.getAddress() != null ? req.getAddress().trim() : null);

        boolean success = customerDAO.update(existing);
        if (!success) {
            throw new BusinessException("Gagal memperbarui pelanggan", "CUSTOMER_UPDATE_FAILED");
        }

        return new CustomerDto(existing);
    }

    public void deleteCustomer(int id) {
        Customer existing = customerDAO.getById(id);
        if (existing == null) {
            throw new NotFoundException("Pelanggan dengan ID " + id + " tidak ditemukan");
        }
        boolean success = customerDAO.delete(id);
        if (!success) {
            throw new BusinessException("Gagal menghapus data pelanggan", "CUSTOMER_DELETE_FAILED");
        }
    }

    // Preserve legacy Swing methods
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
