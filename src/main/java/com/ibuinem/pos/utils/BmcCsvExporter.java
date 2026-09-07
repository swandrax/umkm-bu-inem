package com.ibuinem.pos.utils;

import com.ibuinem.pos.config.DatabaseConfig;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;

/**
 * Utility exporter to produce high-detail CSV data specifically formatted for
 * Business Model Canvas (BMC) and Weekly Business Analytics.
 */
public class BmcCsvExporter {

    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static byte[] exportWeeklyBmcCsv(LocalDate startDate, LocalDate endDate) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Write UTF-8 BOM so Excel & spreadsheet tools decode characters seamlessly
        try {
            baos.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
        } catch (Exception ignored) {}

        try (PrintWriter pw = new PrintWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {
            // Write CSV Header designed for Business Model Canvas (BMC) & Weekly Analytics
            pw.println(
                "No_Transaksi,Waktu_Transaksi,Tanggal,Hari,Minggu_Ke,Kasir," +
                "Segmen_Pelanggan,Nama_Pelanggan,Kontak_Pelanggan,Kategori_Produk," +
                "Kode_Produk,Nama_Produk,Harga_Satuan,Harga_Modal,Margin_Unit," +
                "Qty_Terjual,Subtotal_Penjualan,Laba_Kotor_Item,Diskon_Transaksi," +
                "Total_Transaksi,Metode_Pembayaran,Status_Pembayaran,Paket_Layanan"
            );

            String sql = 
                "SELECT s.transaction_number, s.transaction_date, u.full_name AS cashier_name, " +
                "       c.name AS customer_name, c.phone AS customer_phone, " +
                "       cat.name AS category_name, p.code AS product_code, " +
                "       sd.product_name, sd.price AS item_price, COALESCE(p.cost_price, 0) AS cost_price, " +
                "       sd.quantity, sd.subtotal AS item_subtotal, " +
                "       s.discount, s.total AS grand_total, s.payment_method, s.status, " +
                "       pkg.name AS package_name " +
                "FROM sales s " +
                "LEFT JOIN users u ON s.user_id = u.id " +
                "LEFT JOIN customers c ON s.customer_id = c.id " +
                "LEFT JOIN packages pkg ON s.package_id = pkg.id " +
                "JOIN sale_details sd ON s.id = sd.sale_id " +
                "LEFT JOIN products p ON sd.product_id = p.id " +
                "LEFT JOIN categories cat ON p.category_id = cat.id " +
                "WHERE 1=1 ";

            if (startDate != null) {
                sql += "AND s.transaction_date >= ? ";
            }
            if (endDate != null) {
                sql += "AND s.transaction_date <= ? ";
            }
            sql += "ORDER BY s.transaction_date DESC, sd.id ASC";

            try (Connection conn = DatabaseConfig.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {

                int paramIdx = 1;
                if (startDate != null) {
                    ps.setTimestamp(paramIdx++, Timestamp.valueOf(startDate.atStartOfDay()));
                }
                if (endDate != null) {
                    ps.setTimestamp(paramIdx++, Timestamp.valueOf(endDate.atTime(LocalTime.MAX)));
                }

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        String trxNum = rs.getString("transaction_number");
                        Timestamp ts = rs.getTimestamp("transaction_date");
                        LocalDateTime dt = ts != null ? ts.toLocalDateTime() : LocalDateTime.now();

                        String dtStr = dt.format(DATETIME_FMT);
                        String dStr = dt.format(DATE_FMT);
                        String dayName = getIndonesianDayName(dt.getDayOfWeek());
                        int weekOfYear = dt.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

                        String cashier = rs.getString("cashier_name");
                        String custName = rs.getString("customer_name");
                        String custPhone = rs.getString("customer_phone");
                        String segment = (custName != null && !custName.trim().isEmpty()) ? "Pelanggan Terdaftar" : "Pelanggan Umum / Walk-in";
                        if (custName == null || custName.trim().isEmpty()) custName = "Umum / Walk-in";
                        if (custPhone == null || custPhone.trim().isEmpty()) custPhone = "-";

                        String catName = rs.getString("category_name");
                        if (catName == null || catName.trim().isEmpty()) catName = "Umum";

                        String prodCode = rs.getString("product_code");
                        if (prodCode == null) prodCode = "-";

                        String prodName = rs.getString("product_name");
                        BigDecimal itemPrice = rs.getBigDecimal("item_price");
                        if (itemPrice == null) itemPrice = BigDecimal.ZERO;

                        BigDecimal costPrice = rs.getBigDecimal("cost_price");
                        if (costPrice == null) costPrice = BigDecimal.ZERO;

                        BigDecimal marginUnit = itemPrice.subtract(costPrice);
                        int qty = rs.getInt("quantity");

                        BigDecimal itemSubtotal = rs.getBigDecimal("item_subtotal");
                        if (itemSubtotal == null) itemSubtotal = itemPrice.multiply(BigDecimal.valueOf(qty));

                        BigDecimal grossProfit = marginUnit.multiply(BigDecimal.valueOf(qty));

                        BigDecimal discount = rs.getBigDecimal("discount");
                        if (discount == null) discount = BigDecimal.ZERO;

                        BigDecimal grandTotal = rs.getBigDecimal("grand_total");
                        if (grandTotal == null) grandTotal = BigDecimal.ZERO;

                        String paymentMethod = rs.getString("payment_method");
                        String status = rs.getString("status");
                        String pkgName = rs.getString("package_name");
                        if (pkgName == null || pkgName.trim().isEmpty()) pkgName = "Standar/Reguler";

                        pw.println(String.format(
                            "%s,%s,%s,%s,%d,%s,%s,%s,%s,%s,%s,%s,%.2f,%.2f,%.2f,%d,%.2f,%.2f,%.2f,%.2f,%s,%s,%s",
                            escapeCsv(trxNum),
                            escapeCsv(dtStr),
                            escapeCsv(dStr),
                            escapeCsv(dayName),
                            weekOfYear,
                            escapeCsv(cashier),
                            escapeCsv(segment),
                            escapeCsv(custName),
                            escapeCsv(custPhone),
                            escapeCsv(catName),
                            escapeCsv(prodCode),
                            escapeCsv(prodName),
                            itemPrice.doubleValue(),
                            costPrice.doubleValue(),
                            marginUnit.doubleValue(),
                            qty,
                            itemSubtotal.doubleValue(),
                            grossProfit.doubleValue(),
                            discount.doubleValue(),
                            grandTotal.doubleValue(),
                            escapeCsv(paymentMethod),
                            escapeCsv(status),
                            escapeCsv(pkgName)
                        ));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }

            pw.flush();
            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    private static String escapeCsv(String val) {
        if (val == null) return "";
        String clean = val.replace("\"", "\"\"");
        if (clean.contains(",") || clean.contains("\"") || clean.contains("\n") || clean.contains("\r")) {
            return "\"" + clean + "\"";
        }
        return clean;
    }

    private static String getIndonesianDayName(DayOfWeek dow) {
        switch (dow) {
            case MONDAY: return "Senin";
            case TUESDAY: return "Selasa";
            case WEDNESDAY: return "Rabu";
            case THURSDAY: return "Kamis";
            case FRIDAY: return "Jumat";
            case SATURDAY: return "Sabtu";
            case SUNDAY: return "Minggu";
            default: return dow.name();
        }
    }
}
