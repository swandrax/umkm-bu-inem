package com.ibuinem.pos.repository;

import com.ibuinem.pos.dao.ShippingDAO;
import com.ibuinem.pos.model.DeliveryLog;
import com.ibuinem.pos.model.Shipping;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ShippingRepository {

    private final ShippingDAO shippingDAO = new ShippingDAO();

    public boolean insert(Shipping shipping, Connection conn) throws SQLException {
        return shippingDAO.insert(shipping, conn);
    }

    public boolean updateStatus(int shippingId, String newStatus, String logDescription) {
        return shippingDAO.updateStatus(shippingId, newStatus, logDescription);
    }

    public List<Shipping> getAllShipping() {
        return shippingDAO.getAllShipping();
    }

    public List<DeliveryLog> getDeliveryLogs(int shippingId) {
        return shippingDAO.getDeliveryLogs(shippingId);
    }
}
