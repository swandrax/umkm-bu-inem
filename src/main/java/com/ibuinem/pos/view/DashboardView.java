package com.ibuinem.pos.view;

import com.ibuinem.pos.component.CardPanel;
import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.Product;
import com.ibuinem.pos.model.ReportSummary;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.service.ProductService;
import com.ibuinem.pos.service.SaleService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.DateUtil;
import com.ibuinem.pos.utils.SessionManager;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DashboardView extends JPanel {

    private CardPanel cardTodaySales;
    private CardPanel cardTotalRevenue;
    private CardPanel cardTransactions;
    private CardPanel cardProductsSold;

    private JLabel lblClock;
    private JLabel lblDate;
    private JLabel lblCashierInfo;
    private JPanel headerPanel;

    private ModernTable tblRecentSales;
    private DefaultTableModel tableModel;

    private ModernTable tblLowStock;
    private DefaultTableModel lowStockTableModel;

    private final SaleService saleService = new SaleService();
    private final ProductService productService = new ProductService();
    private Timer clockTimer;

    public DashboardView() {
        setLayout(new BorderLayout(20, 20));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initHeader();
        initMetricCards();
        initRecentSalesTable();

        startRealTimeClock();
        refreshData();
    }

    private void initHeader() {
        headerPanel = new RoundedPanel(15, Color.WHITE);
        headerPanel.setLayout(new BorderLayout(15, 0));
        headerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        // Left Greeting
        JPanel leftPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        leftPanel.setOpaque(false);

        JLabel lblTitle = new JLabel("Dashboard Overview");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        String userRole = SessionManager.getCurrentUser() != null ? SessionManager.getCurrentUser().getFullName() + " (" + SessionManager.getCurrentUser().getRole() + ")" : "Kasir";
        lblCashierInfo = new JLabel("Selamat Datang, " + userRole + " | Status: Online");
        lblCashierInfo.setFont(new Font("SansSerif", Font.PLAIN, 13));
        lblCashierInfo.setForeground(new Color(127, 140, 141));

        leftPanel.add(lblTitle);
        leftPanel.add(lblCashierInfo);

        // Right Real-Time Clock & Date
        JPanel rightPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        rightPanel.setOpaque(false);

        lblClock = new JLabel("00:00:00", SwingConstants.RIGHT);
        lblClock.setFont(new Font("Monospaced", Font.BOLD, 20));
        lblClock.setForeground(new Color(46, 204, 113)); // Emerald Green

        lblDate = new JLabel("-", SwingConstants.RIGHT);
        lblDate.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblDate.setForeground(new Color(127, 140, 141));

        rightPanel.add(lblClock);
        rightPanel.add(lblDate);

        headerPanel.add(leftPanel, BorderLayout.CENTER);
        headerPanel.add(rightPanel, BorderLayout.EAST);
    }

    private void initMetricCards() {
        JPanel gridPanel = new JPanel(new GridLayout(1, 4, 15, 0));
        gridPanel.setOpaque(false);

        cardTodaySales = new CardPanel("Penjualan Hari Ini", "Rp 0", "Rp", new Color(46, 204, 113)); // Green
        cardTotalRevenue = new CardPanel("Total Pendapatan", "Rp 0", "★", new Color(52, 152, 219)); // Blue
        cardTransactions = new CardPanel("Jumlah Transaksi", "0", "📋", new Color(155, 89, 182)); // Purple
        cardProductsSold = new CardPanel("Produk Terjual", "0 Pcs", "🍿", new Color(243, 156, 18)); // Orange

        gridPanel.add(cardTodaySales);
        gridPanel.add(cardTotalRevenue);
        gridPanel.add(cardTransactions);
        gridPanel.add(cardProductsSold);

        // Wrapper for header + cards
        JPanel topContainer = new JPanel(new BorderLayout(0, 15));
        topContainer.setOpaque(false);
        topContainer.add(headerPanel, BorderLayout.NORTH); // Header
        topContainer.add(gridPanel, BorderLayout.SOUTH);

        add(topContainer, BorderLayout.NORTH);
    }

    private void initRecentSalesTable() {
        JPanel centerContainer = new JPanel(new GridLayout(1, 2, 15, 0));
        centerContainer.setOpaque(false);

        // Left Panel: Recent Sales
        RoundedPanel salesPanel = new RoundedPanel(15, Color.WHITE);
        salesPanel.setLayout(new BorderLayout(0, 15));
        salesPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblRecentTitle = new JLabel("Transaksi Terbaru Hari Ini");
        lblRecentTitle.setFont(new Font("SansSerif", Font.BOLD, 16));
        lblRecentTitle.setForeground(new Color(44, 62, 80));

        String[] columns = {"No. Transaksi", "Waktu", "Kasir", "Total (Rp)", "Status"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblRecentSales = new ModernTable(tableModel);
        JScrollPane scrollSales = new JScrollPane(tblRecentSales);
        scrollSales.setBorder(BorderFactory.createEmptyBorder());

        salesPanel.add(lblRecentTitle, BorderLayout.NORTH);
        salesPanel.add(scrollSales, BorderLayout.CENTER);

        // Right Panel: Low Stock Alert
        RoundedPanel stockPanel = new RoundedPanel(15, Color.WHITE);
        stockPanel.setLayout(new BorderLayout(0, 15));
        stockPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblStockTitle = new JLabel("⚠️ Peringatan Stok Menipis (<= 5 Pcs)");
        lblStockTitle.setFont(new Font("SansSerif", Font.BOLD, 16));
        lblStockTitle.setForeground(new Color(231, 76, 60));

        String[] stockColumns = {"Kode", "Nama Produk", "Kategori", "Sisa Stok"};
        lowStockTableModel = new DefaultTableModel(stockColumns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblLowStock = new ModernTable(lowStockTableModel);
        JScrollPane scrollStock = new JScrollPane(tblLowStock);
        scrollStock.setBorder(BorderFactory.createEmptyBorder());

        stockPanel.add(lblStockTitle, BorderLayout.NORTH);
        stockPanel.add(scrollStock, BorderLayout.CENTER);

        centerContainer.add(salesPanel);
        centerContainer.add(stockPanel);

        add(centerContainer, BorderLayout.CENTER);
    }

    private void startRealTimeClock() {
        clockTimer = new Timer(1000, e -> {
            LocalDateTime now = LocalDateTime.now();
            lblClock.setText(DateUtil.formatTime(now));
            lblDate.setText(DateUtil.formatDate(now));
        });
        clockTimer.start();
    }

    public void refreshData() {
        SwingUtilities.invokeLater(() -> {
            // 1. Fetch Real-time Summary from MySQL
            ReportSummary summary = saleService.getDashboardSummary();
            cardTodaySales.setValue(CurrencyUtil.formatRupiah(summary.getTotalSalesToday()));
            cardTotalRevenue.setValue(CurrencyUtil.formatRupiah(summary.getTotalRevenue()));
            cardTransactions.setValue(String.valueOf(summary.getTotalTransactions()));
            cardProductsSold.setValue(summary.getProductsSold() + " Pcs");

            // 2. Fetch Recent Sales
            tableModel.setRowCount(0);
            List<Sale> recentSales = saleService.searchSalesHistory(LocalDate.now(), LocalDate.now(), null);
            for (Sale s : recentSales) {
                tableModel.addRow(new Object[]{
                    s.getTransactionNumber(),
                    DateUtil.formatTime(s.getTransactionDate()),
                    s.getUserName(),
                    CurrencyUtil.formatRupiah(s.getTotal()),
                    s.getStatus().name()
                });
            }

            // 3. Fetch Low Stock Products
            lowStockTableModel.setRowCount(0);
            List<Product> lowStockProducts = productService.getLowStockProducts(5);
            if (lowStockProducts != null) {
                for (Product p : lowStockProducts) {
                    lowStockTableModel.addRow(new Object[]{
                        p.getCode(),
                        p.getName(),
                        p.getCategoryName(),
                        p.getStock() + " Pcs"
                    });
                }
            }
        });
    }

    public void stopTimer() {
        if (clockTimer != null) {
            clockTimer.stop();
        }
    }
}
