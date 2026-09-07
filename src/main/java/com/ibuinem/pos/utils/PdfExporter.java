package com.ibuinem.pos.utils;

import com.ibuinem.pos.model.Sale;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PdfExporter {

    public static boolean exportSalesReportToPdf(List<Sale> sales, String title, File outputFile) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                float margin = 40;
                float startY = page.getMediaBox().getHeight() - margin;
                float y = startY;

                // Title Header
                contentStream.setFont(fontBold, 18);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, y);
                contentStream.showText("JAJANAN IBU INEM - LAPORAN PENJUALAN");
                contentStream.endText();
                y -= 25;

                contentStream.setFont(fontRegular, 11);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, y);
                contentStream.showText("Periode: " + title + " | Tanggal Cetak: " + DateUtil.formatDateTime(LocalDateTime.now()));
                contentStream.endText();
                y -= 30;

                // Summary Statistics
                BigDecimal totalRevenue = BigDecimal.ZERO;
                int count = sales.size();
                for (Sale s : sales) {
                    if (s.getStatus() == Sale.Status.PAID) {
                        totalRevenue = totalRevenue.add(s.getTotal());
                    }
                }

                contentStream.setFont(fontBold, 12);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, y);
                contentStream.showText("Total Transaksi: " + count + "  |  Total Pendapatan: " + CurrencyUtil.formatRupiah(totalRevenue));
                contentStream.endText();
                y -= 25;

                // Draw Table Header
                contentStream.setFont(fontBold, 10);
                float[] colX = {margin, margin + 110, margin + 220, margin + 300, margin + 410};
                
                contentStream.beginText();
                contentStream.newLineAtOffset(colX[0], y);
                contentStream.showText("No. Transaksi");
                contentStream.newLineAtOffset(colX[1] - colX[0], 0);
                contentStream.showText("Tanggal");
                contentStream.newLineAtOffset(colX[2] - colX[1], 0);
                contentStream.showText("Kasir");
                contentStream.newLineAtOffset(colX[3] - colX[2], 0);
                contentStream.showText("Metode");
                contentStream.newLineAtOffset(colX[4] - colX[3], 0);
                contentStream.showText("Total (Rp)");
                contentStream.endText();
                y -= 15;

                // Table Line
                contentStream.setLineWidth(1.0f);
                contentStream.moveTo(margin, y);
                contentStream.lineTo(page.getMediaBox().getWidth() - margin, y);
                contentStream.stroke();
                y -= 15;

                // Table Rows
                contentStream.setFont(fontRegular, 9);
                for (Sale s : sales) {
                    if (y < margin + 40) {
                        // Overflow to next page if list is long
                        break;
                    }
                    contentStream.beginText();
                    contentStream.newLineAtOffset(colX[0], y);
                    contentStream.showText(s.getTransactionNumber());
                    contentStream.newLineAtOffset(colX[1] - colX[0], 0);
                    contentStream.showText(DateUtil.formatDateTime(s.getTransactionDate()));
                    contentStream.newLineAtOffset(colX[2] - colX[1], 0);
                    contentStream.showText(s.getUserName());
                    contentStream.newLineAtOffset(colX[3] - colX[2], 0);
                    contentStream.showText(s.getPaymentMethod());
                    contentStream.newLineAtOffset(colX[4] - colX[3], 0);
                    contentStream.showText(CurrencyUtil.formatRupiah(s.getTotal()));
                    contentStream.endText();
                    y -= 16;
                }

                // Footer Line
                y -= 10;
                contentStream.moveTo(margin, y);
                contentStream.lineTo(page.getMediaBox().getWidth() - margin, y);
                contentStream.stroke();
            }

            document.save(outputFile);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static byte[] exportSalesReportToPdfBytes(List<Sale> sales, String title) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

                float margin = 40;
                float startY = page.getMediaBox().getHeight() - margin;
                float y = startY;

                contentStream.setFont(fontBold, 18);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, y);
                contentStream.showText("JAJANAN IBU INEM - LAPORAN PENJUALAN");
                contentStream.endText();
                y -= 25;

                contentStream.setFont(fontRegular, 11);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, y);
                contentStream.showText("Periode: " + title + " | Tanggal Cetak: " + DateUtil.formatDateTime(LocalDateTime.now()));
                contentStream.endText();
                y -= 30;

                BigDecimal totalRevenue = BigDecimal.ZERO;
                int count = sales.size();
                for (Sale s : sales) {
                    if (s.getStatus() == Sale.Status.PAID) {
                        totalRevenue = totalRevenue.add(s.getTotal());
                    }
                }

                contentStream.setFont(fontBold, 12);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, y);
                contentStream.showText("Total Transaksi: " + count + "  |  Total Pendapatan: " + CurrencyUtil.formatRupiah(totalRevenue));
                contentStream.endText();
                y -= 25;

                float[] colX = {margin, margin + 110, margin + 220, margin + 310, margin + 410};
                String[] headers = {"No. Transaksi", "Waktu", "Kasir", "Metode", "Total"};

                contentStream.setFont(fontBold, 10);
                contentStream.beginText();
                contentStream.newLineAtOffset(colX[0], y);
                contentStream.showText(headers[0]);
                for (int i = 1; i < headers.length; i++) {
                    contentStream.newLineAtOffset(colX[i] - colX[i - 1], 0);
                    contentStream.showText(headers[i]);
                }
                contentStream.endText();
                y -= 8;

                contentStream.setLineWidth(1f);
                contentStream.moveTo(margin, y);
                contentStream.lineTo(page.getMediaBox().getWidth() - margin, y);
                contentStream.stroke();
                y -= 15;

                contentStream.setFont(fontRegular, 9);
                for (Sale s : sales) {
                    if (y < margin + 20) break;
                    contentStream.beginText();
                    contentStream.newLineAtOffset(colX[0], y);
                    contentStream.showText(s.getTransactionNumber());
                    contentStream.newLineAtOffset(colX[1] - colX[0], 0);
                    contentStream.showText(DateUtil.formatDateTime(s.getTransactionDate()));
                    contentStream.newLineAtOffset(colX[2] - colX[1], 0);
                    contentStream.showText(s.getUserName() != null ? s.getUserName() : "-");
                    contentStream.newLineAtOffset(colX[3] - colX[2], 0);
                    contentStream.showText(s.getPaymentMethod());
                    contentStream.newLineAtOffset(colX[4] - colX[3], 0);
                    contentStream.showText(CurrencyUtil.formatRupiah(s.getTotal()));
                    contentStream.endText();
                    y -= 16;
                }

                y -= 10;
                contentStream.moveTo(margin, y);
                contentStream.lineTo(page.getMediaBox().getWidth() - margin, y);
                contentStream.stroke();
            }

            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
