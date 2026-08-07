package com.ibuinem.pos.view;

import com.ibuinem.pos.model.User;
import com.ibuinem.pos.utils.DatabaseBackupUtil;
import com.ibuinem.pos.utils.SessionManager;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class MainFrame extends JFrame {

    private JPanel sidebarPanel;
    private JPanel contentCardPanel;
    private CardLayout cardLayout;

    private AnalyticsDashboardView dashboardView;
    private CustomerActivityView activityView;
    private ProductView productView;
    private TransactionView transactionView;
    private SalesHistoryView salesHistoryView;
    private ReportView reportView;
    private UserManagementView userManagementView;
    private ShippingView shippingView;
    private PackageManagementView packageManagementView;
    private BarcodeLabelView barcodeLabelView;

    private final List<MenuItemPanel> menuItems = new ArrayList<>();

    public MainFrame() {
        setTitle("Jajanan Ibu Inem - Desktop Point of Sales (POS)");
        setSize(1280, 768);
        setMinimumSize(new Dimension(1024, 650));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        initUI();
    }

    private void initUI() {
        JPanel rootContainer = new JPanel(new BorderLayout());
        rootContainer.setBackground(new Color(245, 247, 250));

        // 1. Left Sidebar Navigation
        initSidebar();

        // 2. Center Views Container
        cardLayout = new CardLayout();
        contentCardPanel = new JPanel(cardLayout);
        contentCardPanel.setOpaque(false);

        dashboardView = new AnalyticsDashboardView();
        activityView = new CustomerActivityView();
        productView = new ProductView();
        transactionView = new TransactionView();
        salesHistoryView = new SalesHistoryView();
        reportView = new ReportView();
        userManagementView = new UserManagementView();
        shippingView = new ShippingView();
        packageManagementView = new PackageManagementView();
        barcodeLabelView = new BarcodeLabelView();

        contentCardPanel.add(dashboardView, "DASHBOARD");
        contentCardPanel.add(activityView, "ACTIVITY");
        contentCardPanel.add(productView, "PRODUCT");
        contentCardPanel.add(transactionView, "TRANSACTION");
        contentCardPanel.add(salesHistoryView, "SALES");
        contentCardPanel.add(reportView, "REPORT");
        contentCardPanel.add(userManagementView, "USERS");
        contentCardPanel.add(shippingView, "SHIPPING");
        contentCardPanel.add(packageManagementView, "PACKAGES");
        contentCardPanel.add(barcodeLabelView, "BARCODE");

        rootContainer.add(sidebarPanel, BorderLayout.WEST);
        rootContainer.add(contentCardPanel, BorderLayout.CENTER);

        setContentPane(rootContainer);

        // Select Dashboard by default
        selectMenuItem(0, "DASHBOARD");
    }

    private void initSidebar() {
        sidebarPanel = new JPanel(new BorderLayout());
        sidebarPanel.setPreferredSize(new Dimension(240, 0));
        sidebarPanel.setBackground(new Color(30, 39, 46)); // Slate Dark background

        // Brand / Logo Section
        JPanel brandPanel = new JPanel(new BorderLayout(10, 5));
        brandPanel.setOpaque(false);
        brandPanel.setBorder(BorderFactory.createEmptyBorder(25, 20, 25, 20));

        JLabel lblBrandTitle = new JLabel("Jajanan Ibu Inem");
        lblBrandTitle.setFont(new Font("SansSerif", Font.BOLD, 16));
        lblBrandTitle.setForeground(new Color(46, 204, 113)); // Emerald Green

        JLabel lblBrandSub = new JLabel("POS Desktop App");
        lblBrandSub.setFont(new Font("SansSerif", Font.PLAIN, 11));
        lblBrandSub.setForeground(new Color(149, 165, 166));

        brandPanel.add(lblBrandTitle, BorderLayout.NORTH);
        brandPanel.add(lblBrandSub, BorderLayout.SOUTH);

        // Menu Items List
        JPanel menuContainer = new JPanel();
        menuContainer.setLayout(new BoxLayout(menuContainer, BoxLayout.Y_AXIS));
        menuContainer.setOpaque(false);
        menuContainer.setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 10));

        String[][] menus = {
            {"Dashboard", "🏠", "DASHBOARD"},
            {"Aktivitas Customer", "👥", "ACTIVITY"},
            {"Produk", "📦", "PRODUCT"},
            {"Transaksi", "🛒", "TRANSACTION"},
            {"Penjualan", "📋", "SALES"},
            {"Pengiriman Kurir", "🚚", "SHIPPING"},
            {"Paket Bundling", "🎁", "PACKAGES"},
            {"Cetak Barcode", "🏷️", "BARCODE"},
            {"Laporan", "📈", "REPORT"},
            {"Manajemen User", "⚙️", "USERS"}
        };

        for (int i = 0; i < menus.length; i++) {
            final int index = i;
            final String cardName = menus[i][2];
            MenuItemPanel item = new MenuItemPanel(menus[i][0], menus[i][1]);
            item.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    selectMenuItem(index, cardName);
                }
            });
            menuItems.add(item);
            menuContainer.add(item);
            menuContainer.add(Box.createRigidArea(new Dimension(0, 4)));
        }

        // Bottom User Session & Logout Panel
        JPanel bottomUserPanel = new JPanel(new BorderLayout(10, 10));
        bottomUserPanel.setOpaque(false);
        bottomUserPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 20, 15));

        User currentUser = SessionManager.getCurrentUser();
        String name = currentUser != null ? currentUser.getFullName() : "Kasir";
        String role = currentUser != null ? currentUser.getRole().name() : "CASHIER";

        JLabel lblUserInfo = new JLabel("<html><b>" + name + "</b><br><font size='2' color='#95a5a6'>" + role + "</font></html>");
        lblUserInfo.setForeground(Color.WHITE);

        MenuItemPanel btnBackup = new MenuItemPanel("Backup Database SQL", "💾");
        btnBackup.setBackgroundColor(new Color(52, 152, 219));
        btnBackup.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                JFileChooser fileChooser = new JFileChooser();
                fileChooser.setDialogTitle("Simpan Backup Database SQL");
                fileChooser.setSelectedFile(new File("backup_jajanan_ibu_inem_" + System.currentTimeMillis() + ".sql"));
                if (fileChooser.showSaveDialog(MainFrame.this) == JFileChooser.APPROVE_OPTION) {
                    File file = fileChooser.getSelectedFile();
                    if (!file.getAbsolutePath().endsWith(".sql")) {
                        file = new File(file.getAbsolutePath() + ".sql");
                    }
                    if (DatabaseBackupUtil.backupDatabase(file)) {
                        JOptionPane.showMessageDialog(MainFrame.this, "Backup Database berhasil disimpan ke:\n" + file.getAbsolutePath(), "Backup Sukses", JOptionPane.INFORMATION_MESSAGE);
                    } else {
                        JOptionPane.showMessageDialog(MainFrame.this, "Gagal membuat backup database!", "Error", JOptionPane.ERROR_MESSAGE);
                    }
                }
            }
        });

        MenuItemPanel btnLogout = new MenuItemPanel("Logout", "🚪");
        btnLogout.setBackgroundColor(new Color(231, 76, 60)); // Red
        btnLogout.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int confirm = JOptionPane.showConfirmDialog(MainFrame.this,
                    "Apakah Anda yakin ingin logout dari aplikasi?",
                    "Konfirmasi Logout", JOptionPane.YES_NO_OPTION);
                if (confirm == JOptionPane.YES_OPTION) {
                    dashboardView.stopTimer();
                    SessionManager.logout();
                    dispose();
                    new LoginFrame().setVisible(true);
                }
            }
        });

        JPanel actionContainer = new JPanel(new GridLayout(2, 1, 0, 5));
        actionContainer.setOpaque(false);
        actionContainer.add(btnBackup);
        actionContainer.add(btnLogout);

        bottomUserPanel.add(lblUserInfo, BorderLayout.NORTH);
        bottomUserPanel.add(actionContainer, BorderLayout.SOUTH);

        sidebarPanel.add(brandPanel, BorderLayout.NORTH);
        sidebarPanel.add(menuContainer, BorderLayout.CENTER);
        sidebarPanel.add(bottomUserPanel, BorderLayout.SOUTH);
    }

    private void selectMenuItem(int index, String cardName) {
        for (int i = 0; i < menuItems.size(); i++) {
            menuItems.get(i).setSelected(i == index);
        }
        cardLayout.show(contentCardPanel, cardName);

        // Refresh views on switch
        if ("DASHBOARD".equals(cardName)) dashboardView.refreshData();
        else if ("ACTIVITY".equals(cardName)) activityView.refreshData();
        else if ("PRODUCT".equals(cardName)) productView.refreshData();
        else if ("TRANSACTION".equals(cardName)) transactionView.refreshData();
        else if ("SALES".equals(cardName)) salesHistoryView.refreshData();
        else if ("SHIPPING".equals(cardName)) shippingView.refreshData();
        else if ("PACKAGES".equals(cardName)) packageManagementView.refreshData();
        else if ("BARCODE".equals(cardName)) barcodeLabelView.refreshData();
        else if ("REPORT".equals(cardName)) reportView.refreshData();
        else if ("USERS".equals(cardName)) userManagementView.refreshData();
    }

    private static class MenuItemPanel extends JPanel {
        private final JLabel lblText;
        private final JLabel lblIcon;
        private boolean isSelected = false;
        private Color customBg = null;

        public MenuItemPanel(String title, String icon) {
            setLayout(new BorderLayout(12, 0));
            setOpaque(false);
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            setBorder(BorderFactory.createEmptyBorder(6, 12, 6, 12));

            lblIcon = new JLabel(icon);
            lblIcon.setFont(new Font("SansSerif", Font.PLAIN, 14));
            lblIcon.setForeground(Color.WHITE);

            lblText = new JLabel(title);
            lblText.setFont(new Font("SansSerif", Font.BOLD, 12));
            lblText.setForeground(new Color(189, 195, 199));

            add(lblIcon, BorderLayout.WEST);
            add(lblText, BorderLayout.CENTER);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mouseEntered(MouseEvent e) {
                    if (!isSelected && customBg == null) {
                        setBackground(new Color(44, 62, 80));
                        lblText.setForeground(Color.WHITE);
                        repaint();
                    }
                }
                @Override
                public void mouseExited(MouseEvent e) {
                    if (!isSelected && customBg == null) {
                        setBackground(new Color(30, 39, 46));
                        lblText.setForeground(new Color(189, 195, 199));
                        repaint();
                    }
                }
            });
        }

        public void setSelected(boolean selected) {
            this.isSelected = selected;
            if (selected) {
                setBackground(new Color(46, 204, 113)); // Emerald Green
                lblText.setForeground(Color.WHITE);
                lblIcon.setForeground(Color.WHITE);
            } else {
                setBackground(new Color(30, 39, 46));
                lblText.setForeground(new Color(189, 195, 199));
                lblIcon.setForeground(Color.WHITE);
            }
            repaint();
        }

        public void setBackgroundColor(Color bg) {
            this.customBg = bg;
            setBackground(bg);
            lblText.setForeground(Color.WHITE);
            repaint();
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(getBackground());
            g2.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
            g2.dispose();
            super.paintComponent(g);
        }
    }
}
