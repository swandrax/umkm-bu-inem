package com.ibuinem.pos.validation;

import com.ibuinem.pos.exception.BusinessException;
import com.ibuinem.pos.model.CartItem;
import com.ibuinem.pos.model.Product;

import java.util.List;

public class StockValidator {

    public static void validateCartItemsStock(List<CartItem> cartItems) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new BusinessException("Keranjang belanja kosong", "EMPTY_CART");
        }

        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            if (p == null) {
                throw new BusinessException("Item produk tidak valid dalam keranjang", "INVALID_PRODUCT");
            }
            if (item.getQuantity() <= 0) {
                throw new BusinessException("Jumlah produk '" + p.getName() + "' harus lebih dari 0", "INVALID_QUANTITY");
            }
            if (p.getStock() < item.getQuantity()) {
                throw new BusinessException("Stok tidak mencukupi untuk '" + p.getName() + "'. Sisa stok: " + p.getStock(), "INSUFFICIENT_STOCK");
            }
        }
    }
}
