# 🔄 Alur Operasional Bisnis (Operational Workflow)

Dokumen ini mendeskripsikan siklus lengkap operasional harian UMKM Bu Inem, mulai dari persiapan bahan, penjualan kasir harian, penanganan pesanan katering, hingga rekonsiliasi keuangan penutupan hari.

---

## 1. Siklus Operasional Harian Lengkap

```mermaid
sequenceDiagram
    autonumber
    actor Pelanggan as Pelanggan (Customer)
    participant POS as Kasir / Portal Web
    participant Server as Spring Boot API
    participant DB as Database MariaDB / MySQL
    participant Agent as Human Agent Bu Inem (AI)
    participant Dapur as Tim Produksi / Dapur

    Note over Pelanggan,Agent: Fase Konsultasi & Pemilihan Produk
    Pelanggan->>Agent: Tanya menu rekomendasi / katering hajatan 100 pax
    Agent->>Server: Fetch Katalog Layanan & Harga Aktif (Graph Context)
    Server-->>Agent: Data Paket & Stok
    Agent-->>Pelanggan: Rekomendasi ramah hangat & estimasi budget

    Note over Pelanggan,POS: Fase Pemesanan & Pembayaran
    Pelanggan->>POS: Checkout Pesanan (Walk-In / Order Online)
    POS->>Server: POST /api/v1/orders (Validasi Stok & Aturan)
    Server->>DB: Simpan Order & Lock Stok Item
    Server-->>POS: Order Dibuat (Order ID + Invoice QRIS / Cash)
    Pelanggan->>POS: Bayar via QRIS / Tunai
    POS->>Server: Update Payment Status = PAID
    Server->>DB: Potong Stok & Buat Struk Termal 58mm

    Note over POS,Dapur: Fase Produksi & Serah Terima
    Server->>Dapur: Notifikasi Tiket Pesanan & Jadwal Pengiriman
    Dapur-->>Pelanggan: Pesanan Siap / Dikirim Kurir
    POS-->>Pelanggan: Cetak Struk / Kirim Bukti WhatsApp
```

---

## 2. Alur Pengelolaan Pesanan & State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING_PAYMENT: Pelanggan Membuat Order
    PENDING_PAYMENT --> PAID: QRIS Terkonfirmasi / Kasir Terima Tunai
    PENDING_PAYMENT --> CANCELLED: Timeout Pembayaran (30 Menit)
    
    PAID --> PROCESSING: Dapur Memulai Produksi / Packing
    PROCESSING --> READY_FOR_PICKUP: Pesanan Selesai Dikemas
    
    READY_FOR_PICKUP --> COMPLETED: Diambil Pelanggan / Diserahkan Kurir
    CANCELLED --> [*]
    COMPLETED --> [*]
```

---

## 3. Rekonsiliasi & Penutupan Kasir (End of Day)

```mermaid
flowchart TD
    Start[Mulai Tutup Kasir Pukul 21:00] --> HitungUang[Hitung Total Uang Fisik di Laci Kas]
    HitungUang --> TarikLaporan[Tarik Laporan Penjualan di POS Dashboard]
    TarikLaporan --> CekSelisih{Apakah Ada Selisih Fisik vs Sistem?}
    CekSelisih -- Ya --> CatatAudit[Catat Alasan Selisih di Log Audit Keuangan]
    CekSelisih -- Tidak --> Finalisasi[Kunci Pembukuan Harian]
    CatatAudit --> Finalisasi
    Finalisasi --> BackupDB[Jalankan Script Backup Database Otomatis]
    BackupDB --> Selesai[Tutup Operasional Sukses]

    style Start fill:#fef3c7,stroke:#f59e0b;
    style CekSelisih fill:#fee2e2,stroke:#ef4444;
    style Selesai fill:#ecfdf5,stroke:#10b981;
```
