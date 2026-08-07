package com.ibuinem.pos.component;

import javax.swing.*;
import java.awt.*;

public class CardPanel extends RoundedPanel {

    private JLabel lblTitle;
    private JLabel lblValue;
    private JLabel lblIcon;

    public CardPanel(String title, String value, String iconText, Color accentColor) {
        super(15, Color.WHITE);
        setLayout(new BorderLayout(15, 10));
        setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        // Left Container (Title + Value)
        JPanel leftPanel = new JPanel();
        leftPanel.setLayout(new BoxLayout(leftPanel, BoxLayout.Y_AXIS));
        leftPanel.setOpaque(false);

        lblTitle = new JLabel(title);
        lblTitle.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblTitle.setForeground(new Color(127, 140, 141));

        lblValue = new JLabel(value);
        lblValue.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblValue.setForeground(new Color(44, 62, 80));

        leftPanel.add(lblTitle);
        leftPanel.add(Box.createRigidArea(new Dimension(0, 8)));
        leftPanel.add(lblValue);

        // Right Icon Badge
        JPanel iconPanel = new RoundedPanel(30, accentColor);
        iconPanel.setLayout(new GridBagLayout());
        iconPanel.setPreferredSize(new Dimension(50, 50));

        lblIcon = new JLabel(iconText);
        lblIcon.setFont(new Font("SansSerif", Font.BOLD, 18));
        lblIcon.setForeground(Color.WHITE);
        iconPanel.add(lblIcon);

        add(leftPanel, BorderLayout.CENTER);
        add(iconPanel, BorderLayout.EAST);
    }

    public void setValue(String value) {
        lblValue.setText(value);
    }

    public void setTitle(String title) {
        lblTitle.setText(title);
    }
}
