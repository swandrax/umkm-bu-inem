package com.ibuinem.pos.mapper;

import com.ibuinem.pos.dto.product.ProductDto;
import com.ibuinem.pos.dto.product.ProductRequest;
import com.ibuinem.pos.model.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProductMapperTest {

    @Test
    @DisplayName("Should convert ProductRequest to Product entity correctly")
    void testToEntity() {
        ProductRequest req = new ProductRequest();
        req.setCode("SNK-001");
        req.setName("Lemper Ayam Spesial");
        req.setCategoryId(1);
        req.setPrice(new BigDecimal("3500"));
        req.setStock(50);
        req.setActive(true);

        Product p = ProductMapper.toEntity(req);
        assertNotNull(p);
        assertEquals("SNK-001", p.getCode());
        assertEquals("Lemper Ayam Spesial", p.getName());
        assertEquals(1, p.getCategoryId());
        assertEquals(new BigDecimal("3500"), p.getPrice());
        assertEquals(50, p.getStock());
        assertTrue(p.isActive());
    }

    @Test
    @DisplayName("Should convert Product entity to ProductDto correctly")
    void testToDto() {
        Product p = new Product();
        p.setId(10);
        p.setCode("SNK-010");
        p.setName("Risol Mayo");
        p.setCategoryId(2);
        p.setCategoryName("Gorengan");
        p.setPrice(new BigDecimal("4000"));
        p.setStock(25);
        p.setActive(true);

        ProductDto dto = ProductMapper.toDto(p);
        assertNotNull(dto);
        assertEquals(10, dto.getId());
        assertEquals("SNK-010", dto.getCode());
        assertEquals("Risol Mayo", dto.getName());
        assertEquals(2, dto.getCategoryId());
        assertEquals("Gorengan", dto.getCategoryName());
        assertEquals(new BigDecimal("4000"), dto.getPrice());
        assertEquals(25, dto.getStock());
        assertTrue(dto.isActive());
    }
}
