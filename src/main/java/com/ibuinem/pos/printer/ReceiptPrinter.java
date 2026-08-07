package com.ibuinem.pos.printer;

import com.ibuinem.pos.model.Sale;

import javax.swing.*;
import java.awt.*;
import java.awt.print.Book;
import java.awt.print.PageFormat;
import java.awt.print.Paper;
import java.awt.print.PrinterJob;

public class ReceiptPrinter {

    public static void printReceipt(Sale sale, Component parent) {
        PrinterJob job = PrinterJob.getPrinterJob();
        PageFormat pf = job.defaultPage();
        Paper paper = pf.getPaper();

        // 58mm thermal paper dimensions (Width: 58mm = ~164pt, Height: dynamic ~500pt)
        double width = 164;
        double height = 600;
        double margin = 5;
        paper.setSize(width, height);
        paper.setImageableArea(margin, margin, width - (margin * 2), height - (margin * 2));
        pf.setPaper(paper);

        Book book = new Book();
        book.append(new Thermal58mmPrintable(sale), pf);
        job.setPageable(book);

        if (job.printDialog()) {
            try {
                job.print();
                JOptionPane.showMessageDialog(parent, "Struk berhasil dicetak!", "Sukses Cetak", JOptionPane.INFORMATION_MESSAGE);
            } catch (Exception e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(parent, "Gagal mencetak struk: " + e.getMessage(), "Error Cetak", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    /**
     * Show digital receipt preview dialog if physical thermal printer is not connected
     */
    public static void showReceiptPreview(Sale sale, Component parent) {
        JDialog dialog = new JDialog(SwingUtilities.getWindowAncestor(parent), "Struk Digital 58mm - " + sale.getTransactionNumber(), Dialog.ModalityType.APPLICATION_MODAL);
        dialog.setLayout(new BorderLayout());

        JPanel printablePanel = new JPanel() {
            private final Thermal58mmPrintable printable = new Thermal58mmPrintable(sale);

            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(Color.WHITE);
                g2d.fillRect(0, 0, getWidth(), getHeight());

                PageFormat pf = PrinterJob.getPrinterJob().defaultPage();
                Paper paper = pf.getPaper();
                paper.setImageableArea(0, 0, 164, 600);
                pf.setPaper(paper);

                try {
                    printable.print(g2d, pf, 0);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public Dimension getPreferredSize() {
                return new Dimension(220, 520);
            }
        };
        printablePanel.setBackground(Color.WHITE);
        printablePanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JScrollPane scrollPane = new JScrollPane(printablePanel);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton printBtn = new JButton("Cetak ke Printer");
        printBtn.addActionListener(e -> {
            dialog.dispose();
            printReceipt(sale, parent);
        });
        JButton closeBtn = new JButton("Tutup");
        closeBtn.addActionListener(e -> dialog.dispose());

        btnPanel.add(printBtn);
        btnPanel.add(closeBtn);

        dialog.add(scrollPane, BorderLayout.CENTER);
        dialog.add(btnPanel, BorderLayout.SOUTH);
        dialog.pack();
        dialog.setLocationRelativeTo(parent);
        dialog.setVisible(true);
    }
}
