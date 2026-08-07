package com.ibuinem.pos.utils;

import com.ibuinem.pos.model.CustomerActivity;
import com.ibuinem.pos.model.Sale;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ExcelExporter {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static boolean exportSalesToExcel(List<Sale> sales, String filePath) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Laporan Penjualan");

            // Header
            Row headerRow = sheet.createRow(0);
            String[] headers = {"No", "No Transaksi", "Tanggal", "Kasir", "Subtotal", "Diskon", "Total", "Metode", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Data
            int rowNum = 1;
            for (Sale s : sales) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(rowNum - 1);
                row.createCell(1).setCellValue(s.getTransactionNumber());
                row.createCell(2).setCellValue(s.getTransactionDate().format(DATE_FORMATTER));
                row.createCell(3).setCellValue(s.getUserName());
                row.createCell(4).setCellValue(s.getSubtotal().doubleValue());
                row.createCell(5).setCellValue(s.getDiscount().doubleValue());
                row.createCell(6).setCellValue(s.getTotal().doubleValue());
                row.createCell(7).setCellValue(s.getPaymentMethod());
                row.createCell(8).setCellValue(s.getStatus().name());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
                workbook.write(fileOut);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean exportSalesToCsv(List<Sale> sales, String filePath) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath))) {
            writer.println("No,No Transaksi,Tanggal,Kasir,Subtotal,Diskon,Total,Metode,Status");
            int i = 1;
            for (Sale s : sales) {
                writer.printf("%d,%s,%s,%s,%f,%f,%f,%s,%s%n",
                        i++,
                        s.getTransactionNumber(),
                        s.getTransactionDate().format(DATE_FORMATTER),
                        s.getUserName().replace(",", ""), // basic escape
                        s.getSubtotal().doubleValue(),
                        s.getDiscount().doubleValue(),
                        s.getTotal().doubleValue(),
                        s.getPaymentMethod(),
                        s.getStatus().name());
            }
            return true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean exportCustomerActivityToExcel(List<CustomerActivity> activities, String filePath) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Customer Activity");

            // Header
            Row headerRow = sheet.createRow(0);
            String[] headers = {"No", "Tanggal", "Nama Customer", "Phone", "Alamat", "Items", "Qty", "Total", "Paket", "Pembayaran", "Status", "Pengiriman", "Catatan"};
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            // Data
            int rowNum = 1;
            for (CustomerActivity a : activities) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(rowNum - 1);
                row.createCell(1).setCellValue(a.getTransactionDate().format(DATE_FORMATTER));
                row.createCell(2).setCellValue(a.getCustomerName());
                row.createCell(3).setCellValue(a.getPhone());
                row.createCell(4).setCellValue(a.getAddress());
                row.createCell(5).setCellValue(a.getTotalItems());
                row.createCell(6).setCellValue(a.getTotalProducts());
                row.createCell(7).setCellValue(a.getTotalPayment().doubleValue());
                row.createCell(8).setCellValue(a.getPackageName());
                row.createCell(9).setCellValue(a.getPaymentMethod());
                row.createCell(10).setCellValue(a.getPaymentStatus());
                row.createCell(11).setCellValue(a.getShippingType());
                row.createCell(12).setCellValue(a.getCourierNotes());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
                workbook.write(fileOut);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
