package com.ibuinem.pos.view;

import com.ibuinem.pos.component.ModernTable;
import com.ibuinem.pos.component.RoundedButton;
import com.ibuinem.pos.component.RoundedPanel;
import com.ibuinem.pos.model.CartItem;
import com.ibuinem.pos.model.Category;
import com.ibuinem.pos.model.Product;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.printer.ReceiptPrinter;
import com.ibuinem.pos.service.ProductService;
import com.ibuinem.pos.service.SaleService;
import com.ibuinem.pos.service.CustomerService;
import com.ibuinem.pos.service.PackageService;
import com.ibuinem.pos.model.*;
import com.ibuinem.pos.utils.CurrencyUtil;
import com.ibuinem.pos.utils.ModernTextField;
import com.ibuinem.pos.utils.SessionManager;

import javax.swing.*;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class TransactionView extends JPanel {

    // Left Panel (Product catalog selection)
    private ModernTextField txtSearchProduct;
    private JComboBox<CategoryWrapper> cbCategoryFilter;
    private ModernTable tblCatalog;
    private DefaultTableModel catalogTableModel;
    private List<Product> catalogProductList = new ArrayList<>();

    // Right Panel (Shopping Cart)
    private ModernTable tblCart;
    private DefaultTableModel cartTableModel;
    private final List<CartItem> cartItems = new ArrayList<>();

    // Bottom Panel (Calculation & Payment)
    private JLabel lblTrxNum;
    private JLabel lblSubtotal;
    private ModernTextField txtDiscount;
    private ModernTextField txtTax;
    private JLabel lblGrandTotal;

    private JComboBox<String> cbPaymentMethod;
    private ModernTextField txtCashPaid;
    private JLabel lblChange;

    private RoundedButton btnPay;
    private RoundedButton btnPrintReceipt;
    private RoundedButton btnReset;

    private final ProductService productService = new ProductService();
    private final SaleService saleService = new SaleService();
    private final CustomerService customerService = new CustomerService();
    private final PackageService packageService = new PackageService();

    // Customer & Shipping Fields
    private JComboBox<CustomerWrapper> cbCustomer;
    private JButton btnNewCustomer;
    private JComboBox<PackageWrapper> cbPackage;
    private JComboBox<String> cbShippingType;
    private ModernTextField txtShippingAddress;
    private ModernTextField txtCourierNotes;

    private Sale lastCompletedSale = null;

    public TransactionView() {
        setLayout(new BorderLayout(15, 15));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        initLeftCatalogPanel();
        initRightCartPanel();
        initBottomPaymentPanel();

        resetTransaction();
    }

    private void initLeftCatalogPanel() {
        RoundedPanel leftPanel = new RoundedPanel(15, Color.WHITE);
        leftPanel.setLayout(new BorderLayout(10, 10));
        leftPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        leftPanel.setPreferredSize(new Dimension(500, 0));

        // Top Filter Bar
        JPanel topFilterPanel = new JPanel(new BorderLayout(10, 0));
        topFilterPanel.setOpaque(false);

        JLabel lblTitle = new JLabel("Daftar Produk");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 18));
        lblTitle.setForeground(new Color(44, 62, 80));

        JPanel filterBox = new JPanel(new FlowLayout(FlowLayout.RIGHT, 5, 0));
        filterBox.setOpaque(false);

        txtSearchProduct = new ModernTextField("Cari produk...");
        txtSearchProduct.setPreferredSize(new Dimension(180, 36));
        txtSearchProduct.getDocument().addDocumentListener(new SimpleDocumentListener() {
            @Override
            public void update() { filterCatalog(); }
        });

        cbCategoryFilter = new JComboBox<>();
        cbCategoryFilter.setPreferredSize(new Dimension(140, 36));
        cbCategoryFilter.addActionListener(e -> filterCatalog());

        filterBox.add(txtSearchProduct);
        filterBox.add(cbCategoryFilter);

        topFilterPanel.add(lblTitle, BorderLayout.WEST);
        topFilterPanel.add(filterBox, BorderLayout.EAST);

        // Catalog Table
        String[] columns = {"Kode", "Nama Produk", "Harga (Rp)", "Stok", "Aksi"};
        catalogTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return column == 4; // Only Action column clickable
            }
        };

        tblCatalog = new ModernTable(catalogTableModel);
        tblCatalog.getColumnModel().getColumn(4).setCellRenderer(new ButtonRenderer());
        tblCatalog.getColumnModel().getColumn(4).setCellEditor(new ButtonEditor(new JCheckBox()));

        JScrollPane scrollPane = new JScrollPane(tblCatalog);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        leftPanel.add(topFilterPanel, BorderLayout.NORTH);
        leftPanel.add(scrollPane, BorderLayout.CENTER);

        add(leftPanel, BorderLayout.CENTER);
    }

    private void initRightCartPanel() {
        RoundedPanel rightPanel = new RoundedPanel(15, Color.WHITE);
        rightPanel.setLayout(new BorderLayout(10, 10));
        rightPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        rightPanel.setPreferredSize(new Dimension(420, 0));

        // Header Cart
        JPanel cartHeader = new JPanel(new BorderLayout());
        cartHeader.setOpaque(false);

        JLabel lblCartTitle = new JLabel("Keranjang Belanja");
        lblCartTitle.setFont(new Font("SansSerif", Font.BOLD, 18));
        lblCartTitle.setForeground(new Color(44, 62, 80));

        lblTrxNum = new JLabel("No: TRX-00000000");
        lblTrxNum.setFont(new Font("Monospaced", Font.BOLD, 12));
        lblTrxNum.setForeground(new Color(46, 204, 113));

        cartHeader.add(lblCartTitle, BorderLayout.WEST);
        cartHeader.add(lblTrxNum, BorderLayout.EAST);

        // Cart Table
        String[] columns = {"Produk", "Harga", "Qty", "Subtotal", "Hapus"};
        cartTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return column == 2 || column == 4; // Qty & Delete
            }
        };

        tblCart = new ModernTable(cartTableModel);
        tblCart.getColumnModel().getColumn(4).setCellRenderer(new DeleteButtonRenderer());
        tblCart.getColumnModel().getColumn(4).setCellEditor(new DeleteButtonEditor(new JCheckBox()));

        tblCart.getModel().addTableModelListener(e -> {
            if (e.getType() == javax.swing.event.TableModelEvent.UPDATE && e.getColumn() == 2) {
                int row = e.getFirstRow();
                if (row >= 0 && row < cartItems.size()) {
                    try {
                        int newQty = Integer.parseInt(tblCart.getValueAt(row, 2).toString());
                        CartItem item = cartItems.get(row);
                        if (newQty <= 0) {
                            cartItems.remove(row);
                        } else if (newQty > item.getProduct().getStock()) {
                            JOptionPane.showMessageDialog(this, "Jumlah melebihi stok yang tersedia (" + item.getProduct().getStock() + ")", "Stok Tidak Cukup", JOptionPane.WARNING_MESSAGE);
                            tblCart.setValueAt(item.getQuantity(), row, 2);
                        } else {
                            item.setQuantity(newQty);
                        }
                        updateCartTable();
                    } catch (NumberFormatException ex) {
                        updateCartTable();
                    }
                }
            }
        });

        JScrollPane scrollPane = new JScrollPane(tblCart);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        rightPanel.add(cartHeader, BorderLayout.NORTH);
        rightPanel.add(scrollPane, BorderLayout.CENTER);

        add(rightPanel, BorderLayout.EAST);
    }

    private void initBottomPaymentPanel() {
        RoundedPanel bottomPanel = new RoundedPanel(15, Color.WHITE);
        bottomPanel.setLayout(new BorderLayout(20, 10));
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        bottomPanel.setPreferredSize(new Dimension(0, 140));

        // Left Calculations (Subtotal, Discount, Tax, Grand Total)
        JPanel calcPanel = new JPanel(new GridLayout(2, 4, 15, 10));
        calcPanel.setOpaque(false);

        lblSubtotal = new JLabel("Rp 0");
        lblSubtotal.setFont(new Font("SansSerif", Font.BOLD, 15));

        txtDiscount = new ModernTextField("0");
        txtDiscount.getDocument().addDocumentListener(new SimpleDocumentListener() {
            @Override
            public void update() { calculateTotals(); }
        });

        txtTax = new ModernTextField("0");
        txtTax.getDocument().addDocumentListener(new SimpleDocumentListener() {
            @Override
            public void update() { calculateTotals(); }
        });

        lblGrandTotal = new JLabel("Rp 0");
        lblGrandTotal.setFont(new Font("SansSerif", Font.BOLD, 22));
        lblGrandTotal.setForeground(new Color(46, 204, 113)); // Emerald Green

        calcPanel.add(createLabeledComponent("Subtotal:", lblSubtotal));
        calcPanel.add(createLabeledComponent("Diskon (Rp):", txtDiscount));
        calcPanel.add(createLabeledComponent("Pajak (Rp):", txtTax));
        calcPanel.add(createLabeledComponent("TOTAL AKHIR:", lblGrandTotal));

        // Center Payment Method & Cash Paid
        JPanel paymentInputPanel = new JPanel(new GridLayout(2, 2, 10, 10));
        paymentInputPanel.setOpaque(false);

        cbPaymentMethod = new JComboBox<>(new String[]{
            "CASH", "QRIS", "Transfer Bank", "Debit", "OVO", "GoPay", "DANA", "ShopeePay"
        });
        cbPaymentMethod.addActionListener(e -> onPaymentMethodChanged());

        txtCashPaid = new ModernTextField("Nominal bayar...");
        txtCashPaid.getDocument().addDocumentListener(new SimpleDocumentListener() {
            @Override
            public void update() { calculateTotals(); }
        });

        lblChange = new JLabel("Rp 0");
        lblChange.setFont(new Font("SansSerif", Font.BOLD, 16));
        lblChange.setForeground(new Color(230, 126, 34)); // Orange

        paymentInputPanel.add(createLabeledComponent("Metode Pembayaran:", cbPaymentMethod));
        paymentInputPanel.add(createLabeledComponent("Nominal Bayar (Rp):", txtCashPaid));
        paymentInputPanel.add(createLabeledComponent("Kembalian:", lblChange));

        // Right Action Buttons
        JPanel actionBtnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        actionBtnPanel.setOpaque(false);

        btnPay = new RoundedButton("BAYAR (F5)", new Color(46, 204, 113), new Color(39, 174, 96));
        btnPay.setPreferredSize(new Dimension(130, 45));
        btnPay.addActionListener(e -> processPayment());

        btnPrintReceipt = new RoundedButton("CETAK STRUK", new Color(52, 152, 219), new Color(41, 128, 185));
        btnPrintReceipt.setPreferredSize(new Dimension(130, 45));
        btnPrintReceipt.setEnabled(false);
        btnPrintReceipt.addActionListener(e -> {
            if (lastCompletedSale != null) {
                ReceiptPrinter.showReceiptPreview(lastCompletedSale, this);
            }
        });

        btnReset = new RoundedButton("RESET", new Color(231, 76, 60), new Color(192, 57, 43));
        btnReset.setPreferredSize(new Dimension(100, 45));
        btnReset.addActionListener(e -> resetTransaction());

        actionBtnPanel.add(btnPay);
        actionBtnPanel.add(btnPrintReceipt);
        actionBtnPanel.add(btnReset);

        // Center Container
        JPanel middleBottom = new JPanel(new GridLayout(1, 2, 15, 0));
        middleBottom.setOpaque(false);
        middleBottom.add(paymentInputPanel);

        // Grid container
        JPanel centerBottom = new JPanel(new BorderLayout(15, 0));
        centerBottom.setOpaque(false);
        centerBottom.add(calcPanel, BorderLayout.WEST);
        centerBottom.add(middleBottom, BorderLayout.CENTER);
        centerBottom.add(actionBtnPanel, BorderLayout.EAST);

        bottomPanel.add(centerBottom, BorderLayout.SOUTH);
        
        // Customer & Shipping Panel
        JPanel crmPanel = new JPanel(new GridLayout(2, 3, 10, 10));
        crmPanel.setOpaque(false);
        
        cbCustomer = new JComboBox<>();
        btnNewCustomer = new JButton("+");
        btnNewCustomer.setPreferredSize(new Dimension(38, 38));
        btnNewCustomer.addActionListener(e -> showAddCustomerDialog());

        JPanel customerFieldPanel = new JPanel(new BorderLayout(5, 0));
        customerFieldPanel.setOpaque(false);
        customerFieldPanel.add(cbCustomer, BorderLayout.CENTER);
        customerFieldPanel.add(btnNewCustomer, BorderLayout.EAST);

        cbPackage = new JComboBox<>();
        cbShippingType = new JComboBox<>(new String[]{"TAKEAWAY", "DELIVERY", "DINE_IN"});
        txtShippingAddress = new ModernTextField("Alamat Pengiriman...");
        txtCourierNotes = new ModernTextField("Catatan Kurir...");
        
        crmPanel.add(createLabeledComponent("Customer:", customerFieldPanel));
        crmPanel.add(createLabeledComponent("Paket Promosi:", cbPackage));
        crmPanel.add(createLabeledComponent("Tipe Pengiriman:", cbShippingType));
        crmPanel.add(createLabeledComponent("Alamat Pengiriman:", txtShippingAddress));
        crmPanel.add(createLabeledComponent("Catatan Kurir:", txtCourierNotes));
        
        bottomPanel.add(crmPanel, BorderLayout.NORTH);
        bottomPanel.setPreferredSize(new Dimension(0, 220));

        add(bottomPanel, BorderLayout.SOUTH);
    }

    private JPanel createLabeledComponent(String labelText, Component comp) {
        JPanel p = new JPanel(new BorderLayout(0, 4));
        p.setOpaque(false);
        JLabel lbl = new JLabel(labelText);
        lbl.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lbl.setForeground(new Color(127, 140, 141));
        p.add(lbl, BorderLayout.NORTH);
        p.add(comp, BorderLayout.CENTER);
        return p;
    }

    public void refreshData() {
        // Load Categories
        cbCategoryFilter.removeAllItems();
        cbCategoryFilter.addItem(new CategoryWrapper(0, "Semua Kategori"));
        List<Category> categories = productService.getAllCategories();
        for (Category c : categories) {
            cbCategoryFilter.addItem(new CategoryWrapper(c.getId(), c.getName()));
        }

        // Load Customers
        cbCustomer.removeAllItems();
        cbCustomer.addItem(new CustomerWrapper(null)); // Guest
        List<Customer> customers = customerService.getAll();
        for(Customer c : customers) {
            cbCustomer.addItem(new CustomerWrapper(c));
        }

        // Load Packages
        cbPackage.removeAllItems();
        cbPackage.addItem(new PackageWrapper(null)); // None
        List<PackageModel> packages = packageService.getAllActive();
        for(PackageModel p : packages) {
            cbPackage.addItem(new PackageWrapper(p));
        }

        filterCatalog();
    }

    private void filterCatalog() {
        String query = txtSearchProduct.getText();
        CategoryWrapper selCat = (CategoryWrapper) cbCategoryFilter.getSelectedItem();
        int catId = selCat != null ? selCat.id : 0;

        catalogProductList = productService.searchProducts(query, catId, true);
        catalogTableModel.setRowCount(0);

        for (Product p : catalogProductList) {
            catalogTableModel.addRow(new Object[]{
                p.getCode(),
                p.getName(),
                CurrencyUtil.formatRupiah(p.getPrice()),
                p.getStock(),
                "+ Tambah"
            });
        }
    }

    private void addProductToCart(Product p) {
        if (p.getStock() <= 0) {
            JOptionPane.showMessageDialog(this, "Stok produk '" + p.getName() + "' habis!", "Stok Habis", JOptionPane.WARNING_MESSAGE);
            return;
        }

        for (CartItem item : cartItems) {
            if (item.getProduct().getId() == p.getId()) {
                if (item.getQuantity() + 1 > p.getStock()) {
                    JOptionPane.showMessageDialog(this, "Jumlah melebihi stok yang tersedia (" + p.getStock() + ")", "Stok Tidak Cukup", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                item.incrementQuantity(1);
                updateCartTable();
                return;
            }
        }

        cartItems.add(new CartItem(p, 1));
        updateCartTable();
    }

    private void updateCartTable() {
        cartTableModel.setRowCount(0);
        for (CartItem item : cartItems) {
            cartTableModel.addRow(new Object[]{
                item.getProduct().getName(),
                CurrencyUtil.formatRupiah(item.getProduct().getPrice()),
                item.getQuantity(),
                CurrencyUtil.formatRupiah(item.getSubtotal()),
                "X"
            });
        }
        calculateTotals();
    }

    private void calculateTotals() {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            subtotal = subtotal.add(item.getSubtotal());
        }
        lblSubtotal.setText(CurrencyUtil.formatRupiah(subtotal));

        BigDecimal discount = parseBigDecimal(txtDiscount.getText());
        BigDecimal tax = parseBigDecimal(txtTax.getText());

        BigDecimal grandTotal = subtotal.subtract(discount).add(tax);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) {
            grandTotal = BigDecimal.ZERO;
        }
        lblGrandTotal.setText(CurrencyUtil.formatRupiah(grandTotal));

        String payMethod = (String) cbPaymentMethod.getSelectedItem();
        if ("CASH".equalsIgnoreCase(payMethod)) {
            BigDecimal cashPaid = parseBigDecimal(txtCashPaid.getText());
            BigDecimal change = cashPaid.subtract(grandTotal);
            if (change.compareTo(BigDecimal.ZERO) < 0) {
                change = BigDecimal.ZERO;
            }
            lblChange.setText(CurrencyUtil.formatRupiah(change));
        } else {
            lblChange.setText("Rp 0 (LUNAS)");
        }
    }

    private void onPaymentMethodChanged() {
        String method = (String) cbPaymentMethod.getSelectedItem();
        if (!"CASH".equalsIgnoreCase(method)) {
            txtCashPaid.setEditable(false);
            txtCashPaid.setText(lblGrandTotal.getText().replace("Rp ", "").replace(".", ""));
        } else {
            txtCashPaid.setEditable(true);
            txtCashPaid.setText("");
        }
        calculateTotals();
    }

    private void processPayment() {
        if (cartItems.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Keranjang belanja masih kosong!", "Peringatan", JOptionPane.WARNING_MESSAGE);
            return;
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            subtotal = subtotal.add(item.getSubtotal());
        }
        BigDecimal discount = parseBigDecimal(txtDiscount.getText());
        BigDecimal tax = parseBigDecimal(txtTax.getText());
        BigDecimal grandTotal = subtotal.subtract(discount).add(tax);

        String method = (String) cbPaymentMethod.getSelectedItem();
        BigDecimal cashPaid = "CASH".equalsIgnoreCase(method) ? parseBigDecimal(txtCashPaid.getText()) : grandTotal;

        if ("CASH".equalsIgnoreCase(method) && cashPaid.compareTo(grandTotal) < 0) {
            JOptionPane.showMessageDialog(this, "Nominal pembayaran tunai kurang dari total belanja!", "Pembayaran Kurang", JOptionPane.WARNING_MESSAGE);
            return;
        }

        BigDecimal change = cashPaid.subtract(grandTotal);
        if (change.compareTo(BigDecimal.ZERO) < 0) change = BigDecimal.ZERO;

        Sale sale = new Sale();
        sale.setTransactionNumber(lblTrxNum.getText().replace("No: ", ""));
        sale.setUserId(SessionManager.getCurrentUser() != null ? SessionManager.getCurrentUser().getId() : 1);
        sale.setUserName(SessionManager.getCurrentUser() != null ? SessionManager.getCurrentUser().getFullName() : "Kasir");
        sale.setSubtotal(subtotal);
        sale.setDiscount(discount);
        sale.setTax(tax);
        sale.setTotal(grandTotal);
        sale.setPaymentMethod(method);
        sale.setCashAmount(cashPaid);
        sale.setChangeAmount(change);
        sale.setStatus(Sale.Status.PAID);
        
        CustomerWrapper cw = (CustomerWrapper) cbCustomer.getSelectedItem();
        if(cw != null && cw.customer != null) {
            sale.setCustomerId(cw.customer.getId());
        }

        PackageWrapper pw = (PackageWrapper) cbPackage.getSelectedItem();
        if(pw != null && pw.packageModel != null) {
            sale.setPackageId(pw.packageModel.getId());
        }

        Shipping shipping = new Shipping();
        shipping.setShippingType((String) cbShippingType.getSelectedItem());
        shipping.setCustomerNotes(txtShippingAddress.getText());
        shipping.setCourierNotes(txtCourierNotes.getText());
        shipping.setShippingStatus("PENDING");

        String err = saleService.processCheckout(sale, cartItems, shipping);
        if (err != null) {
            JOptionPane.showMessageDialog(this, err, "Gagal Transaksi", JOptionPane.ERROR_MESSAGE);
        } else {
            lastCompletedSale = saleService.getSaleDetails(sale.getId());
            if (lastCompletedSale == null) lastCompletedSale = sale;

            btnPrintReceipt.setEnabled(true);
            JOptionPane.showMessageDialog(this,
                "Transaksi Berhasil!\nTotal: " + CurrencyUtil.formatRupiah(grandTotal) +
                "\nKembalian: " + CurrencyUtil.formatRupiah(change),
                "Transaksi Lunas", JOptionPane.INFORMATION_MESSAGE);

            // Automatically prompt print dialog
            ReceiptPrinter.showReceiptPreview(lastCompletedSale, this);

            resetTransaction();
        }
    }

    private void resetTransaction() {
        cartItems.clear();
        lastCompletedSale = null;
        btnPrintReceipt.setEnabled(false);
        lblTrxNum.setText("No: " + saleService.generateTransactionNumber());
        txtDiscount.setText("0");
        txtTax.setText("0");
        txtCashPaid.setText("");
        cbPaymentMethod.setSelectedIndex(0);
        txtCashPaid.setEditable(true);
        if(cbCustomer.getItemCount() > 0) cbCustomer.setSelectedIndex(0);
        if(cbPackage.getItemCount() > 0) cbPackage.setSelectedIndex(0);
        cbShippingType.setSelectedIndex(0);
        txtShippingAddress.setText("");
        txtCourierNotes.setText("");

        updateCartTable();
        refreshData();
    }

    private void showAddCustomerDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Tambah Customer Baru", true);
        dialog.setLayout(new BorderLayout(10, 10));
        dialog.setSize(350, 280);
        dialog.setLocationRelativeTo(this);

        JPanel inputPanel = new JPanel(new GridLayout(3, 2, 10, 10));
        inputPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        ModernTextField txtName = new ModernTextField("Nama Customer...");
        ModernTextField txtPhone = new ModernTextField("Nomor HP...");
        ModernTextField txtAddress = new ModernTextField("Alamat...");

        inputPanel.add(new JLabel("Nama:"));
        inputPanel.add(txtName);
        inputPanel.add(new JLabel("No. HP:"));
        inputPanel.add(txtPhone);
        inputPanel.add(new JLabel("Alamat:"));
        inputPanel.add(txtAddress);

        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        RoundedButton btnSave = new RoundedButton("Simpan", new Color(46, 204, 113), new Color(39, 174, 96));
        btnSave.setPreferredSize(new Dimension(80, 36));
        btnSave.addActionListener(e -> {
            String name = txtName.getText().trim();
            String phone = txtPhone.getText().trim();
            String address = txtAddress.getText().trim();

            if (name.isEmpty()) {
                JOptionPane.showMessageDialog(dialog, "Nama tidak boleh kosong!", "Peringatan", JOptionPane.WARNING_MESSAGE);
                return;
            }

            Customer c = new Customer();
            c.setName(name);
            c.setPhone(phone);
            c.setAddress(address);

            if (customerService.addCustomer(c)) {
                JOptionPane.showMessageDialog(dialog, "Customer berhasil disimpan!", "Sukses", JOptionPane.INFORMATION_MESSAGE);
                dialog.dispose();
                refreshData();
                // Select newly added customer
                for (int i = 0; i < cbCustomer.getItemCount(); i++) {
                    CustomerWrapper cw = cbCustomer.getItemAt(i);
                    if (cw != null && cw.customer != null && cw.customer.getId() == c.getId()) {
                        cbCustomer.setSelectedIndex(i);
                        break;
                    }
                }
            } else {
                JOptionPane.showMessageDialog(dialog, "Gagal menyimpan customer!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        JButton btnCancel = new JButton("Batal");
        btnCancel.addActionListener(e -> dialog.dispose());

        actionPanel.add(btnSave);
        actionPanel.add(btnCancel);

        dialog.add(inputPanel, BorderLayout.CENTER);
        dialog.add(actionPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private BigDecimal parseBigDecimal(String str) {
        if (str == null || str.trim().isEmpty()) return BigDecimal.ZERO;
        try {
            return new BigDecimal(str.trim().replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    // Custom Button Renderers & Editors for Catalog & Cart
    private class ButtonRenderer extends JButton implements javax.swing.table.TableCellRenderer {
        public ButtonRenderer() {
            setOpaque(true);
            setBackground(new Color(46, 204, 113));
            setForeground(Color.WHITE);
            setFont(new Font("SansSerif", Font.BOLD, 11));
        }
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
            setText(value == null ? "+ Tambah" : value.toString());
            return this;
        }
    }

    private class ButtonEditor extends DefaultCellEditor {
        private final JButton button;
        private int selectedRow;

        public ButtonEditor(JCheckBox checkBox) {
            super(checkBox);
            button = new JButton();
            button.setOpaque(true);
            button.setBackground(new Color(46, 204, 113));
            button.setForeground(Color.WHITE);
            button.setFont(new Font("SansSerif", Font.BOLD, 11));
            button.addActionListener(e -> {
                fireEditingStopped();
                if (selectedRow >= 0 && selectedRow < catalogProductList.size()) {
                    addProductToCart(catalogProductList.get(selectedRow));
                }
            });
        }
        @Override
        public Component getTableCellEditorComponent(JTable table, Object value, boolean isSelected, int row, int column) {
            this.selectedRow = row;
            button.setText(value == null ? "+ Tambah" : value.toString());
            return button;
        }
    }

    private class DeleteButtonRenderer extends JButton implements javax.swing.table.TableCellRenderer {
        public DeleteButtonRenderer() {
            setOpaque(true);
            setBackground(new Color(231, 76, 60));
            setForeground(Color.WHITE);
            setFont(new Font("SansSerif", Font.BOLD, 11));
        }
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
            setText("X");
            return this;
        }
    }

    private class DeleteButtonEditor extends DefaultCellEditor {
        private final JButton button;
        private int selectedRow;

        public DeleteButtonEditor(JCheckBox checkBox) {
            super(checkBox);
            button = new JButton();
            button.setOpaque(true);
            button.setBackground(new Color(231, 76, 60));
            button.setForeground(Color.WHITE);
            button.setFont(new Font("SansSerif", Font.BOLD, 11));
            button.addActionListener(e -> {
                fireEditingStopped();
                if (selectedRow >= 0 && selectedRow < cartItems.size()) {
                    cartItems.remove(selectedRow);
                    updateCartTable();
                }
            });
        }
        @Override
        public Component getTableCellEditorComponent(JTable table, Object value, boolean isSelected, int row, int column) {
            this.selectedRow = row;
            button.setText("X");
            return button;
        }
    }

    private static class CategoryWrapper {
        int id;
        String name;
        CategoryWrapper(int id, String name) {
            this.id = id;
            this.name = name;
        }
        @Override
        public String toString() { return name; }
    }

    private static class CustomerWrapper {
        Customer customer;
        CustomerWrapper(Customer customer) { this.customer = customer; }
        @Override
        public String toString() { return customer == null ? "Umum (Guest)" : customer.getName() + " - " + customer.getPhone(); }
    }

    private static class PackageWrapper {
        PackageModel packageModel;
        PackageWrapper(PackageModel packageModel) { this.packageModel = packageModel; }
        @Override
        public String toString() { return packageModel == null ? "Tidak Ada Paket" : packageModel.getName(); }
    }

    private abstract static class SimpleDocumentListener implements DocumentListener {
        public abstract void update();
        @Override public void insertUpdate(DocumentEvent e) { update(); }
        @Override public void removeUpdate(DocumentEvent e) { update(); }
        @Override public void changedUpdate(DocumentEvent e) { update(); }
    }
}
