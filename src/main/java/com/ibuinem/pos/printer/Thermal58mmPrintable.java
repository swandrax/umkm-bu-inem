package com.ibuinem.pos.printer;

import com.ibuinem.pos.barcode.BarcodeGenerator;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.model.SaleDetail;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.DateUtil;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.print.PageFormat;
import java.awt.print.Printable;
import java.awt.print.PrinterException;

/**
 * Custom Printable for 58mm Thermal Printer
 * Standard 58mm width corresponds to ~164pt (or ~200px at 72dpi/203dpi printable area).
 */
public class Thermal58mmPrintable implements Printable {

    private final Sale sale;
    private static final int PAPER_WIDTH = 164; // 58mm approx printable width in points

    public Thermal58mmPrintable(Sale sale) {
        this.sale = sale;
    }

    @Override
    public int print(Graphics graphics, PageFormat pageFormat, int pageIndex) throws PrinterException {
        if (pageIndex > 0) {
            return NO_SUCH_PAGE;
        }

        Graphics2D g2d = (Graphics2D) graphics;
        g2d.translate(pageFormat.getImageableX(), pageFormat.getImageableY());

        // Font styles
        Font fontHeaderBold = new Font("Monospaced", Font.BOLD, 10);
        Font fontBold = new Font("Monospaced", Font.BOLD, 8);
        Font fontRegular = new Font("Monospaced", Font.PLAIN, 8);
        Font fontSmall = new Font("Monospaced", Font.PLAIN, 7);

        g2d.setColor(Color.BLACK);
        int y = 12;
        int lineGap = 11;

        // Draw Centered Title
        g2d.setFont(fontHeaderBold);
        drawCenteredString(g2d, "JAJANAN IBU INEM", PAPER_WIDTH, y);
        y += lineGap;

        g2d.setFont(fontSmall);
        drawCenteredString(g2d, "Jl. Khas Kuliner No. 88, Jakarta", PAPER_WIDTH, y);
        y += lineGap;
        drawCenteredString(g2d, "Telp: 0812-3456-7890", PAPER_WIDTH, y);
        y += lineGap;

        drawSeparator(g2d, y);
        y += 8;

        // Transaction Info
        g2d.setFont(fontRegular);
        g2d.drawString("No Trx  : " + sale.getTransactionNumber(), 5, y);
        y += lineGap;
        g2d.drawString("Tanggal : " + DateUtil.formatDateTime(sale.getTransactionDate()), 5, y);
        y += lineGap;
        g2d.drawString("Kasir   : " + sale.getUserName(), 5, y);
        y += lineGap;

        drawSeparator(g2d, y);
        y += 8;

        // Purchased Items
        g2d.setFont(fontRegular);
        for (SaleDetail detail : sale.getDetails()) {
            // Item Name
            g2d.drawString(detail.getProductName(), 5, y);
            y += lineGap;

            // Qty x Price -> Subtotal
            String qtyPriceStr = detail.getQuantity() + " x " + CurrencyUtil.formatRupiah(detail.getPrice());
            String subtotalStr = CurrencyUtil.formatRupiah(detail.getSubtotal());

            g2d.drawString(qtyPriceStr, 10, y);
            drawRightString(g2d, subtotalStr, PAPER_WIDTH - 5, y);
            y += lineGap;
        }

        drawSeparator(g2d, y);
        y += 8;

        // Totals & Payment Details
        if (sale.getDiscount() != null && sale.getDiscount().doubleValue() > 0) {
            g2d.drawString("Subtotal", 5, y);
            drawRightString(g2d, CurrencyUtil.formatRupiah(sale.getSubtotal()), PAPER_WIDTH - 5, y);
            y += lineGap;

            g2d.drawString("Diskon", 5, y);
            drawRightString(g2d, "-" + CurrencyUtil.formatRupiah(sale.getDiscount()), PAPER_WIDTH - 5, y);
            y += lineGap;
        }

        if (sale.getTax() != null && sale.getTax().doubleValue() > 0) {
            g2d.drawString("Pajak", 5, y);
            drawRightString(g2d, CurrencyUtil.formatRupiah(sale.getTax()), PAPER_WIDTH - 5, y);
            y += lineGap;
        }

        g2d.setFont(fontBold);
        g2d.drawString("TOTAL", 5, y);
        drawRightString(g2d, CurrencyUtil.formatRupiah(sale.getTotal()), PAPER_WIDTH - 5, y);
        y += lineGap + 2;

        g2d.setFont(fontRegular);
        g2d.drawString("METODE BAYAR", 5, y);
        drawRightString(g2d, sale.getPaymentMethod(), PAPER_WIDTH - 5, y);
        y += lineGap;

        g2d.drawString("Bayar", 5, y);
        drawRightString(g2d, CurrencyUtil.formatRupiah(sale.getCashAmount()), PAPER_WIDTH - 5, y);
        y += lineGap;

        g2d.drawString("Kembali", 5, y);
        drawRightString(g2d, CurrencyUtil.formatRupiah(sale.getChangeAmount()), PAPER_WIDTH - 5, y);
        y += lineGap;

        drawSeparator(g2d, y);
        y += 10;

        // ZXing Barcode Generation (Transaction Number)
        BufferedImage barcodeImg = BarcodeGenerator.generateBarcode(sale.getTransactionNumber(), 130, 35);
        if (barcodeImg != null) {
            int xBar = (PAPER_WIDTH - 130) / 2;
            g2d.drawImage(barcodeImg, xBar, y, null);
            y += 40;
            g2d.setFont(fontSmall);
            drawCenteredString(g2d, sale.getTransactionNumber(), PAPER_WIDTH, y);
            y += lineGap;
        }

        drawSeparator(g2d, y);
        y += 8;

        // Footer Message
        g2d.setFont(fontSmall);
        drawCenteredString(g2d, "Terima kasih telah memesan.", PAPER_WIDTH, y);
        y += lineGap;
        drawCenteredString(g2d, "Have a Nice Day!", PAPER_WIDTH, y);

        return PAGE_EXISTS;
    }

    private void drawCenteredString(Graphics2D g2d, String text, int width, int y) {
        FontMetrics fm = g2d.getFontMetrics();
        int x = (width - fm.stringWidth(text)) / 2;
        g2d.drawString(text, x, y);
    }

    private void drawRightString(Graphics2D g2d, String text, int xRight, int y) {
        FontMetrics fm = g2d.getFontMetrics();
        int x = xRight - fm.stringWidth(text);
        g2d.drawString(text, x, y);
    }

    private void drawSeparator(Graphics2D g2d, int y) {
        g2d.drawString("------------------------------------", 5, y);
    }
}
