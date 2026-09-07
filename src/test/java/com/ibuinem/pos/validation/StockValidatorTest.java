package com.ibuinem.pos.validation;

import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.model.CartItem;
import com.ibuinem.pos.model.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class StockValidatorTest {

    @Test
    @DisplayName("Should throw BusinessException when cart items list is empty")
    void shouldThrowExceptionWhenCartIsEmpty() {
        assertThrows(BusinessException.class, () -> StockValidator.validateCartItemsStock(Collections.emptyList()));
        assertThrows(BusinessException.class, () -> StockValidator.validateCartItemsStock(null));
    }

    @Test
    @DisplayName("Should throw BusinessException when quantity is zero or negative")
    void shouldThrowExceptionWhenQuantityInvalid() {
        Product p = new Product();
        p.setId(1);
        p.setName("Lemper Ayam");
        p.setStock(10);
        p.setPrice(new BigDecimal("3500"));

        List<CartItem> items = new ArrayList<>();
        items.add(new CartItem(p, 0));

        BusinessException ex = assertThrows(BusinessException.class, () -> StockValidator.validateCartItemsStock(items));
        assertEquals("INVALID_QUANTITY", ex.getErrorCode());
    }

    @Test
    @DisplayName("Should throw BusinessException when requested quantity exceeds available stock")
    void shouldThrowExceptionWhenStockInsufficient() {
        Product p = new Product();
        p.setId(2);
        p.setName("Lumpia Basah");
        p.setStock(5);
        p.setPrice(new BigDecimal("4000"));

        List<CartItem> items = new ArrayList<>();
        items.add(new CartItem(p, 10)); // Requesting 10 but stock is only 5

        BusinessException ex = assertThrows(BusinessException.class, () -> StockValidator.validateCartItemsStock(items));
        assertEquals("INSUFFICIENT_STOCK", ex.getErrorCode());
    }

    @Test
    @DisplayName("Should pass validation when stock is sufficient")
    void shouldPassWhenStockIsSufficient() {
        Product p = new Product();
        p.setId(3);
        p.setName("Kue Pastel");
        p.setStock(20);
        p.setPrice(new BigDecimal("3000"));

        List<CartItem> items = new ArrayList<>();
        items.add(new CartItem(p, 5));

        assertDoesNotThrow(() -> StockValidator.validateCartItemsStock(items));
    }
}
