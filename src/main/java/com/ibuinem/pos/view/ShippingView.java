package com.ibuinem.pos.view;

import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.DeliveryLog;
import com.ibuinem.pos.model.Shipping;
import com.ibuinem.pos.service.ShippingService;
import com.ibuinem.pos.utils.DateUtil;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class ShippingView extends JPanel {

    private final ShippingService shippingService = new ShippingService();
    private ModernTable tblShipping;
    private DefaultTableModel tableModel;
    private List<Shipping> currentShippingList;

    private RoundedButton btnUpdateStatus;
    private RoundedButton btnViewLogs;
    private RoundedButton btnRefresh;

    public ShippingView() {
        setLayout(new BorderLayout(20, 20));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initHeader();
        initTable();
        refreshData();
    }

    private void initHeader() {
        RoundedPanel topPanel = new RoundedPanel(15, Color.WHITE);
        topPanel.setLayout(new BorderLayout(15, 15));
        topPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblTitle = new JLabel("Manajemen Pengiriman & Tracking Kurir");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        btnPanel.setOpaque(false);

        btnUpdateStatus = new RoundedButton("Update Status Kurir", new Color(46, 204, 113), new Color(39, 174, 96));
        btnUpdateStatus.setPreferredSize(new Dimension(170, 38));
        btnUpdateStatus.addActionListener(e -> showUpdateStatusDialog());

        btnViewLogs = new RoundedButton("Riwayat Log", new Color(52, 152, 219), new Color(41, 128, 185));
        btnViewLogs.setPreferredSize(new Dimension(120, 38));
        btnViewLogs.addActionListener(e -> showLogsDialog());

        btnRefresh = new RoundedButton("Refresh", new Color(149, 165, 166), new Color(127, 140, 141));
        btnRefresh.setPreferredSize(new Dimension(90, 38));
        btnRefresh.addActionListener(e -> refreshData());

        btnPanel.add(btnUpdateStatus);
        btnPanel.add(btnViewLogs);
        btnPanel.add(btnRefresh);

        topPanel.add(lblTitle, BorderLayout.WEST);
        topPanel.add(btnPanel, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
    }

    private void initTable() {
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        String[] columns = {"ID", "ID Transaksi", "Jenis Pengiriman", "Status Kurir", "Catatan Pelanggan", "Catatan Kurir"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblShipping = new ModernTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tblShipping);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        centerPanel.add(scrollPane, BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        currentShippingList = shippingService.getAllShipping();
        tableModel.setRowCount(0);
        if (currentShippingList != null) {
            for (Shipping s : currentShippingList) {
                tableModel.addRow(new Object[]{
                    s.getId(),
                    "Trx #" + s.getSaleId(),
                    s.getShippingType(),
                    s.getShippingStatus(),
                    s.getCustomerNotes() != null ? s.getCustomerNotes() : "-",
                    s.getCourierNotes() != null ? s.getCourierNotes() : "-"
                });
            }
        }
    }

    private void showUpdateStatusDialog() {
        int row = tblShipping.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Pilih data pengiriman terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Shipping shipping = currentShippingList.get(row);
        String[] statuses = {"PENDING", "DIPROSES", "SEDANG DIANTAR", "SELESAI", "DIBATALKAN"};

        JComboBox<String> cmbStatus = new JComboBox<>(statuses);
        cmbStatus.setSelectedItem(shipping.getShippingStatus());

        JTextField txtNote = new JTextField();

        JPanel panel = new JPanel(new GridLayout(2, 2, 10, 10));
        panel.add(new JLabel("Status Baru:"));
        panel.add(cmbStatus);
        panel.add(new JLabel("Keterangan Log:"));
        panel.add(txtNote);

        int option = JOptionPane.showConfirmDialog(this, panel, "Update Status Pengiriman Trx #" + shipping.getSaleId(), JOptionPane.OK_CANCEL_OPTION);
        if (option == JOptionPane.OK_OPTION) {
            String newStatus = (String) cmbStatus.getSelectedItem();
            String note = txtNote.getText().trim();

            if (shippingService.updateStatus(shipping.getId(), newStatus, note.isEmpty() ? "Status diubah ke " + newStatus : note)) {
                JOptionPane.showMessageDialog(this, "Status pengiriman berhasil diperbarui!");
                refreshData();
            } else {
                JOptionPane.showMessageDialog(this, "Gagal memperbarui status pengiriman!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void showLogsDialog() {
        int row = tblShipping.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Pilih data pengiriman terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Shipping shipping = currentShippingList.get(row);
        List<DeliveryLog> logs = shippingService.getDeliveryLogs(shipping.getId());

        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Riwayat Log Pengiriman Trx #" + shipping.getSaleId(), true);
        dialog.setLayout(new BorderLayout());
        dialog.setSize(500, 350);
        dialog.setLocationRelativeTo(this);

        String[] cols = {"Waktu", "Status", "Keterangan"};
        DefaultTableModel logModel = new DefaultTableModel(cols, 0);
        if (logs != null) {
            for (DeliveryLog log : logs) {
                logModel.addRow(new Object[]{
                    log.getTimestamp() != null ? DateUtil.formatDateTime(log.getTimestamp()) : "-",
                    log.getStatus(),
                    log.getDescription() != null ? log.getDescription() : "-"
                });
            }
        }

        ModernTable tblLogs = new ModernTable(logModel);
        JScrollPane scroll = new JScrollPane(tblLogs);
        scroll.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        dialog.add(scroll, BorderLayout.CENTER);
        dialog.setVisible(true);
    }
}
