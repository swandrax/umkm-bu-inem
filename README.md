# Jajanan Ibu Inem - Desktop Point of Sales (POS)

Aplikasi Desktop Point of Sales (POS) **"Jajanan Ibu Inem"** dibangun menggunakan **Java 21 (LTS)**, **Maven**, **Java Swing + FlatLaf**, **MySQL (phpMyAdmin / XAMPP / Laragon)**, **ZXing Barcode Generator**, **Java Printer API (Struk Thermal 58mm)**, dan **Apache PDFBox (Export Laporan PDF)**.

---

## 🌟 Fitur Utama

1. **Dashboard Overview**
   - Ringkasan Penjualan Hari Ini, Total Pendapatan, Jumlah Transaksi, dan Produk Terjual.
   - Jam & Tanggal Real-Time.
   - Informasi Kasir & status koneksi database MySQL.
   - Feed transaksi terbaru hari ini.

2. **Master Data Produk**
   - Tambah, Edit, Hapus (Soft Delete), dan Pencarian Produk.
   - Filter berdasarkan Kategori (Makanan Basah, Gorengan, Minuman, Snack Kering, dll).
   - Manajamen harga, stok, dan status aktif produk.
   - Validasi stok & harga non-negatif secara real-time.

3. **Halaman Transaksi Kasir (POS)**
   - Katalog produk interaktif dengan fitur pencarian instan dan filter kategori.
   - Keranjang belanja interaktif dengan kontrol penambahan/pengurangan Qty dan tombol Hapus per item.
   - Kalkulasi otomatis Subtotal, Diskon (Rp / %), Pajak (Rp / %), dan Grand Total.
   - Pilihan 8 Metode Pembayaran: **CASH, QRIS, Transfer Bank, Debit, OVO, GoPay, DANA, ShopeePay**.
   - Perhitungan otomatis Kembalian tunai (atau Status LUNAS instan untuk pembayaran non-tunai).
   - Pengurangan stok otomatis di database MySQL secara real-time.
   - Tombol Bayar (F5), Reset, dan Cetak Struk.

4. **Digital Thermal Receipt Printing (Struk 58mm)**
   - Mendukung printer thermal 58mm via Java Printer API (`Printable`).
   - Format struk profesional lengkap dengan nama toko, no transaksi, tanggal/jam, kasir, rincian barang, total, metode pembayaran, bayar, kembalian, dan pesan footer.
   - **Barcode / QR Code Transaksi** di-generate otomatis menggunakan library **ZXing**.
   - Pratinjau struk digital interaktif sebelum atau tanpa printer fisik.

5. **Data & Riwayat Penjualan**
   - Riwayat transaksi terinci dengan filter tanggal dan pencarian Nomor Transaksi.
   - Dialog detail transaksi lengkap dengan rincian item produk yang dibeli.
   - Fitur cetak ulang struk (Reprint Receipt).

6. **Laporan Penjualan & Export PDF**
   - Tab Laporan Harian, Laporan Mingguan, dan Laporan Bulanan.
   - Export laporan ke format PDF berkualitas tinggi menggunakan **Apache PDFBox**.
   - Fitur Print laporan langsung dari tabel.

---

## 🗄️ Struktur Database MySQL

Pastikan MySQL berjalan melalui **phpMyAdmin (XAMPP / Laragon)** di `localhost:3306`.

### Minimal Tabel & Relasi:
- `users`: Data pengguna/kasir & admin (`id`, `username`, `password`, `full_name`, `role`, `active`, `created_at`).
- `categories`: Kategori produk (`id`, `name`, `description`, `created_at`).
- `products`: Master produk (`id`, `code`, `name`, `category_id` FK, `price`, `stock`, `active`, `created_at`, `updated_at`).
- `sales`: Header transaksi (`id`, `transaction_number`, `user_id` FK, `transaction_date`, `subtotal`, `discount`, `tax`, `total`, `payment_method`, `cash_amount`, `change_amount`, `status`, `created_at`).
- `sale_details`: Line item transaksi (`id`, `sale_id` FK, `product_id` FK, `product_name`, `price`, `quantity`, `subtotal`).
- `payments`: Data pembayaran (`id`, `sale_id` FK, `payment_method`, `amount`, `reference_number`, `payment_date`, `status`).

