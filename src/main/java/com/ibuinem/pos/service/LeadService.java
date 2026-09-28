package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.CrmActivityDAO;
import com.ibuinem.pos.dao.CustomerDAO;
import com.ibuinem.pos.dao.LeadDAO;
import com.ibuinem.pos.dto.crm.LeadDto;
import com.ibuinem.pos.dto.crm.LeadRequest;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.CrmActivity;
import com.ibuinem.pos.model.Customer;
import com.ibuinem.pos.model.Lead;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeadService {

    private final LeadDAO leadDAO = new LeadDAO();
    private final CustomerDAO customerDAO = new CustomerDAO();
    private final CrmActivityDAO crmActivityDAO = new CrmActivityDAO();

    public List<LeadDto> getAll(String status, String search) {
        return leadDAO.getAll(status, search).stream().map(this::toDto).collect(Collectors.toList());
    }

    public LeadDto getById(long id) {
        Lead lead = leadDAO.getById(id);
        if (lead == null) {
            throw new NotFoundException("Prospek/Lead dengan ID " + id + " tidak ditemukan");
        }
        return toDto(lead);
    }

    public LeadDto create(LeadRequest req, String actor) {
        Lead lead = new Lead();
        lead.setName(req.getName().trim());
        lead.setEmail(req.getEmail() != null ? req.getEmail().trim() : null);
        lead.setPhone(req.getPhone() != null ? req.getPhone().trim() : null);
        lead.setSource(req.getSource() != null ? req.getSource() : "WEBSITE");
        lead.setServiceInterest(req.getServiceInterest());
        lead.setEstimatedValue(req.getEstimatedValue() != null ? req.getEstimatedValue() : BigDecimal.ZERO);
        lead.setStatus(req.getStatus() != null ? req.getStatus() : "NEW");
        lead.setAssignedTo(req.getAssignedTo());
        lead.setNotes(req.getNotes());

        // Associate or find customer if exists by phone
        if (req.getCustomerId() != null && req.getCustomerId() > 0) {
            lead.setCustomerId(req.getCustomerId());
        } else if (lead.getPhone() != null && !lead.getPhone().isBlank()) {
            Customer existingCustomer = customerDAO.getByPhone(lead.getPhone());
            if (existingCustomer != null) {
                lead.setCustomerId(existingCustomer.getId());
            }
        }

        boolean ok = leadDAO.insert(lead);
        if (!ok) {
            throw new BusinessException("Gagal menambahkan prospek", "INSERT_LEAD_FAILED");
        }

        // Record CRM Activity
        crmActivityDAO.insert(new CrmActivity(
                lead.getCustomerId(),
                lead.getId(),
                null,
                "LEAD_CREATED",
                "Prospek baru masuk: " + lead.getName(),
                "Minat layanan: " + (lead.getServiceInterest() != null ? lead.getServiceInterest() : "-") + " via " + lead.getSource(),
                actor != null ? actor : "WEBSITE"
        ));

        return toDto(lead);
    }

    public LeadDto update(long id, LeadRequest req, String actor) {
        Lead lead = leadDAO.getById(id);
        if (lead == null) {
            throw new NotFoundException("Prospek tidak ditemukan");
        }
        String oldStatus = lead.getStatus();
        lead.setName(req.getName().trim());
        lead.setEmail(req.getEmail());
        lead.setPhone(req.getPhone());
        lead.setSource(req.getSource());
        lead.setServiceInterest(req.getServiceInterest());
        if (req.getEstimatedValue() != null) lead.setEstimatedValue(req.getEstimatedValue());
        if (req.getStatus() != null) lead.setStatus(req.getStatus());
        lead.setAssignedTo(req.getAssignedTo());
        lead.setNotes(req.getNotes());
        if (req.getCustomerId() != null) lead.setCustomerId(req.getCustomerId());

        boolean ok = leadDAO.update(lead);
        if (!ok) {
            throw new BusinessException("Gagal memperbarui prospek", "UPDATE_LEAD_FAILED");
        }

        if (req.getStatus() != null && !req.getStatus().equalsIgnoreCase(oldStatus)) {
            crmActivityDAO.insert(new CrmActivity(
                    lead.getCustomerId(),
                    lead.getId(),
                    null,
                    "STATUS_CHANGED",
                    "Status prospek diubah: " + oldStatus + " -> " + lead.getStatus(),
                    "Diperbarui oleh: " + (actor != null ? actor : "ADMIN"),
                    actor != null ? actor : "ADMIN"
            ));
        }

        return toDto(lead);
    }

    public LeadDto updateStatus(long id, String newStatus, String actor) {
        Lead lead = leadDAO.getById(id);
        if (lead == null) {
            throw new NotFoundException("Prospek tidak ditemukan");
        }
        String oldStatus = lead.getStatus();
        leadDAO.updateStatus(id, newStatus);
        lead.setStatus(newStatus);

        crmActivityDAO.insert(new CrmActivity(
                lead.getCustomerId(),
                lead.getId(),
                null,
                "STATUS_CHANGED",
                "Tahap prospek dialihkan ke: " + newStatus,
                "Sebelumnya: " + oldStatus + " (Diperbarui oleh: " + (actor != null ? actor : "ADMIN") + ")",
                actor != null ? actor : "ADMIN"
        ));

        return toDto(lead);
    }

    public void delete(long id) {
        boolean ok = leadDAO.delete(id);
        if (!ok) {
            throw new NotFoundException("Prospek tidak ditemukan untuk dihapus");
        }
    }

    public LeadDto toDto(Lead l) {
        LeadDto dto = new LeadDto();
        dto.setId(l.getId());
        dto.setCustomerId(l.getCustomerId());
        dto.setName(l.getName());
        dto.setEmail(l.getEmail());
        dto.setPhone(l.getPhone());
        dto.setSource(l.getSource());
        dto.setServiceInterest(l.getServiceInterest());
        dto.setEstimatedValue(l.getEstimatedValue());
        dto.setStatus(l.getStatus());
        dto.setAssignedTo(l.getAssignedTo());
        dto.setNotes(l.getNotes());
        dto.setCreatedAt(l.getCreatedAt());
        dto.setUpdatedAt(l.getUpdatedAt());
        return dto;
    }
}
