package com.ibuinem.pos.view;

import com.ibuinem.pos.component.CardPanel;
import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.service.SaleService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.DateUtil;
import com.ibuinem.pos.utils.PdfExporter;
import com.ibuinem.pos.utils.ExcelExporter;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

public class ReportView extends JPanel {

    private CardPanel cardSummaryTotal;
    private CardPanel cardSummaryCount;

    private JTabbedPane tabbedPane;
    private ModernTable tblReport;
    private DefaultTableModel tableModel;

    private RoundedButton btnExportPdf;
    private RoundedButton btnExportExcel;
    private RoundedButton btnExportCsv;
    private RoundedButton btnPrintReport;
    private RoundedButton btnRefresh;

    private final SaleService saleService = new SaleService();
    private List<Sale> currentReportSales = new ArrayList<>();
    private String currentPeriodTitle = "Harian";

    public ReportView() {
        setLayout(new BorderLayout(20, 20));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initHeader();
        initTableAndTabs();
        loadReport("DAILY");
    }

    private void initHeader() {
        RoundedPanel topPanel = new RoundedPanel(15, Color.WHITE);
        topPanel.setLayout(new BorderLayout(15, 15));
        topPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblTitle = new JLabel("Laporan Penjualan");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        btnPanel.setOpaque(false);

        btnExportPdf = new RoundedButton("Export PDF", new Color(231, 76, 60), new Color(192, 57, 43));
        btnExportPdf.setPreferredSize(new Dimension(120, 38));
        btnExportPdf.addActionListener(e -> exportPdf());

        btnExportExcel = new RoundedButton("Export Excel", new Color(46, 204, 113), new Color(39, 174, 96));
        btnExportExcel.setPreferredSize(new Dimension(120, 38));
        btnExportExcel.addActionListener(e -> exportExcel());

        btnExportCsv = new RoundedButton("Export CSV", new Color(241, 196, 15), new Color(211, 84, 0));
        btnExportCsv.setPreferredSize(new Dimension(110, 38));
        btnExportCsv.addActionListener(e -> exportCsv());

        btnPrintReport = new RoundedButton("Cetak Laporan", new Color(52, 152, 219), new Color(41, 128, 185));
        btnPrintReport.setPreferredSize(new Dimension(130, 38));
        btnPrintReport.addActionListener(e -> printReport());

        btnRefresh = new RoundedButton("Refresh", new Color(149, 165, 166), new Color(127, 140, 141));
        btnRefresh.setPreferredSize(new Dimension(90, 38));
        btnRefresh.addActionListener(e -> refreshData());

        btnPanel.add(btnExportPdf);
        btnPanel.add(btnExportExcel);
        btnPanel.add(btnExportCsv);
        btnPanel.add(btnPrintReport);
        btnPanel.add(btnRefresh);

        topPanel.add(lblTitle, BorderLayout.WEST);
        topPanel.add(btnPanel, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
    }

    private void initTableAndTabs() {
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout(0, 15));
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        // Metric Cards Summary
        JPanel summaryPanel = new JPanel(new GridLayout(1, 2, 20, 0));
        summaryPanel.setOpaque(false);

        cardSummaryTotal = new CardPanel("Total Omset Periode", "Rp 0", "Rp", new Color(46, 204, 113));
        cardSummaryCount = new CardPanel("Jumlah Transaksi Lunas", "0 Transaksi", "📊", new Color(52, 152, 219));

        summaryPanel.add(cardSummaryTotal);
        summaryPanel.add(cardSummaryCount);

        // Filter Tabs (Harian, Mingguan, Bulanan)
        tabbedPane = new JTabbedPane();
        tabbedPane.setFont(new Font("SansSerif", Font.BOLD, 13));
        tabbedPane.addTab("Penjualan Harian", null);
        tabbedPane.addTab("Penjualan Mingguan", null);
        tabbedPane.addTab("Penjualan Bulanan", null);

        tabbedPane.addChangeListener(e -> {
            int selectedIndex = tabbedPane.getSelectedIndex();
            if (selectedIndex == 0) {
                loadReport("DAILY");
            } else if (selectedIndex == 1) {
                loadReport("WEEKLY");
            } else if (selectedIndex == 2) {
                loadReport("MONTHLY");
            }
        });

        // Table
        String[] columns = {"ID", "No. Transaksi", "Tanggal & Waktu", "Kasir", "Metode Bayar", "Total (Rp)"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) { return false; }
        };

