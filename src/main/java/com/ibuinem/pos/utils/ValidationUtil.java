package com.ibuinem.pos.utils;

import java.math.BigDecimal;

public class ValidationUtil {

    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static boolean isPositiveNumber(String str) {
        if (isEmpty(str)) return false;
        try {
            double val = Double.parseDouble(str);
            return val >= 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean isPositiveInteger(String str) {
        if (isEmpty(str)) return false;
        try {
            int val = Integer.parseInt(str);
            return val >= 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean isGreaterThanZero(BigDecimal val) {
        return val != null && val.compareTo(BigDecimal.ZERO) > 0;
    }
}
