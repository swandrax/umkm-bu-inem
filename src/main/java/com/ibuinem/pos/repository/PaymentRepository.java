package com.ibuinem.pos.repository;

import com.ibuinem.pos.dao.PaymentDAO;
import com.ibuinem.pos.model.Payment;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@Repository
public class PaymentRepository {

    private final PaymentDAO paymentDAO = new PaymentDAO();

    public boolean insert(Connection conn, Payment payment) throws SQLException {
        return paymentDAO.insert(conn, payment);
    }

    public List<Payment> getBySaleId(int saleId) {
        return paymentDAO.getBySaleId(saleId);
    }
}
