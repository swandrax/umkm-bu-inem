package com.ibuinem.pos.view;

import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.User;
import com.ibuinem.pos.service.UserService;
import com.ibuinem.pos.utils.DateUtil;
import com.ibuinem.pos.utils.ModernTextField;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class UserManagementView extends JPanel {

    private final UserService userService = new UserService();
    private ModernTable tblUsers;
    private DefaultTableModel tableModel;
    private List<User> currentUsers;

    private RoundedButton btnAdd;
    private RoundedButton btnEdit;
    private RoundedButton btnResetPassword;
    private RoundedButton btnToggleStatus;
    private RoundedButton btnRefresh;

    public UserManagementView() {
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

        JLabel lblTitle = new JLabel("Manajemen Pengguna (Kasir & Admin)");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        btnPanel.setOpaque(false);

        btnAdd = new RoundedButton("Tambah User", new Color(46, 204, 113), new Color(39, 174, 96));
        btnAdd.setPreferredSize(new Dimension(130, 38));
        btnAdd.addActionListener(e -> showAddUserDialog());

        btnEdit = new RoundedButton("Edit User", new Color(52, 152, 219), new Color(41, 128, 185));
        btnEdit.setPreferredSize(new Dimension(110, 38));
        btnEdit.addActionListener(e -> showEditUserDialog());

        btnResetPassword = new RoundedButton("Reset Password", new Color(241, 196, 15), new Color(211, 84, 0));
        btnResetPassword.setPreferredSize(new Dimension(140, 38));
        btnResetPassword.addActionListener(e -> showResetPasswordDialog());

        btnToggleStatus = new RoundedButton("Aktif / Non-Aktif", new Color(231, 76, 60), new Color(192, 57, 43));
        btnToggleStatus.setPreferredSize(new Dimension(140, 38));
        btnToggleStatus.addActionListener(e -> toggleUserStatus());

        btnRefresh = new RoundedButton("Refresh", new Color(149, 165, 166), new Color(127, 140, 141));
        btnRefresh.setPreferredSize(new Dimension(90, 38));
        btnRefresh.addActionListener(e -> refreshData());

        btnPanel.add(btnAdd);
        btnPanel.add(btnEdit);
        btnPanel.add(btnResetPassword);
        btnPanel.add(btnToggleStatus);
        btnPanel.add(btnRefresh);

        topPanel.add(lblTitle, BorderLayout.WEST);
        topPanel.add(btnPanel, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
    }

    private void initTable() {
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        String[] columns = {"ID", "Username", "Nama Lengkap", "Role", "Status", "Tanggal Dibuat"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblUsers = new ModernTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tblUsers);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        centerPanel.add(scrollPane, BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        currentUsers = userService.getAllUsers();
        tableModel.setRowCount(0);
        if (currentUsers != null) {
            for (User u : currentUsers) {
                tableModel.addRow(new Object[]{
                    u.getId(),
                    u.getUsername(),
                    u.getFullName(),
                    u.getRole().name(),
                    u.isActive() ? "Aktif" : "Non-Aktif",
                    u.getCreatedAt() != null ? DateUtil.formatDateTime(u.getCreatedAt()) : "-"
                });
            }
        }
    }

    private void showAddUserDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Tambah Pengguna Baru", true);
        dialog.setLayout(new BorderLayout(15, 15));
        dialog.setSize(400, 350);
        dialog.setLocationRelativeTo(this);

        JPanel formPanel = new JPanel(new GridLayout(4, 2, 10, 15));
        formPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        ModernTextField txtUsername = new ModernTextField("Username");
        JPasswordField txtPassword = new JPasswordField();
        ModernTextField txtFullName = new ModernTextField("Nama Lengkap");
        JComboBox<User.Role> cmbRole = new JComboBox<>(User.Role.values());

        formPanel.add(new JLabel("Username:"));
        formPanel.add(txtUsername);
        formPanel.add(new JLabel("Password:"));
        formPanel.add(txtPassword);
        formPanel.add(new JLabel("Nama Lengkap:"));
        formPanel.add(txtFullName);
        formPanel.add(new JLabel("Role:"));
        formPanel.add(cmbRole);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton btnSave = new JButton("Simpan");
        btnSave.setBackground(new Color(46, 204, 113));
        btnSave.setForeground(Color.WHITE);
        btnSave.addActionListener(e -> {
            String username = txtUsername.getText().trim();
            String password = new String(txtPassword.getPassword()).trim();
            String fullName = txtFullName.getText().trim();
            User.Role role = (User.Role) cmbRole.getSelectedItem();

            if (username.isEmpty() || password.isEmpty() || fullName.isEmpty()) {
                JOptionPane.showMessageDialog(dialog, "Semua field wajib diisi!", "Peringatan", JOptionPane.WARNING_MESSAGE);
                return;
            }

            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setFullName(fullName);
            user.setRole(role);
            user.setActive(true);

            if (userService.createUser(user)) {
                JOptionPane.showMessageDialog(dialog, "User berhasil ditambahkan!");
                dialog.dispose();
                refreshData();
            } else {
                JOptionPane.showMessageDialog(dialog, "Gagal menambah user! Username mungkin sudah digunakan.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        btnPanel.add(btnSave);
        dialog.add(formPanel, BorderLayout.CENTER);
        dialog.add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void showEditUserDialog() {
        int selectedRow = tblUsers.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Pilih user dari tabel terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        User user = currentUsers.get(selectedRow);

        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Edit Pengguna", true);
        dialog.setLayout(new BorderLayout(15, 15));
        dialog.setSize(400, 300);
        dialog.setLocationRelativeTo(this);

        JPanel formPanel = new JPanel(new GridLayout(3, 2, 10, 15));
        formPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        ModernTextField txtFullName = new ModernTextField("Nama Lengkap");
        txtFullName.setText(user.getFullName());

        JComboBox<User.Role> cmbRole = new JComboBox<>(User.Role.values());
        cmbRole.setSelectedItem(user.getRole());

        JCheckBox chkActive = new JCheckBox("Aktif", user.isActive());

        formPanel.add(new JLabel("Nama Lengkap:"));
        formPanel.add(txtFullName);
        formPanel.add(new JLabel("Role:"));
        formPanel.add(cmbRole);
        formPanel.add(new JLabel("Status:"));
        formPanel.add(chkActive);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton btnSave = new JButton("Simpan Perubahan");
        btnSave.setBackground(new Color(52, 152, 219));
        btnSave.setForeground(Color.WHITE);
        btnSave.addActionListener(e -> {
            user.setFullName(txtFullName.getText().trim());
            user.setRole((User.Role) cmbRole.getSelectedItem());
            user.setActive(chkActive.isSelected());

            if (userService.updateUser(user)) {
                JOptionPane.showMessageDialog(dialog, "User berhasil diperbarui!");
                dialog.dispose();
                refreshData();
            } else {
                JOptionPane.showMessageDialog(dialog, "Gagal mengupdate user!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        btnPanel.add(btnSave);
        dialog.add(formPanel, BorderLayout.CENTER);
        dialog.add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void showResetPasswordDialog() {
        int selectedRow = tblUsers.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Pilih user dari tabel terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        User user = currentUsers.get(selectedRow);
        String newPassword = JOptionPane.showInputDialog(this, "Masukkan Password Baru untuk " + user.getUsername() + ":");

        if (newPassword != null && !newPassword.trim().isEmpty()) {
            if (userService.resetPassword(user.getId(), newPassword.trim())) {
                JOptionPane.showMessageDialog(this, "Password berhasil di-reset!");
            } else {
                JOptionPane.showMessageDialog(this, "Gagal reset password!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void toggleUserStatus() {
        int selectedRow = tblUsers.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Pilih user dari tabel terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        User user = currentUsers.get(selectedRow);
        boolean newStatus = !user.isActive();
        String action = newStatus ? "mengaktifkan" : "non-aktifkan";

        int confirm = JOptionPane.showConfirmDialog(this, "Apakah Anda yakin ingin " + action + " user " + user.getUsername() + "?", "Konfirmasi", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            if (userService.toggleActive(user.getId(), newStatus)) {
                JOptionPane.showMessageDialog(this, "Status user berhasil diubah!");
                refreshData();
            } else {
                JOptionPane.showMessageDialog(this, "Gagal merubah status user!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}
