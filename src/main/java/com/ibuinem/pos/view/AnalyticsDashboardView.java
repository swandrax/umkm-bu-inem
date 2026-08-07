package com.ibuinem.pos.view;

import com.ibuinem.pos.component.CardPanel;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.service.AnalyticsService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.DateUtil;

import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.chart.*;
import javafx.scene.layout.GridPane;

import javax.swing.*;
import java.awt.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public class AnalyticsDashboardView extends JPanel {

    private final AnalyticsService analyticsService = new AnalyticsService();

    private CardPanel cardTotalSales;
    private CardPanel cardTotalRevenue;
    private CardPanel cardTransactions;
    private CardPanel cardProductsSold;
    
    private JComboBox<String> cmbFilter;
    private JFXPanel jfxPanel;
    private Timer clockTimer;
    private JLabel lblClock;
    private JLabel lblDate;
    private JPanel headerPanel;

    public AnalyticsDashboardView() {
        setLayout(new BorderLayout(20, 20));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initHeader();
        initMetricCards();
        initJavaFXCharts();

        startRealTimeClock();
        refreshData();
    }

    private void initHeader() {
        headerPanel = new RoundedPanel(15, Color.WHITE);
        headerPanel.setLayout(new BorderLayout(15, 0));
        headerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        // Left Greeting
        JPanel leftPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 0));
        leftPanel.setOpaque(false);

        JLabel lblTitle = new JLabel("Advanced Analytics Dashboard");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        cmbFilter = new JComboBox<>(new String[]{"TODAY", "WEEK", "MONTH", "ALL"});
        cmbFilter.addActionListener(e -> refreshData());

        leftPanel.add(lblTitle);
        leftPanel.add(new JLabel("Filter:"));
        leftPanel.add(cmbFilter);

        // Right Real-Time Clock & Date
        JPanel rightPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        rightPanel.setOpaque(false);

        lblClock = new JLabel("00:00:00", SwingConstants.RIGHT);
        lblClock.setFont(new Font("Monospaced", Font.BOLD, 20));
        lblClock.setForeground(new Color(46, 204, 113)); 

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

        cardTotalSales = new CardPanel("Total Penjualan", "Rp 0", "Rp", new Color(46, 204, 113));
        cardTotalRevenue = new CardPanel("Total Pendapatan", "Rp 0", "★", new Color(52, 152, 219));
        cardTransactions = new CardPanel("Jumlah Transaksi", "0", "📋", new Color(155, 89, 182));
        cardProductsSold = new CardPanel("Produk Terjual", "0", "🍿", new Color(243, 156, 18));

        gridPanel.add(cardTotalSales);
        gridPanel.add(cardTotalRevenue);
        gridPanel.add(cardTransactions);
        gridPanel.add(cardProductsSold);

        JPanel topContainer = new JPanel(new BorderLayout(0, 15));
        topContainer.setOpaque(false);
        topContainer.add(headerPanel, BorderLayout.NORTH); // Header
        topContainer.add(gridPanel, BorderLayout.SOUTH);

        add(topContainer, BorderLayout.NORTH);
    }

    private void initJavaFXCharts() {
        jfxPanel = new JFXPanel();
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        centerPanel.add(jfxPanel, BorderLayout.CENTER);
        
        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        String filter = (String) cmbFilter.getSelectedItem();
        
        // Update Swing UI
        SwingUtilities.invokeLater(() -> {
            cardTotalSales.setValue(CurrencyUtil.formatRupiah(analyticsService.getTotalSales(filter)));
            // Mock revenue as 30% profit from sales for display purposes or use actual formula
            cardTotalRevenue.setValue(CurrencyUtil.formatRupiah(analyticsService.getTotalSales(filter).multiply(new BigDecimal("0.30"))));
            cardTransactions.setValue(String.valueOf(analyticsService.getTransactionCount(filter)));
            cardProductsSold.setValue(String.valueOf(analyticsService.getProductsSold(filter)));
        });

        // Update JavaFX UI
        Platform.runLater(() -> {
            GridPane grid = new GridPane();
            grid.setHgap(10);
            grid.setVgap(10);

            // 1. Line Chart: Daily Sales
            CategoryAxis xAxis1 = new CategoryAxis();
            NumberAxis yAxis1 = new NumberAxis();
            LineChart<String, Number> lineChart = new LineChart<>(xAxis1, yAxis1);
            lineChart.setTitle("Trend Penjualan (30 Hari)");
            XYChart.Series<String, Number> series1 = new XYChart.Series<>();
            series1.setName("Penjualan");
            Map<String, BigDecimal> dailyData = analyticsService.getDailySalesChartData();
            for (Map.Entry<String, BigDecimal> entry : dailyData.entrySet()) {
                series1.getData().add(new XYChart.Data<>(entry.getKey(), entry.getValue().doubleValue()));
            }
            lineChart.getData().add(series1);
            lineChart.setPrefSize(400, 300);
            grid.add(lineChart, 0, 0);

            // 2. Bar Chart: Top Products
            CategoryAxis xAxis2 = new CategoryAxis();
            NumberAxis yAxis2 = new NumberAxis();
            BarChart<String, Number> barChart = new BarChart<>(xAxis2, yAxis2);
            barChart.setTitle("Produk Terlaris");
            XYChart.Series<String, Number> series2 = new XYChart.Series<>();
            series2.setName("Qty Terjual");
            Map<String, Integer> topProducts = analyticsService.getTopProductsChartData();
            for (Map.Entry<String, Integer> entry : topProducts.entrySet()) {
                series2.getData().add(new XYChart.Data<>(entry.getKey(), entry.getValue()));
            }
            barChart.getData().add(series2);
            barChart.setPrefSize(400, 300);
            grid.add(barChart, 1, 0);

            // 3. Pie Chart: Payment Methods
            PieChart pieChart = new PieChart();
            pieChart.setTitle("Metode Pembayaran");
            Map<String, Integer> payments = analyticsService.getPaymentMethodChartData();
            for (Map.Entry<String, Integer> entry : payments.entrySet()) {
                pieChart.getData().add(new PieChart.Data(entry.getKey(), entry.getValue()));
            }
            pieChart.setPrefSize(400, 300);
            grid.add(pieChart, 0, 1);

            Scene scene = new Scene(grid);
            jfxPanel.setScene(scene);
        });
    }

    private void startRealTimeClock() {
        clockTimer = new Timer(1000, e -> {
            LocalDateTime now = LocalDateTime.now();
            lblClock.setText(DateUtil.formatTime(now));
            lblDate.setText(DateUtil.formatDate(now));
        });
        clockTimer.start();
    }

    public void stopTimer() {
        if (clockTimer != null) {
            clockTimer.stop();
        }
    }
}
