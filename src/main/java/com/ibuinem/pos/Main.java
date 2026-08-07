package com.ibuinem.pos;

import com.formdev.flatlaf.FlatLightLaf;
import com.ibuinem.pos.view.LoginFrame;

import javax.swing.*;

public class Main {

    public static void main(String[] args) {
        // Setup FlatLaf Light Look & Feel
        try {
            UIManager.setLookAndFeel(new FlatLightLaf());
            // Enable System Font Antialiasing
            System.setProperty("awt.useSystemAAFontSettings", "on");
            System.setProperty("swing.aatext", "true");
        } catch (Exception e) {
            System.err.println("Failed to initialize FlatLaf Look and Feel: " + e.getMessage());
        }

        // Launch Application UI on Event Dispatch Thread (EDT)
        SwingUtilities.invokeLater(() -> {
            LoginFrame loginFrame = new LoginFrame();
            loginFrame.setVisible(true);
        });
    }
}
