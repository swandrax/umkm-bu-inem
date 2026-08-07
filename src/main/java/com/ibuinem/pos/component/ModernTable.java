package com.ibuinem.pos.component;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;

public class ModernTable extends JTable {

    public ModernTable(DefaultTableModel model) {
        super(model);
        setupStyle();
    }

    public ModernTable() {
        super();
        setupStyle();
    }

    private void setupStyle() {
        setRowHeight(30);
        setFont(new Font("SansSerif", Font.PLAIN, 11));
        setSelectionBackground(new Color(220, 245, 230));
        setSelectionForeground(new Color(44, 62, 80));
        setShowGrid(false);
        setIntercellSpacing(new Dimension(0, 0));

        // Modern Header
        JTableHeader header = getTableHeader();
        header.setPreferredSize(new Dimension(0, 32));
        header.setFont(new Font("SansSerif", Font.BOLD, 11));
        header.setBackground(new Color(245, 247, 250));
        header.setForeground(new Color(44, 62, 80));
        header.setReorderingAllowed(false);

        // Header Cell Renderer
        ((DefaultTableCellRenderer) header.getDefaultRenderer()).setHorizontalAlignment(JLabel.LEFT);

        // Alternating row colors renderer
        setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                setBorder(BorderFactory.createEmptyBorder(0, 10, 0, 10));

                if (isSelected) {
                    c.setBackground(new Color(220, 245, 230));
                    c.setForeground(new Color(44, 62, 80));
                } else {
                    c.setBackground(row % 2 == 0 ? Color.WHITE : new Color(250, 252, 255));
                    c.setForeground(new Color(50, 50, 50));
                }
                return c;
            }
        });
    }
}