### Impor Database:
1. Buka phpMyAdmin (http://localhost/phpmyadmin) atau MySQL CLI.
2. Buat database baru bernama `jajanan_ibu_inem` (atau biarkan script `database.sql` membuatnya secara otomatis).
3. Import file `database.sql` yang ada di root folder project:
   ```bash
   # Jika menggunakan Command Prompt (CMD) atau Git Bash:
   mysql -u root -p < database.sql
   
   # Jika menggunakan PowerShell:
   cmd /c "mysql -u root -p < database.sql"
   ```

---

## 🔑 Akun Login Bawaan

| Username | Password | Role | Nama Lengkap |
|---|---|---|---|
| `admin` | `admin123` | ADMIN | Ibu Inem (Owner) |
| `kasir` | `kasir123` | CASHIER | Siti Rahma (Kasir) |

---

## 📁 Struktur Folder Project (MVC)

```
src/
├── main/
│   ├── java/
│   │   └── com/ibuinem/pos/
│   │       ├── Main.java                        # Entry Point Aplikasi
│   │       ├── config/
│   │       │   └── DatabaseConfig.java          # JDBC MySQL Connection
│   │       ├── model/                           # Entity Models
│   │       │   ├── User.java
│   │       │   ├── Category.java
│   │       │   ├── Product.java
│   │       │   ├── Sale.java
│   │       │   ├── SaleDetail.java
│   │       │   ├── Payment.java
│   │       │   ├── CartItem.java
│   │       │   └── ReportSummary.java
│   │       ├── dao/                             # Data Access Object (JDBC PreparedStatements)
│   │       │   ├── UserDAO.java
│   │       │   ├── CategoryDAO.java
│   │       │   ├── ProductDAO.java
│   │       │   ├── SaleDAO.java
│   │       │   └── PaymentDAO.java
│   │       ├── service/                         # Business Logic & Validations
│   │       │   ├── AuthService.java
│   │       │   ├── ProductService.java
│   │       │   ├── SaleService.java
│   │       │   └── ReportService.java
│   │       ├── component/                       # Custom Modern Swing Components
│   │       │   ├── CardPanel.java
│   │       │   ├── ModernTable.java
│   │       │   ├── RoundedButton.java
│   │       │   └── RoundedPanel.java
│   │       ├── printer/                         # Thermal Printer & Preview
│   │       │   ├── Thermal58mmPrintable.java
│   │       │   └── ReceiptPrinter.java
│   │       ├── barcode/                         # Barcode/QR Code Generator (ZXing)
│   │       │   └── BarcodeGenerator.java
│   │       ├── utils/                           # Formatting & PDF Exporter
│   │       │   ├── CurrencyUtil.java
│   │       │   ├── DateUtil.java
│   │       │   ├── ModernTextField.java
│   │       │   ├── PdfExporter.java
│   │       │   ├── SessionManager.java
│   │       │   └── ValidationUtil.java
│   │       └── view/                            # GUI Views Frame & Panels
│   │           ├── LoginFrame.java
│   │           ├── MainFrame.java
│   │           ├── DashboardView.java
│   │           ├── ProductView.java
│   │           ├── TransactionView.java
│   │           ├── SalesHistoryView.java
│   │           └── ReportView.java
pom.xml
database.sql
README.md
```

---

## 🛠️ Cara Build & Menjalankan Aplikasi

### Persyaratan System:
- Java Development Kit (JDK) 21 atau versi LTS lebih tinggi.
- Apache Maven 3.8+.
- MySQL / MariaDB (XAMPP atau Laragon).

### 1. Kompilasi & Build Jar menggunakan Maven:
```bash
mvn clean package
```
Hasil build jar standalone akan berada di `target/jajanan-ibu-inem-pos-1.0.0.jar`.

### 2. Menjalankan Aplikasi via Maven Exec:
```bash
mvn exec:java
```

### 3. Menjalankan Executable JAR langsung:
```bash
java -jar target/jajanan-ibu-inem-pos-1.0.0.jar
```

---

## ⚙️ Konfigurasi Koneksi Database

Jika username / password MySQL Anda berbeda dengan bawaan Laragon/XAMPP (`localhost:3306`, user: `root`, pass: `""`), Anda dapat mengedit file `src/main/java/com/ibuinem/pos/config/DatabaseConfig.java`:

```java
private static final String DEFAULT_HOST = "localhost";
private static final String DEFAULT_PORT = "3306";
private static final String DEFAULT_DB_NAME = "jajanan_ibu_inem";
private static final String DEFAULT_USER = "root";
private static final String DEFAULT_PASSWORD = "";
```

---

## 🛡️ Keamanan & Validasi
- **SQL Injection Prevention**: Seluruh query database menggunakan `PreparedStatement`.
- **Atomic Transactions**: Proses checkout kasir menggunakan SQL Transaction (`setAutoCommit(false)`, `commit()`, `rollback()`) untuk memastikan integritas data penjualan, detail transaksi, pembayaran, dan stok produk.
- **Validasi Input**: Menolak stok minus, harga minus, quantity <= 0, dan input kosong.
