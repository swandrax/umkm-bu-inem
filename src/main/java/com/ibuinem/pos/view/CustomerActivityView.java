package com.ibuinem.pos.view;

import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.CustomerActivity;
import com.ibuinem.pos.service.AnalyticsService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.DateUtil;
import com.ibuinem.pos.utils.ExcelExporter;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class CustomerActivityView extends JPanel {

    private final AnalyticsService analyticsService = new AnalyticsService();
    private ModernTable tblActivity;
    private DefaultTableModel tableModel;
    private JComboBox<String> cmbDateFilter;
    private List<CustomerActivity> currentData;
    private Timer autoRefreshTimer;

    public CustomerActivityView() {
        setLayout(new BorderLayout(20, 20));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initUI();
        startAutoRefresh();
    }

    private void initUI() {
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout(0, 15));
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.setOpaque(false);

        JLabel lblTitle = new JLabel("Aktivitas Customer Harian");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 18));
        lblTitle.setForeground(new Color(44, 62, 80));
        topPanel.add(lblTitle, BorderLayout.WEST);

        JPanel filterPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        filterPanel.setOpaque(false);
        
        cmbDateFilter = new JComboBox<>(new String[]{"TODAY", "ALL TIME"});
        cmbDateFilter.addActionListener(e -> refreshData());
        
        JButton btnExport = new JButton("Export Excel");
        btnExport.setBackground(new Color(46, 204, 113));
        btnExport.setForeground(Color.WHITE);
        btnExport.addActionListener(e -> exportToExcel());

        filterPanel.add(new JLabel("Filter: "));
        filterPanel.add(cmbDateFilter);
        filterPanel.add(btnExport);

        topPanel.add(filterPanel, BorderLayout.EAST);

        String[] columns = {
            "No", "Tanggal", "Nama Customer", "Phone", "Paket", "Items", "Qty", "Total (Rp)", "Pembayaran", "Status", "Pengiriman", "Catatan"
        };
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblActivity = new ModernTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tblActivity);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        centerPanel.add(topPanel, BorderLayout.NORTH);
        centerPanel.add(scrollPane, BorderLayout.CENTER);

        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        SwingUtilities.invokeLater(() -> {
            tableModel.setRowCount(0);
            String filter = (String) cmbDateFilter.getSelectedItem();
            currentData = analyticsService.getCustomerActivity(filter);
            
            int i = 1;
            for (CustomerActivity a : currentData) {
                tableModel.addRow(new Object[]{
                    i++,
                    DateUtil.formatTime(a.getTransactionDate()),
                    a.getCustomerName(),
                    a.getPhone(),
                    a.getPackageName(),
                    a.getTotalItems(),
                    a.getTotalProducts(),
                    CurrencyUtil.formatRupiah(a.getTotalPayment()),
                    a.getPaymentMethod(),
                    a.getPaymentStatus(),
                    a.getShippingType() + " (" + a.getShippingStatus() + ")",
                    a.getCourierNotes() != null ? a.getCourierNotes() : "-"
                });
            }
        });
    }

    private void startAutoRefresh() {
        autoRefreshTimer = new Timer(3000, e -> refreshData());
        autoRefreshTimer.start();
    }

    public void stopTimer() {
        if (autoRefreshTimer != null) {
            autoRefreshTimer.stop();
        }
    }

    private void exportToExcel() {
        if (currentData == null || currentData.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Tidak ada data untuk diexport!");
            return;
        }
        
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save as Excel");
        fileChooser.setSelectedFile(new java.io.File("Customer_Activity.xlsx"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            String path = fileChooser.getSelectedFile().getAbsolutePath();
            if (!path.endsWith(".xlsx")) path += ".xlsx";
            
            boolean success = ExcelExporter.exportCustomerActivityToExcel(currentData, path);
            if (success) {
                JOptionPane.showMessageDialog(this, "Export berhasil: " + path);
            } else {
                JOptionPane.showMessageDialog(this, "Gagal mengexport file!");
            }
        }
    }
}
