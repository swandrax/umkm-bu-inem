package com.ibuinem.pos.utils;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class CurrencyUtil {

    private static final Locale INDONESIA = Locale.of("id", "ID");
    private static final NumberFormat CURRENCY_FORMAT = NumberFormat.getCurrencyInstance(INDONESIA);

    static {
        CURRENCY_FORMAT.setMaximumFractionDigits(0);
        CURRENCY_FORMAT.setMinimumFractionDigits(0);
    }

    public static String formatRupiah(BigDecimal amount) {
        if (amount == null) return "Rp 0";
        return CURRENCY_FORMAT.format(amount).replace("Rp", "Rp ");
    }

    public static String formatRupiah(double amount) {
        return formatRupiah(BigDecimal.valueOf(amount));
    }

    public static BigDecimal parseRupiah(String input) {
        if (input == null || input.trim().isEmpty()) return BigDecimal.ZERO;
        String clean = input.replaceAll("[^0-9]", "");
        if (clean.isEmpty()) return BigDecimal.ZERO;
        return new BigDecimal(clean);
    }
}
