package com.ibuinem.pos.view;

import com.ibuinem.pos.barcode.BarcodeGenerator;
import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.Product;
import com.ibuinem.pos.service.ProductService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.ModernTextField;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.List;

public class BarcodeLabelView extends JPanel {

    private final ProductService productService = new ProductService();
    private ModernTextField txtSearch;
    private ModernTable tblProducts;
    private DefaultTableModel tableModel;
    private List<Product> productList;
    private JLabel lblBarcodePreview;

    private RoundedButton btnGenerateBarcode;
    private RoundedButton btnGenerateQR;
    private RoundedButton btnPrintLabel;
    private RoundedButton btnRefresh;

    private BufferedImage currentBarcodeImg;
    private Product selectedProduct;

    public BarcodeLabelView() {
        setLayout(new BorderLayout(20, 20));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        initHeader();
        initCenter();
        refreshData();
    }

    private void initHeader() {
        RoundedPanel topPanel = new RoundedPanel(15, Color.WHITE);
        topPanel.setLayout(new BorderLayout(15, 15));
        topPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblTitle = new JLabel("Cetak Label Barcode Produk");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        JPanel filterPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        filterPanel.setOpaque(false);

        txtSearch = new ModernTextField("Cari produk...");
        txtSearch.setPreferredSize(new Dimension(180, 38));

        RoundedButton btnSearch = new RoundedButton("Cari", new Color(52, 152, 219), new Color(41, 128, 185));
        btnSearch.setPreferredSize(new Dimension(80, 38));
        btnSearch.addActionListener(e -> refreshData());

        btnRefresh = new RoundedButton("Refresh", new Color(149, 165, 166), new Color(127, 140, 141));
        btnRefresh.setPreferredSize(new Dimension(90, 38));
        btnRefresh.addActionListener(e -> {
            txtSearch.setText("");
            refreshData();
        });

        filterPanel.add(txtSearch);
        filterPanel.add(btnSearch);
        filterPanel.add(btnRefresh);

        topPanel.add(lblTitle, BorderLayout.WEST);
        topPanel.add(filterPanel, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
    }

    private void initCenter() {
        JPanel centerContainer = new JPanel(new GridLayout(1, 2, 20, 0));
        centerContainer.setOpaque(false);

        // Left Table: Product Selection
        RoundedPanel leftPanel = new RoundedPanel(15, Color.WHITE);
        leftPanel.setLayout(new BorderLayout(0, 15));
        leftPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblTableTitle = new JLabel("Daftar Produk");
        lblTableTitle.setFont(new Font("SansSerif", Font.BOLD, 16));

        String[] columns = {"Kode", "Nama Produk", "Harga (Rp)", "Stok"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblProducts = new ModernTable(tableModel);
        tblProducts.getSelectionModel().addListSelectionListener(e -> {
            int row = tblProducts.getSelectedRow();
            if (row >= 0 && row < productList.size()) {
                selectedProduct = productList.get(row);
                generateBarcode();
            }
        });

        JScrollPane scrollPane = new JScrollPane(tblProducts);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        leftPanel.add(lblTableTitle, BorderLayout.NORTH);
        leftPanel.add(scrollPane, BorderLayout.CENTER);

        // Right Panel: Barcode Preview & Print
        RoundedPanel rightPanel = new RoundedPanel(15, Color.WHITE);
        rightPanel.setLayout(new BorderLayout(0, 15));
        rightPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel lblPreviewTitle = new JLabel("Pratinjau Label Barcode");
        lblPreviewTitle.setFont(new Font("SansSerif", Font.BOLD, 16));

        lblBarcodePreview = new JLabel("Pilih produk dari tabel di samping", SwingConstants.CENTER);
        lblBarcodePreview.setFont(new Font("SansSerif", Font.ITALIC, 14));
        lblBarcodePreview.setForeground(new Color(127, 140, 141));

        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        actionPanel.setOpaque(false);

        btnGenerateBarcode = new RoundedButton("Barcode Code128", new Color(52, 152, 219), new Color(41, 128, 185));
        btnGenerateBarcode.setPreferredSize(new Dimension(150, 38));
        btnGenerateBarcode.addActionListener(e -> generateBarcode());

        btnGenerateQR = new RoundedButton("QR Code", new Color(155, 89, 182), new Color(142, 68, 173));
        btnGenerateQR.setPreferredSize(new Dimension(120, 38));
        btnGenerateQR.addActionListener(e -> generateQR());

        btnPrintLabel = new RoundedButton("Cetak Label Barcode", new Color(46, 204, 113), new Color(39, 174, 96));
        btnPrintLabel.setPreferredSize(new Dimension(160, 38));
        btnPrintLabel.addActionListener(e -> printBarcodeLabel());

        actionPanel.add(btnGenerateBarcode);
        actionPanel.add(btnGenerateQR);
        actionPanel.add(btnPrintLabel);

        rightPanel.add(lblPreviewTitle, BorderLayout.NORTH);
        rightPanel.add(lblBarcodePreview, BorderLayout.CENTER);
        rightPanel.add(actionPanel, BorderLayout.SOUTH);

        centerContainer.add(leftPanel);
        centerContainer.add(rightPanel);

        add(centerContainer, BorderLayout.CENTER);
    }

    public void refreshData() {
        String query = txtSearch.getText().trim();
        productList = productService.searchProducts(query, 0, true);
        tableModel.setRowCount(0);
        if (productList != null) {
            for (Product p : productList) {
                tableModel.addRow(new Object[]{
                    p.getCode(),
                    p.getName(),
                    CurrencyUtil.formatRupiah(p.getPrice()),
                    p.getStock() + " Pcs"
                });
            }
        }
    }

    private void generateBarcode() {
        if (selectedProduct == null) return;
        currentBarcodeImg = BarcodeGenerator.generateBarcode(selectedProduct.getCode(), 260, 90);
        if (currentBarcodeImg != null) {
            lblBarcodePreview.setText("");
            lblBarcodePreview.setIcon(new ImageIcon(currentBarcodeImg));
        }
    }

    private void generateQR() {
        if (selectedProduct == null) return;
        currentBarcodeImg = BarcodeGenerator.generateQRCode(selectedProduct.getCode(), 180, 180);
        if (currentBarcodeImg != null) {
            lblBarcodePreview.setText("");
            lblBarcodePreview.setIcon(new ImageIcon(currentBarcodeImg));
        }
    }

    private void printBarcodeLabel() {
        if (selectedProduct == null || currentBarcodeImg == null) {
            JOptionPane.showMessageDialog(this, "Pilih produk dan generate barcode terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }
        JOptionPane.showMessageDialog(this, "Label Barcode untuk " + selectedProduct.getName() + " (" + selectedProduct.getCode() + ") siap dicetak!", "Sukses Cetak Barcode", JOptionPane.INFORMATION_MESSAGE);
    }
}
