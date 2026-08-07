package com.ibuinem.pos.view;

import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.Category;
import com.ibuinem.pos.model.Product;
import com.ibuinem.pos.service.ProductService;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.ModernTextField;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductView extends JPanel {

    private ModernTextField txtSearch;
    private JComboBox<CategoryWrapper> cbFilterCategory;
    private JComboBox<String> cbSortBy;
    private ModernTable tblProducts;
    private DefaultTableModel tableModel;

    private RoundedButton btnAdd;
    private RoundedButton btnEdit;
    private RoundedButton btnDelete;
    private RoundedButton btnRefresh;

    private final ProductService productService = new ProductService();
    private List<Product> currentProductList = new ArrayList<>();

    public ProductView() {
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

        // Title
        JLabel lblTitle = new JLabel("Master Data Produk");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 20));
        lblTitle.setForeground(new Color(44, 62, 80));

        // Toolbar Panel (Search + Filter + Action Buttons)
        JPanel toolbarPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        toolbarPanel.setOpaque(false);

        txtSearch = new ModernTextField("Cari nama/kode produk...");
        txtSearch.setPreferredSize(new Dimension(200, 38));
        txtSearch.addActionListener(e -> filterData());

        cbFilterCategory = new JComboBox<>();
        cbFilterCategory.setPreferredSize(new Dimension(140, 38));
        cbFilterCategory.addActionListener(e -> filterData());

        cbSortBy = new JComboBox<>(new String[]{"Nama", "Harga", "Stok", "Produk Terlaris"});
        cbSortBy.setPreferredSize(new Dimension(140, 38));
        cbSortBy.addActionListener(e -> filterData());

        btnAdd = new RoundedButton("+ Tambah Produk", new Color(46, 204, 113), new Color(39, 174, 96));
        btnAdd.setPreferredSize(new Dimension(140, 38));
        btnAdd.addActionListener(e -> showProductDialog(null));

        btnEdit = new RoundedButton("Edit", new Color(52, 152, 219), new Color(41, 128, 185));
        btnEdit.setPreferredSize(new Dimension(80, 38));
        btnEdit.addActionListener(e -> editSelectedProduct());

        btnDelete = new RoundedButton("Hapus", new Color(231, 76, 60), new Color(192, 57, 43));
        btnDelete.setPreferredSize(new Dimension(80, 38));
        btnDelete.addActionListener(e -> deleteSelectedProduct());

        btnRefresh = new RoundedButton("Refresh", new Color(149, 165, 166), new Color(127, 140, 141));
        btnRefresh.setPreferredSize(new Dimension(90, 38));
        btnRefresh.addActionListener(e -> refreshData());

        toolbarPanel.add(txtSearch);
        toolbarPanel.add(cbFilterCategory);
        toolbarPanel.add(cbSortBy);
        toolbarPanel.add(btnAdd);
        toolbarPanel.add(btnEdit);
        toolbarPanel.add(btnDelete);
        toolbarPanel.add(btnRefresh);

        topPanel.add(lblTitle, BorderLayout.WEST);
        topPanel.add(toolbarPanel, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
    }

    private void initTable() {
        RoundedPanel centerPanel = new RoundedPanel(15, Color.WHITE);
        centerPanel.setLayout(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        String[] columns = {"ID", "Kode Produk", "Nama Produk", "Kategori", "Harga (Rp)", "Stok", "Terjual (Pcs)", "Pendapatan (Rp)", "Status"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tblProducts = new ModernTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tblProducts);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        centerPanel.add(scrollPane, BorderLayout.CENTER);
        add(centerPanel, BorderLayout.CENTER);
    }

    public void refreshData() {
        // Populate Categories Filter Combobox
        cbFilterCategory.removeAllItems();
        cbFilterCategory.addItem(new CategoryWrapper(0, "Semua Kategori"));
        List<Category> categories = productService.getAllCategories();
        for (Category c : categories) {
            cbFilterCategory.addItem(new CategoryWrapper(c.getId(), c.getName()));
        }

        filterData();
    }

    private void filterData() {
        String query = txtSearch.getText();
        CategoryWrapper selCat = (CategoryWrapper) cbFilterCategory.getSelectedItem();
        int catId = selCat != null ? selCat.id : 0;
        String sortBy = (String) cbSortBy.getSelectedItem();

        currentProductList = productService.searchProducts(query, catId, false, sortBy);
        tableModel.setRowCount(0);

        for (Product p : currentProductList) {
            tableModel.addRow(new Object[]{
                p.getId(),
                p.getCode(),
                p.getName(),
                p.getCategoryName(),
                CurrencyUtil.formatRupiah(p.getPrice()),
                p.getStock(),
                p.getSoldQuantity(),
                CurrencyUtil.formatRupiah(p.getRevenue()),
                p.isActive() ? "Aktif" : "Non-Aktif"
            });
        }
    }

    private void editSelectedProduct() {
        int selectedRow = tblProducts.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Pilih produk yang ingin diedit dari tabel terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }
        Product p = currentProductList.get(selectedRow);
        showProductDialog(p);
    }

    private void deleteSelectedProduct() {
        int selectedRow = tblProducts.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Pilih produk yang ingin dihapus dari tabel terlebih dahulu!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }
        Product p = currentProductList.get(selectedRow);

        int confirm = JOptionPane.showConfirmDialog(this,
            "Apakah Anda yakin ingin menghapus produk '" + p.getName() + "'?",
            "Konfirmasi Hapus", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);

        if (confirm == JOptionPane.YES_OPTION) {
            String err = productService.deleteProduct(p.getId());
            if (err != null) {
                JOptionPane.showMessageDialog(this, err, "Error Hapus", JOptionPane.ERROR_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Produk berhasil dihapus!", "Sukses", JOptionPane.INFORMATION_MESSAGE);
                refreshData();
            }
        }
    }

    private void showProductDialog(Product existingProduct) {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this),
            existingProduct == null ? "Tambah Produk Baru" : "Edit Produk", true);
        dialog.setLayout(new BorderLayout());
        dialog.setSize(420, 480);
        dialog.setLocationRelativeTo(this);

        JPanel formPanel = new JPanel(new GridLayout(6, 2, 10, 15));
        formPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        ModernTextField txtCode = new ModernTextField("PRD-001");
        ModernTextField txtName = new ModernTextField("Nama Produk");
        JComboBox<CategoryWrapper> cbCategory = new JComboBox<>();
        ModernTextField txtPrice = new ModernTextField("0");
        ModernTextField txtStock = new ModernTextField("0");
        JCheckBox chkActive = new JCheckBox("Aktif", true);

        // Populate Categories
        List<Category> categories = productService.getAllCategories();
        for (Category c : categories) {
            cbCategory.addItem(new CategoryWrapper(c.getId(), c.getName()));
        }

        if (existingProduct != null) {
            txtCode.setText(existingProduct.getCode());
            txtName.setText(existingProduct.getName());
            txtPrice.setText(existingProduct.getPrice().toPlainString());
            txtStock.setText(String.valueOf(existingProduct.getStock()));
            chkActive.setSelected(existingProduct.isActive());

            // Select Category
            for (int i = 0; i < cbCategory.getItemCount(); i++) {
                if (cbCategory.getItemAt(i).id == existingProduct.getCategoryId()) {
                    cbCategory.setSelectedIndex(i);
                    break;
                }
            }
        }

        formPanel.add(new JLabel("Kode Produk:"));
        formPanel.add(txtCode);
        formPanel.add(new JLabel("Nama Produk:"));
        formPanel.add(txtName);
        formPanel.add(new JLabel("Kategori:"));
        formPanel.add(cbCategory);
        formPanel.add(new JLabel("Harga (Rp):"));
        formPanel.add(txtPrice);
        formPanel.add(new JLabel("Stok:"));
        formPanel.add(txtStock);
        formPanel.add(new JLabel("Status:"));
        formPanel.add(chkActive);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        JButton btnSave = new JButton("Simpan");
        JButton btnCancel = new JButton("Batal");

        btnSave.addActionListener(e -> {
            try {
                String code = txtCode.getText();
                String name = txtName.getText();
                CategoryWrapper selCat = (CategoryWrapper) cbCategory.getSelectedItem();
                BigDecimal price = new BigDecimal(txtPrice.getText().trim());
                int stock = Integer.parseInt(txtStock.getText().trim());
                boolean active = chkActive.isSelected();

                Product p = existingProduct != null ? existingProduct : new Product();
                p.setCode(code);
                p.setName(name);
                p.setCategoryId(selCat != null ? selCat.id : 0);
                p.setPrice(price);
                p.setStock(stock);
                p.setActive(active);

                String error = productService.saveProduct(p);
                if (error != null) {
                    JOptionPane.showMessageDialog(dialog, error, "Validasi Gagal", JOptionPane.WARNING_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(dialog, "Produk berhasil disimpan ke MySQL secara real-time!", "Sukses", JOptionPane.INFORMATION_MESSAGE);
                    dialog.dispose();
                    refreshData();
                }
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(dialog, "Input harga dan stok harus berupa angka valid!", "Format Input Salah", JOptionPane.ERROR_MESSAGE);
            }
        });

        btnCancel.addActionListener(e -> dialog.dispose());

        btnPanel.add(btnSave);
        btnPanel.add(btnCancel);

        dialog.add(formPanel, BorderLayout.CENTER);
        dialog.add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private static class CategoryWrapper {
        int id;
        String name;
        CategoryWrapper(int id, String name) {
            this.id = id;
            this.name = name;
        }
        @Override
        public String toString() {
            return name;
        }
    }
}
