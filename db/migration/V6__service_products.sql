-- V6: Service Products catalog for UMKM digital offerings
CREATE TABLE IF NOT EXISTS service_products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  short_description VARCHAR(255) NULL,
  full_description TEXT NULL,
  category_id INT NULL,
  base_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_type ENUM('PERCENTAGE', 'FIXED') NULL,
  discount_value DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  final_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  duration VARCHAR(50) NULL,
  features JSON NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  image_url VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_service_product_category (category_id),
  INDEX idx_service_product_active (active, featured),
  CONSTRAINT fk_service_products_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed core UMKM service offerings if empty
INSERT INTO service_products (id, slug, name, short_description, full_description, base_price, discount_type, discount_value, final_price, duration, features, active, featured, image_url)
VALUES 
(1, 'website-company-profile', 'Website Company Profile UMKM', 'Website representatif profesional untuk memperkuat citra dan kredibilitas bisnis UMKM Anda.', 'Paket pembuatan website profil bisnis modern dengan desain responsif, optimasi SEO lokal, integrasi WhatsApp, formulir kontak, dan hosting cepat satu tahun.', 1500000.00, 'PERCENTAGE', 10.00, 1350000.00, '3-5 Hari Kerja', JSON_ARRAY('Desain Responsif Mobile & Desktop', 'Optimasi SEO On-Page', 'Integrasi Tombol WhatsApp Interaktif', 'Gratis Domain & Hosting 1 Tahun', 'Formulir Kontak Terhubung Email'), 1, 1, '/images/services/company-profile.webp'),
(2, 'website-toko-online-katalog', 'Website Katalog & Pemesanan Online', 'Solusi etalase digital interaktif tanpa ribet untuk menerima pesanan dan showcase produk 24/7.', 'Katalog digital dinamis dengan sistem pencarian instan, filter kategori, keranjang belanja, checkout cepat WhatsApp/Formulir, serta dashboard pengelolaan produk mandiri.', 2500000.00, 'FIXED', 300000.00, 2200000.00, '5-7 Hari Kerja', JSON_ARRAY('Katalog Produk Tanpa Batas', 'Sistem Pencarian & Filter Cepat', 'Checkout Keranjang WhatsApp Otomatis', 'Dashboard Manajemen Produk Mandiri', 'Panduan Pengelolaan Lengkap'), 1, 1, '/images/services/online-catalog.webp'),
(3, 'crm-customer-management-setup', 'Setup Sistem CRM & Pelanggan UMKM', 'Otomatisasi pencatatan prospek, follow-up pelanggan, dan riwayat transaksi bisnis Anda.', 'Implementasi sistem CRM terpusat untuk memantau siklus hidup pelanggan (Lead hingga Deal), mencatat riwayat transaksi, aktivasi retensi loyalitas, dan pelaporan penjualan periodik.', 3200000.00, NULL, 0.00, 3200000.00, '7-10 Hari Kerja', JSON_ARRAY('Pipeline Prospek / Kanban Visual', 'Database Pelanggan Terpusat (Customer 360)', 'Riwayat Aktivitas & Catatan Interaksi', 'Laporan Omset & Analitik Retensi', 'Pelatihan Staf Admin CRM'), 1, 1, '/images/services/crm-setup.webp'),
(4, 'integrasi-pembayaran-qris', 'Integrasi Pembayaran QRIS & Kasir Digital', 'Terima pembayaran digital instan dari seluruh e-wallet dan mobile banking nasional.', 'Setup gerbang pembayaran QRIS resmi/demo, pencatatan otomatis status transaksi berhasil, dan cetak bukti transaksi digital/thermal yang rapi.', 1200000.00, 'PERCENTAGE', 15.00, 1020000.00, '2-3 Hari Kerja', JSON_ARRAY('Pendaftaran QRIS Dinamis & Statis', 'Verifikasi Transaksi Real-time', 'Dukungan Struk Cetak Thermal 58mm', 'Pelaporan Rekonsiliasi Keuangan', 'Pendampingan Teknis'), 1, 0, '/images/services/qris-integration.webp'),
(5, 'pemeliharaan-maintenance-sistem', 'Layanan Pemeliharaan & Monitoring Sistem', 'Perlindungan berkala, update keamanan rutin, backup data, dan technical support prioritas.', 'Paket perawatan komprehensif bulanan untuk menjamin performa website, database, keamanan SSL, dan asistensi teknis cepat saat terjadi kendala operasional.', 750000.00, NULL, 0.00, 750000.00, '1 Bulan', JSON_ARRAY('Backup Database Otomatis Mingguan', 'Monitoring Server & Uptime 99.9%', 'Pembaruan Patch Keamanan Rutin', 'Dukungan Teknis Prioritas via WA', 'Laporan Kinerja Bulanan'), 1, 0, '/images/services/maintenance.webp'),
(6, 'pengembangan-aplikasi-kustom', 'Aplikasi Web Kustom & Database Sistem', 'Aplikasi bisnis dirancang spesifik sesuai alur kerja operasional unik UMKM Anda.', 'Pengembangan sistem web end-to-end yang disesuaikan dengan kebutuhan inventaris khusus, multi-cabang, otorisasi peran berjenjang, dan integrasi API pihak ketiga.', 5000000.00, 'PERCENTAGE', 5.00, 4750000.00, '14-21 Hari Kerja', JSON_ARRAY('Analisis Kebutuhan Bisnis Spesifik', 'Arsitektur Skalabel Java Spring + Next.js', 'Desain UI/UX Eksklusif & Intuitif', 'Database ACID Teruji Berperforma Tinggi', 'Garansi Bug Free 3 Bulan'), 1, 1, '/images/services/custom-app.webp')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
