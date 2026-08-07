package com.ibuinem.pos.view;

import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.PackageBenefit;
import com.ibuinem.pos.model.PackageModel;
import com.ibuinem.pos.service.PackageService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.ModernTextField;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.math.BigDecimal;
import java.util.List;

public class PackageManagementView extends JPanel {

    private final PackageService packageService = new PackageService();
    private ModernTable tblPackages;
    private DefaultTableModel tableModel;
    private List<PackageModel> currentPackageList;

    private RoundedButton btnAdd;
    private RoundedButton btnEdit;
    private RoundedButton btnBenefits;
    private RoundedButton btnRefresh;

    public PackageManagementView() {
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

        JLabel lblTitle = new JLabel("Manajemen Paket Bundling Snack");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        btnPanel.setOpaque(false);

        btnAdd = new RoundedButton("Tambah Paket", new Color(46, 204, 113), new Color(39, 174, 96));
        btnAdd.setPreferredSize(new Dimension(140, 38));
        btnAdd.addActionListener(e -> showPackageDialog(null));

        btnEdit = new RoundedButton("Edit Paket", new Color(52, 152, 219), new Color(41, 128, 185));
        btnEdit.setPreferredSize(new Dimension(120, 38));
        btnEdit.addActionListener(e -> editSelectedPackage());

        btnBenefits = new RoundedButton("Kelola Benefit", new Color(155, 89, 182), new Color(142, 68, 173));
        btnBenefits.setPreferredSize(new Dimension(140, 38));
        btnBenefits.addActionListener(e -> manageBenefits());

        btnRefresh = new RoundedButton("Refresh", new Color(149, 165, 166), new Color(127, 140, 141));
        btnRefresh.setPreferredSize(new Dimension(90, 38));
        btnRefresh.addActionListener(e -> refreshData());

        btnPanel.add(btnAdd);
        btnPanel.add(btnEdit);
        btnPanel.add(btnBenefits);
        btnPanel.add(btnRefresh);

        topPanel.add(lblTitle, BorderLayout.WEST);
        topPanel.add(btnPanel, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
    }

    private void initTable() {
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        String[] columns = {"ID", "Nama Paket", "Harga Paket", "Deskripsi", "Status"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblPackages = new ModernTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tblPackages);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        centerPanel.add(scrollPane, BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        currentPackageList = packageService.getAllPackages();
        tableModel.setRowCount(0);
        if (currentPackageList != null) {
            for (PackageModel p : currentPackageList) {
                tableModel.addRow(new Object[]{
                    p.getId(),
                    p.getName(),
                    CurrencyUtil.formatRupiah(p.getPrice()),
                    p.getDescription() != null ? p.getDescription() : "-",
                    p.isActive() ? "Aktif" : "Non-Aktif"
                });
            }
        }
    }

    private void editSelectedPackage() {
        int row = tblPackages.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Pilih paket yang ingin diedit!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }
        showPackageDialog(currentPackageList.get(row));
    }

    private void showPackageDialog(PackageModel existingPkg) {
        boolean isEdit = existingPkg != null;
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), isEdit ? "Edit Paket" : "Tambah Paket", true);
        dialog.setLayout(new BorderLayout(15, 15));
        dialog.setSize(400, 300);
        dialog.setLocationRelativeTo(this);

        JPanel form = new JPanel(new GridLayout(4, 2, 10, 15));
        form.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        ModernTextField txtName = new ModernTextField("Nama Paket");
        ModernTextField txtPrice = new ModernTextField("Harga (Rp)");
        ModernTextField txtDesc = new ModernTextField("Deskripsi");
        JCheckBox chkActive = new JCheckBox("Aktif", true);

        if (isEdit) {
            txtName.setText(existingPkg.getName());
            txtPrice.setText(existingPkg.getPrice() != null ? existingPkg.getPrice().toString() : "0");
            txtDesc.setText(existingPkg.getDescription() != null ? existingPkg.getDescription() : "");
            chkActive.setSelected(existingPkg.isActive());
        }

        form.add(new JLabel("Nama Paket:"));
        form.add(txtName);
        form.add(new JLabel("Harga:"));
        form.add(txtPrice);
        form.add(new JLabel("Deskripsi:"));
        form.add(txtDesc);
        form.add(new JLabel("Status:"));
        form.add(chkActive);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton btnSave = new JButton("Simpan");
        btnSave.setBackground(new Color(46, 204, 113));
        btnSave.setForeground(Color.WHITE);
        btnSave.addActionListener(e -> {
            String name = txtName.getText().trim();
            String priceStr = txtPrice.getText().trim();
            String desc = txtDesc.getText().trim();

            if (name.isEmpty() || priceStr.isEmpty()) {
                JOptionPane.showMessageDialog(dialog, "Nama dan harga wajib diisi!", "Peringatan", JOptionPane.WARNING_MESSAGE);
                return;
            }

            try {
                BigDecimal price = new BigDecimal(priceStr);
                PackageModel pkg = isEdit ? existingPkg : new PackageModel();
                pkg.setName(name);
                pkg.setPrice(price);
                pkg.setDescription(desc);
                pkg.setActive(chkActive.isSelected());

                if (packageService.savePackage(pkg)) {
                    JOptionPane.showMessageDialog(dialog, "Paket berhasil disimpan!");
                    dialog.dispose();
                    refreshData();
                } else {
                    JOptionPane.showMessageDialog(dialog, "Gagal menyimpan paket!", "Error", JOptionPane.ERROR_MESSAGE);
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialog, "Format harga tidak valid!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        btnPanel.add(btnSave);
        dialog.add(form, BorderLayout.CENTER);
        dialog.add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void manageBenefits() {
        int row = tblPackages.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Pilih paket terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        PackageModel pkg = currentPackageList.get(row);
        List<PackageBenefit> benefits = packageService.getBenefits(pkg.getId());

        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Benefit Paket: " + pkg.getName(), true);
        dialog.setLayout(new BorderLayout(10, 10));
        dialog.setSize(450, 320);
        dialog.setLocationRelativeTo(this);

        DefaultListModel<String> listModel = new DefaultListModel<>();
        if (benefits != null) {
            for (PackageBenefit b : benefits) {
                listModel.addElement("• " + b.getBenefitDetail());
            }
        }

        JList<String> list = new JList<>(listModel);
        list.setFont(new Font("SansSerif", Font.PLAIN, 13));
        JScrollPane scroll = new JScrollPane(list);

        JPanel inputPanel = new JPanel(new BorderLayout(10, 0));
        ModernTextField txtNewBenefit = new ModernTextField("Tambah Benefit Baru...");
        JButton btnAddBenefit = new JButton("Tambah");
        btnAddBenefit.setBackground(new Color(46, 204, 113));
        btnAddBenefit.setForeground(Color.WHITE);

        btnAddBenefit.addActionListener(e -> {
            String detail = txtNewBenefit.getText().trim();
            if (!detail.isEmpty()) {
                if (packageService.addBenefit(pkg.getId(), detail)) {
                    listModel.addElement("• " + detail);
                    txtNewBenefit.setText("");
                } else {
                    JOptionPane.showMessageDialog(dialog, "Gagal menambah benefit!");
                }
            }
        });

        inputPanel.add(txtNewBenefit, BorderLayout.CENTER);
        inputPanel.add(btnAddBenefit, BorderLayout.EAST);
        inputPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        dialog.add(scroll, BorderLayout.CENTER);
        dialog.add(inputPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }
}