        tblReport = new ModernTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tblReport);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        centerPanel.add(summaryPanel, BorderLayout.NORTH);
        centerPanel.add(tabbedPane, BorderLayout.CENTER);

        // Put table inside a wrapper
        JPanel tableWrapper = new JPanel(new BorderLayout());
        tableWrapper.setOpaque(false);
        tableWrapper.add(scrollPane, BorderLayout.CENTER);

        centerPanel.add(tableWrapper, BorderLayout.SOUTH);
        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        int idx = tabbedPane.getSelectedIndex();
        if (idx == 0) loadReport("DAILY");
        else if (idx == 1) loadReport("WEEKLY");
        else if (idx == 2) loadReport("MONTHLY");
    }

    private void loadReport(String type) {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate = today;

        if ("DAILY".equalsIgnoreCase(type)) {
            startDate = today;
            currentPeriodTitle = "Hari Ini (" + DateUtil.formatDate(today.atStartOfDay()) + ")";
        } else if ("WEEKLY".equalsIgnoreCase(type)) {
            startDate = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            endDate = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
            currentPeriodTitle = "Minggu Ini (" + startDate + " s/d " + endDate + ")";
        } else { // MONTHLY
            startDate = today.with(TemporalAdjusters.firstDayOfMonth());
            endDate = today.with(TemporalAdjusters.lastDayOfMonth());
            currentPeriodTitle = "Bulan Ini (" + today.getMonth().name() + " " + today.getYear() + ")";
        }

        currentReportSales = saleService.searchSalesHistory(startDate, endDate, null);
        tableModel.setRowCount(0);

        BigDecimal grandTotal = BigDecimal.ZERO;
        int paidCount = 0;

        for (Sale s : currentReportSales) {
            if (s.getStatus() == Sale.Status.PAID) {
                grandTotal = grandTotal.add(s.getTotal());
                paidCount++;
            }
            tableModel.addRow(new Object[]{
                s.getId(),
                s.getTransactionNumber(),
                DateUtil.formatDateTime(s.getTransactionDate()),
                s.getUserName(),
                s.getPaymentMethod(),
                CurrencyUtil.formatRupiah(s.getTotal())
            });
        }

        cardSummaryTotal.setValue(CurrencyUtil.formatRupiah(grandTotal));
        cardSummaryCount.setValue(paidCount + " Transaksi");
    }

    private void exportPdf() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Simpan Laporan PDF");
        fileChooser.setSelectedFile(new File("Laporan_Penjualan_" + System.currentTimeMillis() + ".pdf"));

        int userSelection = fileChooser.showSaveDialog(this);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToSave = fileChooser.getSelectedFile();
            if (!fileToSave.getAbsolutePath().endsWith(".pdf")) {
                fileToSave = new File(fileToSave.getAbsolutePath() + ".pdf");
            }

            boolean success = PdfExporter.exportSalesReportToPdf(currentReportSales, currentPeriodTitle, fileToSave);
            if (success) {
                JOptionPane.showMessageDialog(this, "Laporan berhasil di-export ke PDF:\n" + fileToSave.getAbsolutePath(), "Sukses Export PDF", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Gagal membuat file PDF!", "Error PDF", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void exportExcel() {
        if (currentReportSales == null || currentReportSales.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Tidak ada data untuk diexport!");
            return;
        }
        
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save as Excel");
        fileChooser.setSelectedFile(new java.io.File("Laporan_Penjualan_" + System.currentTimeMillis() + ".xlsx"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            String path = fileChooser.getSelectedFile().getAbsolutePath();
            if (!path.endsWith(".xlsx")) path += ".xlsx";
            
            boolean success = ExcelExporter.exportSalesToExcel(currentReportSales, path);
            if (success) {
                JOptionPane.showMessageDialog(this, "Export berhasil: " + path);
            } else {
                JOptionPane.showMessageDialog(this, "Gagal mengexport file!");
            }
        }
    }

    private void exportCsv() {
        if (currentReportSales == null || currentReportSales.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Tidak ada data untuk diexport!");
            return;
        }

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save as CSV");
        fileChooser.setSelectedFile(new java.io.File("Laporan_Penjualan_" + System.currentTimeMillis() + ".csv"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            String path = fileChooser.getSelectedFile().getAbsolutePath();
            if (!path.endsWith(".csv")) path += ".csv";

            boolean success = ExcelExporter.exportSalesToCsv(currentReportSales, path);
            if (success) {
                JOptionPane.showMessageDialog(this, "Export CSV berhasil: " + path);
            } else {
                JOptionPane.showMessageDialog(this, "Gagal mengexport file CSV!");
            }
        }
    }

    private void printReport() {
        try {
            boolean complete = tblReport.print(JTable.PrintMode.FIT_WIDTH,
                new java.text.MessageFormat("JAJANAN IBU INEM - LAPORAN PENJUALAN (" + currentPeriodTitle + ")"),
                new java.text.MessageFormat("Halaman {0}"));
            if (complete) {
                JOptionPane.showMessageDialog(this, "Pencetakan laporan selesai!", "Sukses Cetak", JOptionPane.INFORMATION_MESSAGE);
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Gagal mencetak laporan: " + e.getMessage(), "Error Print", JOptionPane.ERROR_MESSAGE);
        }
    }
}
