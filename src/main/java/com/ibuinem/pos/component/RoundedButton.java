package com.ibuinem.pos.component;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class RoundedButton extends JButton {

    private Color normalColor;
    private Color hoverColor;
    private Color pressColor;
    private int radius;

    public RoundedButton(String text, Color normal, Color hover) {
        super(text);
        this.normalColor = normal;
        this.hoverColor = hover;
        this.pressColor = hover.darker();
        this.radius = 12;

        setContentAreaFilled(false);
        setFocusPainted(false);
        setBorderPainted(false);
        setOpaque(false);
        setForeground(Color.WHITE);
        setFont(new Font("SansSerif", Font.BOLD, 11));
        setCursor(new Cursor(Cursor.HAND_CURSOR));

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                setBackground(hoverColor);
                repaint();
            }

            @Override
            public void mouseExited(MouseEvent e) {
                setBackground(normalColor);
                repaint();
            }

            @Override
            public void mousePressed(MouseEvent e) {
                setBackground(pressColor);
                repaint();
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                setBackground(hoverColor);
                repaint();
            }
        });
        setBackground(normalColor);
    }

    public RoundedButton(String text) {
        this(text, new Color(46, 204, 113), new Color(39, 174, 96)); // Default Emerald Green
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setColor(getBackground());
        g2.fillRoundRect(0, 0, getWidth(), getHeight(), radius, radius);
        g2.dispose();

        super.paintComponent(g);
    }
}
