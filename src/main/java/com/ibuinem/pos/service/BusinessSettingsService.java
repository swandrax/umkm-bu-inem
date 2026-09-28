package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.BusinessSettingsDAO;
import com.ibuinem.pos.dto.settings.BusinessSettingsDto;
import com.ibuinem.pos.model.BusinessSettings;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class BusinessSettingsService {

    private final BusinessSettingsDAO businessSettingsDAO = new BusinessSettingsDAO();

    public BusinessSettingsDto getSettings() {
        BusinessSettings settings = businessSettingsDAO.getSettings();
        return toDto(settings);
    }

    public BusinessSettingsDto updateSettings(BusinessSettingsDto dto) {
        BusinessSettings settings = new BusinessSettings();
        settings.setId(dto.getId() > 0 ? dto.getId() : 1);
        settings.setBusinessName(dto.getBusinessName() != null ? dto.getBusinessName().trim() : "UMKM Bu Inem");
        settings.setTagline(dto.getTagline());
        settings.setDescription(dto.getDescription());
        settings.setAddress(dto.getAddress());
        settings.setPhone(dto.getPhone());
        settings.setWhatsapp(dto.getWhatsapp());
        settings.setEmail(dto.getEmail());
        settings.setCustomerServiceEmail(dto.getCustomerServiceEmail());
        settings.setLogoUrl(dto.getLogoUrl());
        settings.setWebsite(dto.getWebsite());
        settings.setTaxRate(dto.getTaxRate() != null && dto.getTaxRate().compareTo(BigDecimal.ZERO) >= 0 ? dto.getTaxRate() : BigDecimal.ZERO);
        settings.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "IDR");
        settings.setReceiptFooter(dto.getReceiptFooter());
        settings.setSocialMedia(dto.getSocialMedia());

        boolean success = businessSettingsDAO.updateSettings(settings);
        if (!success) {
            throw new RuntimeException("Gagal menyimpan pengaturan bisnis");
        }
        return getSettings();
    }

    public BusinessSettingsDto toDto(BusinessSettings s) {
        BusinessSettingsDto dto = new BusinessSettingsDto();
        dto.setId(s.getId());
        dto.setBusinessName(s.getBusinessName());
        dto.setTagline(s.getTagline());
        dto.setDescription(s.getDescription());
        dto.setAddress(s.getAddress());
        dto.setPhone(s.getPhone());
        dto.setWhatsapp(s.getWhatsapp());
        dto.setEmail(s.getEmail());
        dto.setCustomerServiceEmail(s.getCustomerServiceEmail());
        dto.setLogoUrl(s.getLogoUrl());
        dto.setWebsite(s.getWebsite());
        dto.setTaxRate(s.getTaxRate());
        dto.setCurrency(s.getCurrency());
        dto.setReceiptFooter(s.getReceiptFooter());
        dto.setSocialMedia(s.getSocialMedia());
        return dto;
    }
}
