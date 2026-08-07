package com.ibuinem.pos.utils;

import javax.swing.*;
import java.awt.*;

public class ModernTextField extends JTextField {

    private String placeholder;

    public ModernTextField(String placeholder) {
        super();
        this.placeholder = placeholder;
        setFont(new Font("SansSerif", Font.PLAIN, 11));
        setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(220, 224, 230), 1, true),
            BorderFactory.createEmptyBorder(6, 10, 6, 10)
        ));
    }

    public ModernTextField() {
        this("");
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        if (placeholder != null && !placeholder.isEmpty() && getText().isEmpty()) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(new Color(170, 175, 185));
            g2.setFont(getFont().deriveFont(Font.ITALIC));
            Insets insets = getInsets();
            g2.drawString(placeholder, insets.left, getHeight() / 2 + g2.getFontMetrics().getAscent() / 2 - 2);
            g2.dispose();
        }
    }

    public void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
        repaint();
    }
}
