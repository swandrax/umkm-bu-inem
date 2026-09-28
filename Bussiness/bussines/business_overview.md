# 🏢 Business Overview - UMKM Jajanan Bu Inem

Dokumen ini menjelaskan model bisnis holistik, ekosistem operasional, dan transformasi digital UMKM Jajanan Tradisional Ibu Inem dari sistem manual tradisional menuju platform Point of Sale (POS), CRM, dan Automated Commerce terintegrasi.

---

## 1. Profil & Model Bisnis

UMKM Jajanan Bu Inem bergerak dalam produksi dan distribusi kuliner tradisional khas nusantara (lemper, pastel, lumpia basah, risol mayo, klepon, nagasari, kue lapis) dan layanan pemesanan paket jajanan pasar tampah, snack box kantor, serta katering hajatan.

```mermaid
graph TD
    subgraph SupplyChain["Rantai Pasok & Produksi"]
        A[Petani & Supplier Bahan Baku Lokal] --> B[Dapur Produksi Bu Inem]
        B --> C[Quality Control & Kemasan Higienis]
    end

    subgraph Distribution["Kanal Distribusi & Penjualan"]
        C --> D[Outlet Fisik / Kasir POS Cepat]
        C --> E[Portal Online Pelanggan / Web Commerce]
        C --> F[Pesanan B2B / Katering Kantor & Acara]
    end

    subgraph CustomerTouchpoints["Segmen Pelanggan"]
        D --> G[Pelanggan Walk-In / Harian]
        E --> H[Pelanggan Digital / Gen-Z & Milenial]
        F --> I[Korporat, Instansi & Panitia Acara]
    end

    style SupplyChain fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    style Distribution fill:#ecfdf5,stroke:#059669,stroke-width:2px;
    style CustomerTouchpoints fill:#eff6ff,stroke:#2563eb,stroke-width:2px;
```

---

## 2. Peta Arus Pendapatan (Revenue Streams)

```mermaid
pie title Distribusi Sumber Pendapatan UMKM Bu Inem
    "Penjualan Ritel Kasir Harian" : 42
    "Paket Snack Box Kantor & Rapat" : 28
    "Katering Jajanan Tampah Acara" : 18
    "Layanan Kustom & Pre-Order Hajatan" : 12
```

1. **Ritel Harian (Direct Walk-in)**: Penjualan produk satuan siap saji di toko fisik dengan perputaran kas cepat melalui kasir offline/online.
2. **Paket Snack Box Instansi**: Pemesanan terjadwal (B2B) untuk instansi pemerintah, sekolah, dan perkantoran.
3. **Katering Jajanan Tampah Tradisional**: Produk premium untuk acara adat, syukuran, dan pernikahan dengan margin keuntungan lebih tinggi.
4. **Layanan Kustom**: Pemesanan rasa, kemasan hias, dan ukuran khusus sesuai permintaan pelanggan.

---

## 3. Matriks Ekosistem Nilai & Stakeholder

```mermaid
mindmap
  root((Ekosistem UMKM Bu Inem))
    Pelanggan
      Walk-in Harian
      Korporat & Instansi
      Penyelenggara Acara
    Mitra
      Supplier Tepung & Beras Ketan
      Pengrajin Tampah Anyaman
      Jasa Kurir Logistik Instan
    Internal
      Tim Dapur & Chef
      Kasir & Operasional Toko
      Admin Keuangan & Stok
      Human AI Agent Ibu Inem
    Regulator & Keuangan
      Penerbit Standar Halal / P-IRT
      Payment Gateway QRIS & Bank
```

---

## 4. Indikator Kinerja Utama (KPI Bisnis)

| Matrik KPI | Target 2026 | Strategi Pencapaian |
| :--- | :--- | :--- |
| **Kecepatan Transaksi Kasir** | < 15 detik/transaksi | Quick-cart scanner, offline-first PWA, shortcut keyboard POS |
| **Akurasi Stok Bahan & Produk** | > 99.2% | Validasi stok otomatis, alert low-stock realtime di dashboard |
| **Konversi Pengunjung Web ke Order** | > 12.5% | Human Agent AI interaktif, checkout tanpa repot akun, QRIS instan |
| **Kepuasan Pelanggan (CSAT)** | 4.85 / 5.0 | Layanan human agent hangat & ramah, nota struk termal 58mm resmi |
| **Lama Respons Pelanggan** | < 3 detik | Integrasi Groq LLaMA 3.3 Graph RAG 24/7 |
