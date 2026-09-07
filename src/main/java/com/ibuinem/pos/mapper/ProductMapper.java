package com.ibuinem.pos.mapper;

import com.ibuinem.pos.dto.product.ProductDto;
import com.ibuinem.pos.dto.product.ProductRequest;
import com.ibuinem.pos.model.Product;

public class ProductMapper {

    public static ProductDto toDto(Product p) {
        if (p == null) return null;
        return new ProductDto(p);
    }

    public static Product toEntity(ProductRequest req) {
        if (req == null) return null;
        Product p = new Product();
        p.setCode(req.getCode().trim());
        p.setName(req.getName().trim());
        p.setCategoryId(req.getCategoryId());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock());
        p.setActive(req.isActive());
        return p;
    }

    public static void updateEntity(Product p, ProductRequest req) {
        if (p == null || req == null) return;
        p.setCode(req.getCode().trim());
        p.setName(req.getName().trim());
        p.setCategoryId(req.getCategoryId());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock());
        p.setActive(req.isActive());
    }
}
