package com.ibuinem.pos.utils;

import com.ibuinem.pos.model.Sale;

import java.io.File;
import java.util.List;

public class ExportUtil {

    public static boolean exportToPdf(List<Sale> sales, String title, File outputFile) {
        return PdfExporter.exportSalesReportToPdf(sales, title, outputFile);
    }

    public static boolean exportToExcel(List<Sale> sales, String filePath) {
        return ExcelExporter.exportSalesToExcel(sales, filePath);
    }

    public static boolean exportToCsv(List<Sale> sales, String filePath) {
        return ExcelExporter.exportSalesToCsv(sales, filePath);
    }
}
