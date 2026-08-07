package com.ibuinem.pos.component;

import javax.swing.*;
import java.awt.*;

public class RoundedPanel extends JPanel {

    private int cornerRadius;
    private Color backgroundColor;
    private Color shadowColor;

    public RoundedPanel(int radius, Color bg) {
        super();
        this.cornerRadius = radius;
        this.backgroundColor = bg;
        this.shadowColor = new Color(0, 0, 0, 15); // Subtle shadow
        setOpaque(false);
    }

    public RoundedPanel(int radius) {
        this(radius, Color.WHITE);
    }

    public RoundedPanel() {
        this(15, Color.WHITE);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Dimension arcs = new Dimension(cornerRadius, cornerRadius);
        int width = getWidth();
        int height = getHeight();
        Graphics2D graphics = (Graphics2D) g;
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Draw shadow
        if (shadowColor != null) {
            graphics.setColor(shadowColor);
            graphics.fillRoundRect(2, 2, width - 4, height - 4, arcs.width, arcs.height);
        }

        // Draw panel background
        graphics.setColor(backgroundColor != null ? backgroundColor : getBackground());
        graphics.fillRoundRect(0, 0, width - 2, height - 2, arcs.width, arcs.height);
    }

    public void setBackgroundColor(Color bg) {
        this.backgroundColor = bg;
        repaint();
    }
}
