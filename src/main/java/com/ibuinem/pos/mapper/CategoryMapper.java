package com.ibuinem.pos.mapper;

import com.ibuinem.pos.dto.category.CategoryDto;
import com.ibuinem.pos.dto.category.CategoryRequest;
import com.ibuinem.pos.model.Category;

public class CategoryMapper {

    public static CategoryDto toDto(Category c) {
        if (c == null) return null;
        return new CategoryDto(c);
    }

    public static Category toEntity(CategoryRequest req) {
        if (req == null) return null;
        Category c = new Category();
        c.setName(req.getName().trim());
        return c;
    }
}
