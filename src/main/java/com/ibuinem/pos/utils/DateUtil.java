package com.ibuinem.pos.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public static String formatDateTime(LocalDateTime ldt) {
        if (ldt == null) return "-";
        return ldt.format(DATETIME_FORMATTER);
    }

    public static String formatDate(LocalDateTime ldt) {
        if (ldt == null) return "-";
        return ldt.format(DATE_FORMATTER);
    }

    public static String formatTime(LocalDateTime ldt) {
        if (ldt == null) return "-";
        return ldt.format(TIME_FORMATTER);
    }
}
