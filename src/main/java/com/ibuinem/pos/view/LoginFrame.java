package com.ibuinem.pos.view;

import com.formdev.flatlaf.FlatClientProperties;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.User;
import com.ibuinem.pos.service.AuthService;
import com.ibuinem.pos.utils.ModernTextField;
import com.ibuinem.pos.utils.SessionManager;

import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class LoginFrame extends JFrame {

    private ModernTextField txtUsername;
    private JPasswordField txtPassword;
    private RoundedButton btnLogin;
    private JLabel lblStatus;
    private JLabel lblDbStatus;

    private final AuthService authService = new AuthService();

    public LoginFrame() {
        setTitle("Login - Jajanan Ibu Inem POS");
        setSize(420, 520);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        initUI();
        checkDatabaseConnection();
    }

    private void initUI() {
        JPanel rootPanel = new JPanel(new GridBagLayout());
        rootPanel.setBackground(new Color(245, 247, 250));

        RoundedPanel cardPanel = new RoundedPanel(20, Color.WHITE);
        cardPanel.setPreferredSize(new Dimension(360, 440));
        cardPanel.setLayout(new BoxLayout(cardPanel, BoxLayout.Y_AXIS));
        cardPanel.setBorder(BorderFactory.createEmptyBorder(30, 30, 30, 30));

        // Header Title
        JLabel lblAppTitle = new JLabel("JAJANAN IBU INEM");
        lblAppTitle.setFont(new Font("SansSerif", Font.BOLD, 22));
        lblAppTitle.setForeground(new Color(46, 204, 113)); // Emerald Green
        lblAppTitle.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel lblSub = new JLabel("Point of Sales Desktop App");
        lblSub.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblSub.setForeground(new Color(149, 165, 166));
        lblSub.setAlignmentX(Component.CENTER_ALIGNMENT);

        // Username Field
        JLabel lblUser = new JLabel("Username");
        lblUser.setFont(new Font("SansSerif", Font.BOLD, 12));
        lblUser.setForeground(new Color(44, 62, 80));
        lblUser.setAlignmentX(Component.LEFT_ALIGNMENT);

        txtUsername = new ModernTextField("Masukkan username (admin / kasir)");
        txtUsername.setMaximumSize(new Dimension(300, 38));
        txtUsername.setAlignmentX(Component.LEFT_ALIGNMENT);

        // Password Field
        JLabel lblPass = new JLabel("Password");
        lblPass.setFont(new Font("SansSerif", Font.BOLD, 12));
        lblPass.setForeground(new Color(44, 62, 80));
        lblPass.setAlignmentX(Component.LEFT_ALIGNMENT);

        txtPassword = new JPasswordField();
        txtPassword.putClientProperty(FlatClientProperties.PLACEHOLDER_TEXT, "Masukkan password (admin123 / kasir123)");
        txtPassword.setFont(new Font("SansSerif", Font.PLAIN, 13));
        txtPassword.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(220, 224, 230), 1, true),
            BorderFactory.createEmptyBorder(8, 12, 8, 12)
        ));
        txtPassword.setMaximumSize(new Dimension(300, 38));
        txtPassword.setAlignmentX(Component.LEFT_ALIGNMENT);

        // Login Button
        btnLogin = new RoundedButton("MASUK APLIKASI", new Color(46, 204, 113), new Color(39, 174, 96));
        btnLogin.setMaximumSize(new Dimension(300, 42));
        btnLogin.setAlignmentX(Component.CENTER_ALIGNMENT);
        btnLogin.addActionListener(e -> performLogin());

        // Key Listener (Enter key triggers login)
        KeyAdapter enterKeyAdapter = new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    performLogin();
                }
            }
        };
        txtUsername.addKeyListener(enterKeyAdapter);
        txtPassword.addKeyListener(enterKeyAdapter);

        // Status Label
        lblStatus = new JLabel(" ");
        lblStatus.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblStatus.setForeground(new Color(231, 76, 60)); // Red
        lblStatus.setAlignmentX(Component.CENTER_ALIGNMENT);

        // DB Status Indicator
        lblDbStatus = new JLabel("Status DB: Memeriksa koneksi...");
        lblDbStatus.setFont(new Font("SansSerif", Font.ITALIC, 11));
        lblDbStatus.setForeground(new Color(127, 140, 141));
        lblDbStatus.setAlignmentX(Component.CENTER_ALIGNMENT);

        // Add components to card
        cardPanel.add(lblAppTitle);
        cardPanel.add(lblSub);
        cardPanel.add(Box.createRigidArea(new Dimension(0, 25)));

        cardPanel.add(lblUser);
        cardPanel.add(Box.createRigidArea(new Dimension(0, 5)));
        cardPanel.add(txtUsername);
        cardPanel.add(Box.createRigidArea(new Dimension(0, 15)));

        cardPanel.add(lblPass);
        cardPanel.add(Box.createRigidArea(new Dimension(0, 5)));
        cardPanel.add(txtPassword);
        cardPanel.add(Box.createRigidArea(new Dimension(0, 20)));

        cardPanel.add(btnLogin);
        cardPanel.add(Box.createRigidArea(new Dimension(0, 10)));
        cardPanel.add(lblStatus);
        cardPanel.add(Box.createVerticalGlue());
        cardPanel.add(lblDbStatus);

        rootPanel.add(cardPanel);
        setContentPane(rootPanel);
    }

    private void checkDatabaseConnection() {
        SwingUtilities.invokeLater(() -> {
            boolean connected = DatabaseConfig.testConnection();
            if (connected) {
                lblDbStatus.setText("● MySQL Connected (jajanan_ibu_inem)");
                lblDbStatus.setForeground(new Color(39, 174, 96)); // Green
            } else {
                lblDbStatus.setText("● MySQL Disconnected! (Pastikan XAMPP/Laragon berjalan)");
                lblDbStatus.setForeground(new Color(231, 76, 60)); // Red
            }
        });
    }

    private void performLogin() {
        String username = txtUsername.getText();
        String password = new String(txtPassword.getPassword());

        if (username.isEmpty() || password.isEmpty()) {
            lblStatus.setText("Username dan Password tidak boleh kosong!");
            return;
        }

        lblStatus.setText("Memeriksa kredensial...");
        btnLogin.setEnabled(false);

        SwingUtilities.invokeLater(() -> {
            User user = authService.login(username, password);
            if (user != null) {
                SessionManager.setCurrentUser(user);
                dispose(); // Close Login window
                new MainFrame().setVisible(true); // Open Main App window
            } else {
                lblStatus.setText("Username atau Password salah!");
                btnLogin.setEnabled(true);
            }
        });
    }
}
