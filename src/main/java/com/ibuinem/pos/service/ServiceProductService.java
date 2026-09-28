package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.ServiceProductDAO;
import com.ibuinem.pos.dto.service.ServiceProductDto;
import com.ibuinem.pos.dto.service.ServiceProductRequest;
import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.exception.NotFoundException;
import com.ibuinem.pos.model.ServiceProduct;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceProductService {

    private final ServiceProductDAO serviceProductDAO = new ServiceProductDAO();

    public List<ServiceProductDto> getAll(Boolean onlyActive, Integer categoryId) {
        return serviceProductDAO.getAll(onlyActive, categoryId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ServiceProductDto getById(long id) {
        ServiceProduct sp = serviceProductDAO.getById(id);
        if (sp == null) {
            throw new NotFoundException("Layanan dengan ID " + id + " tidak ditemukan");
        }
        return toDto(sp);
    }

    public ServiceProductDto getBySlug(String slug) {
        ServiceProduct sp = serviceProductDAO.getBySlug(slug);
        if (sp == null) {
            throw new NotFoundException("Layanan dengan slug '" + slug + "' tidak ditemukan");
        }
        return toDto(sp);
    }

    public ServiceProductDto create(ServiceProductRequest req) {
        ServiceProduct sp = new ServiceProduct();
        sp.setName(req.getName().trim());
        String slug = req.getSlug() != null && !req.getSlug().isBlank()
                ? generateSlug(req.getSlug())
                : generateSlug(req.getName());
        sp.setSlug(slug);
        sp.setShortDescription(req.getShortDescription());
        sp.setFullDescription(req.getFullDescription());
        sp.setCategoryId(req.getCategoryId());
        sp.setBasePrice(req.getBasePrice() != null ? req.getBasePrice() : BigDecimal.ZERO);
        sp.setDiscountType(req.getDiscountType());
        sp.setDiscountValue(req.getDiscountValue() != null ? req.getDiscountValue() : BigDecimal.ZERO);
        sp.setFinalPrice(calculateFinalPrice(sp.getBasePrice(), sp.getDiscountType(), sp.getDiscountValue()));
        sp.setDuration(req.getDuration());
        sp.setFeatures(req.getFeatures());
        sp.setActive(req.getActive() != null ? req.getActive() : true);
        sp.setFeatured(req.getFeatured() != null ? req.getFeatured() : false);
        sp.setImageUrl(req.getImageUrl());

        boolean ok = serviceProductDAO.insert(sp);
        if (!ok) {
            throw new BusinessException("Gagal menambahkan layanan baru", "INSERT_FAILED");
        }
        return toDto(sp);
    }

    public ServiceProductDto update(long id, ServiceProductRequest req) {
        ServiceProduct sp = serviceProductDAO.getById(id);
        if (sp == null) {
            throw new NotFoundException("Layanan tidak ditemukan");
        }
        if (req.getName() != null) sp.setName(req.getName().trim());
        if (req.getSlug() != null && !req.getSlug().isBlank()) {
            sp.setSlug(generateSlug(req.getSlug()));
        }
        sp.setShortDescription(req.getShortDescription());
        sp.setFullDescription(req.getFullDescription());
        sp.setCategoryId(req.getCategoryId());
        if (req.getBasePrice() != null) sp.setBasePrice(req.getBasePrice());
        sp.setDiscountType(req.getDiscountType());
        sp.setDiscountValue(req.getDiscountValue() != null ? req.getDiscountValue() : BigDecimal.ZERO);
        sp.setFinalPrice(calculateFinalPrice(sp.getBasePrice(), sp.getDiscountType(), sp.getDiscountValue()));
        sp.setDuration(req.getDuration());
        if (req.getFeatures() != null) sp.setFeatures(req.getFeatures());
        if (req.getActive() != null) sp.setActive(req.getActive());
        if (req.getFeatured() != null) sp.setFeatured(req.getFeatured());
        if (req.getImageUrl() != null) sp.setImageUrl(req.getImageUrl());

        boolean ok = serviceProductDAO.update(sp);
        if (!ok) {
            throw new BusinessException("Gagal memperbarui layanan", "UPDATE_FAILED");
        }
        return toDto(sp);
    }

    public void delete(long id) {
        boolean ok = serviceProductDAO.delete(id);
        if (!ok) {
            throw new NotFoundException("Layanan dengan ID " + id + " tidak ditemukan untuk dihapus");
        }
    }

    public BigDecimal calculateFinalPrice(BigDecimal basePrice, String discountType, BigDecimal discountValue) {
        if (basePrice == null || basePrice.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (discountType == null || discountValue == null || discountValue.compareTo(BigDecimal.ZERO) <= 0) {
            return basePrice;
        }

        BigDecimal discountAmount;
        if ("PERCENTAGE".equalsIgnoreCase(discountType)) {
            BigDecimal percent = discountValue.min(BigDecimal.valueOf(100)).max(BigDecimal.ZERO);
            discountAmount = basePrice.multiply(percent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if ("FIXED".equalsIgnoreCase(discountType)) {
            discountAmount = discountValue.min(basePrice).max(BigDecimal.ZERO);
        } else {
            discountAmount = BigDecimal.ZERO;
        }

        BigDecimal finalPrice = basePrice.subtract(discountAmount);
        return finalPrice.compareTo(BigDecimal.ZERO) > 0 ? finalPrice : BigDecimal.ZERO;
    }

    public String generateSlug(String input) {
        if (input == null) return "layanan";
        return input.trim().toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    public ServiceProductDto toDto(ServiceProduct sp) {
        ServiceProductDto dto = new ServiceProductDto();
        dto.setId(sp.getId());
        dto.setSlug(sp.getSlug());
        dto.setName(sp.getName());
        dto.setShortDescription(sp.getShortDescription());
        dto.setFullDescription(sp.getFullDescription());
        dto.setCategoryId(sp.getCategoryId());
        dto.setCategoryName(sp.getCategoryName());
        dto.setBasePrice(sp.getBasePrice());
        dto.setDiscountType(sp.getDiscountType());
        dto.setDiscountValue(sp.getDiscountValue());
        dto.setFinalPrice(sp.getFinalPrice());
        dto.setDuration(sp.getDuration());
        dto.setFeatures(sp.getFeatures());
        dto.setActive(sp.isActive());
        dto.setFeatured(sp.isFeatured());
        dto.setImageUrl(sp.getImageUrl());
        return dto;
    }
}
