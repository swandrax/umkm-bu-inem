package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.ShippingDAO;
import com.ibuinem.pos.model.DeliveryLog;
import com.ibuinem.pos.model.Shipping;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShippingService {

    private final ShippingDAO shippingDAO = new ShippingDAO();

    public List<Shipping> getAllShipping() {
        return shippingDAO.getAllShipping();
    }

    public boolean updateStatus(int shippingId, String newStatus, String description) {
        if (shippingId <= 0 || newStatus == null || newStatus.trim().isEmpty()) {
            return false;
        }
        return shippingDAO.updateStatus(shippingId, newStatus, description);
    }

    public List<DeliveryLog> getDeliveryLogs(int shippingId) {
        return shippingDAO.getDeliveryLogs(shippingId);
    }
}
