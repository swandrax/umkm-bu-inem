package com.ibuinem.pos.view;

import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.model.SaleDetail;
import com.ibuinem.pos.printer.ReceiptPrinter;
import com.ibuinem.pos.service.SaleService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.DateUtil;
import com.ibuinem.pos.utils.ModernTextField;
import com.ibuinem.pos.utils.ExcelExporter;
import com.ibuinem.pos.utils.PdfExporter;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

public class SalesHistoryView extends JPanel {

    private ModernTextField txtSearchTrx;
    private ModernTextField txtStartDate;
    private ModernTextField txtEndDate;
    private ModernTable tblHistory;
    private DefaultTableModel tableModel;

    private RoundedButton btnSearch;
    private RoundedButton btnDetail;
    private RoundedButton btnPrintReceipt;
    private RoundedButton btnExportPdf;
    private RoundedButton btnExportExcel;
    private RoundedButton btnExportCsv;
    private RoundedButton btnRefresh;

    private final SaleService saleService = new SaleService();
    private List<Sale> currentSaleList = new ArrayList<>();
    private Timer autoRefreshTimer;

    public SalesHistoryView() {
        setLayout(new BorderLayout(20, 20));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initHeader();
        initTable();
        refreshData();
        startAutoRefresh();
    }

    private void initHeader() {
        RoundedPanel topPanel = new RoundedPanel(15, Color.WHITE);
        topPanel.setLayout(new BorderLayout(15, 15));
        topPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblTitle = new JLabel("Riwayat & Data Penjualan");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        JPanel filterPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        filterPanel.setOpaque(false);

        txtSearchTrx = new ModernTextField("No. Transaksi...");
        txtSearchTrx.setPreferredSize(new Dimension(160, 38));

        txtStartDate = new ModernTextField("YYYY-MM-DD");
        txtStartDate.setPreferredSize(new Dimension(110, 38));

        txtEndDate = new ModernTextField("YYYY-MM-DD");
        txtEndDate.setPreferredSize(new Dimension(110, 38));

        btnSearch = new RoundedButton("Cari", new Color(46, 204, 113), new Color(39, 174, 96));
        btnSearch.setPreferredSize(new Dimension(80, 38));
        btnSearch.addActionListener(e -> filterData());

        btnDetail = new RoundedButton("Lihat Detail", new Color(52, 152, 219), new Color(41, 128, 185));
        btnDetail.setPreferredSize(new Dimension(110, 38));
        btnDetail.addActionListener(e -> showSaleDetailDialog());

        btnPrintReceipt = new RoundedButton("Cetak Struk", new Color(155, 89, 182), new Color(142, 68, 173));
        btnPrintReceipt.setPreferredSize(new Dimension(110, 38));
        btnPrintReceipt.addActionListener(e -> reprintSelectedReceipt());

        btnExportPdf = new RoundedButton("Export PDF", new Color(231, 76, 60), new Color(192, 57, 43));
        btnExportPdf.setPreferredSize(new Dimension(110, 38));
        btnExportPdf.addActionListener(e -> exportToPdf());

        btnExportExcel = new RoundedButton("Export Excel", new Color(46, 204, 113), new Color(39, 174, 96));
        btnExportExcel.setPreferredSize(new Dimension(110, 38));
        btnExportExcel.addActionListener(e -> exportToExcel());

        btnExportCsv = new RoundedButton("Export CSV", new Color(241, 196, 15), new Color(211, 84, 0));
        btnExportCsv.setPreferredSize(new Dimension(110, 38));
        btnExportCsv.addActionListener(e -> exportToCsv());

        btnRefresh = new RoundedButton("Refresh", new Color(149, 165, 166), new Color(127, 140, 141));
        btnRefresh.setPreferredSize(new Dimension(90, 38));
        btnRefresh.addActionListener(e -> {
            txtSearchTrx.setText("");
            txtStartDate.setText("");
            txtEndDate.setText("");
            refreshData();
        });

        filterPanel.add(new JLabel("No Trx:"));
        filterPanel.add(txtSearchTrx);
        filterPanel.add(new JLabel("Mulai:"));
        filterPanel.add(txtStartDate);
        filterPanel.add(new JLabel("Selesai:"));
        filterPanel.add(txtEndDate);
        filterPanel.add(btnSearch);
        filterPanel.add(btnDetail);
        filterPanel.add(btnPrintReceipt);
        filterPanel.add(btnExportPdf);
        filterPanel.add(btnExportExcel);
        filterPanel.add(btnExportCsv);
        filterPanel.add(btnRefresh);

        topPanel.add(lblTitle, BorderLayout.WEST);
        topPanel.add(filterPanel, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
    }

    private void initTable() {
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        String[] columns = {"ID", "No. Transaksi", "Tanggal", "Kasir", "Metode Bayar", "Subtotal", "Diskon", "Pajak", "Total Akhir", "Status"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblHistory = new ModernTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tblHistory);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        centerPanel.add(scrollPane, BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        filterData();
    }

    private void startAutoRefresh() {
        autoRefreshTimer = new Timer(3000, e -> filterData());
        autoRefreshTimer.start();
    }

    public void stopTimer() {
        if (autoRefreshTimer != null) {
            autoRefreshTimer.stop();
        }
    }

    private void filterData() {
        LocalDate start = null;
        LocalDate end = null;
        String trxNum = txtSearchTrx.getText();

        try {
            if (!txtStartDate.getText().trim().isEmpty() && !txtStartDate.getText().contains("YYYY")) {
                start = LocalDate.parse(txtStartDate.getText().trim());
            }
            if (!txtEndDate.getText().trim().isEmpty() && !txtEndDate.getText().contains("YYYY")) {
                end = LocalDate.parse(txtEndDate.getText().trim());
            }
        } catch (DateTimeParseException e) {
            JOptionPane.showMessageDialog(this, "Format tanggal harus YYYY-MM-DD (contoh: 2026-08-07)", "Format Tanggal Salah", JOptionPane.WARNING_MESSAGE);
            return;
        }

        currentSaleList = saleService.searchSalesHistory(start, end, trxNum);
        tableModel.setRowCount(0);

        for (Sale s : currentSaleList) {
            tableModel.addRow(new Object[]{
                s.getId(),
                s.getTransactionNumber(),
                DateUtil.formatDateTime(s.getTransactionDate()),
                s.getUserName(),
                s.getPaymentMethod(),
                CurrencyUtil.formatRupiah(s.getSubtotal()),
                CurrencyUtil.formatRupiah(s.getDiscount()),
                CurrencyUtil.formatRupiah(s.getTax()),
                CurrencyUtil.formatRupiah(s.getTotal()),
                s.getStatus().name()
            });
        }
    }

    private void showSaleDetailDialog() {
        int row = tblHistory.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Pilih transaksi dari tabel terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Sale briefSale = currentSaleList.get(row);
        Sale fullSale = saleService.getSaleDetails(briefSale.getId());
        if (fullSale == null) fullSale = briefSale;

        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Detail Transaksi - " + fullSale.getTransactionNumber(), true);
        dialog.setLayout(new BorderLayout(10, 10));
        dialog.setSize(520, 500);
        dialog.setLocationRelativeTo(this);

        JPanel header = new JPanel(new GridLayout(4, 2, 10, 5));
        header.setBorder(BorderFactory.createEmptyBorder(15, 20, 10, 20));
        header.add(new JLabel("No Transaksi: " + fullSale.getTransactionNumber()));
        header.add(new JLabel("Tanggal: " + DateUtil.formatDateTime(fullSale.getTransactionDate())));
        header.add(new JLabel("Kasir: " + fullSale.getUserName()));
        header.add(new JLabel("Metode Bayar: " + fullSale.getPaymentMethod()));
        header.add(new JLabel("Bayar: " + CurrencyUtil.formatRupiah(fullSale.getCashAmount())));
        header.add(new JLabel("Kembalian: " + CurrencyUtil.formatRupiah(fullSale.getChangeAmount())));
        header.add(new JLabel("Status: " + fullSale.getStatus().name()));

        String[] itemCols = {"Nama Produk", "Harga", "Qty", "Subtotal"};
        DefaultTableModel itemModel = new DefaultTableModel(itemCols, 0);
        for (SaleDetail d : fullSale.getDetails()) {
            itemModel.addRow(new Object[]{
                d.getProductName(),
                CurrencyUtil.formatRupiah(d.getPrice()),
                d.getQuantity(),
                CurrencyUtil.formatRupiah(d.getSubtotal())
            });
        }
        ModernTable itemTable = new ModernTable(itemModel);
        JScrollPane scrollPane = new JScrollPane(itemTable);
        scrollPane.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 15));
        JLabel lblTotal = new JLabel("TOTAL: " + CurrencyUtil.formatRupiah(fullSale.getTotal()));
        lblTotal.setFont(new Font("SansSerif", Font.BOLD, 16));
        lblTotal.setForeground(new Color(46, 204, 113));

        JButton btnClose = new JButton("Tutup");
        btnClose.addActionListener(e -> dialog.dispose());

        footer.add(lblTotal);
        footer.add(btnClose);

        dialog.add(header, BorderLayout.NORTH);
        dialog.add(scrollPane, BorderLayout.CENTER);
        dialog.add(footer, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void reprintSelectedReceipt() {
        int row = tblHistory.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Pilih transaksi dari tabel terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Sale briefSale = currentSaleList.get(row);
        Sale fullSale = saleService.getSaleDetails(briefSale.getId());
        if (fullSale != null) {
            ReceiptPrinter.showReceiptPreview(fullSale, this);
        }
    }

    private void exportToExcel() {
        if (currentSaleList == null || currentSaleList.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Tidak ada data untuk diexport!");
            return;
        }
        
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save as Excel");
        fileChooser.setSelectedFile(new java.io.File("Riwayat_Penjualan.xlsx"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            String path = fileChooser.getSelectedFile().getAbsolutePath();
            if (!path.endsWith(".xlsx")) path += ".xlsx";
            
            boolean success = ExcelExporter.exportSalesToExcel(currentSaleList, path);
            if (success) {
                JOptionPane.showMessageDialog(this, "Export berhasil: " + path);
            } else {
                JOptionPane.showMessageDialog(this, "Gagal mengexport file!");
            }
        }
    }

    private void exportToPdf() {
        if (currentSaleList == null || currentSaleList.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Tidak ada data untuk diexport!");
            return;
        }

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Simpan Riwayat PDF");
        fileChooser.setSelectedFile(new File("Riwayat_Penjualan_" + System.currentTimeMillis() + ".pdf"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            File outputFile = fileChooser.getSelectedFile();
            if (!outputFile.getAbsolutePath().endsWith(".pdf")) {
                outputFile = new File(outputFile.getAbsolutePath() + ".pdf");
            }

            boolean success = PdfExporter.exportSalesReportToPdf(currentSaleList, "Riwayat Penjualan", outputFile);
            if (success) {
                JOptionPane.showMessageDialog(this, "Export PDF berhasil: " + outputFile.getAbsolutePath());
            } else {
                JOptionPane.showMessageDialog(this, "Gagal mengexport file PDF!");
            }
        }
    }

    private void exportToCsv() {
        if (currentSaleList == null || currentSaleList.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Tidak ada data untuk diexport!");
            return;
        }

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save as CSV");
        fileChooser.setSelectedFile(new File("Riwayat_Penjualan_" + System.currentTimeMillis() + ".csv"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            String path = fileChooser.getSelectedFile().getAbsolutePath();
            if (!path.endsWith(".csv")) path += ".csv";

            boolean success = ExcelExporter.exportSalesToCsv(currentSaleList, path);
            if (success) {
                JOptionPane.showMessageDialog(this, "Export CSV berhasil: " + path);
            } else {
                JOptionPane.showMessageDialog(this, "Gagal mengexport file CSV!");
            }
        }
    }
}
