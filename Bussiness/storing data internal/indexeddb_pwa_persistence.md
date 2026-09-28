# 🗃️ IndexedDB & PWA Offline Persistence

Dokumen ini mendokumentasikan implementasi IndexedDB di browser kasir untuk mendukung operasional POS tanpa koneksi internet (*offline-first capability*) saat jaringan internet toko terputus.

---

## 1. Alur Sinkronisasi Offline-to-Online Kasir

```mermaid
sequenceDiagram
    autonumber
    actor Kasir as Kasir Toko Bu Inem
    participant UI as POS User Interface
    participant IDB as IndexedDB (Browser Local DB)
    participant Sync as Sync Manager / Service Worker
    participant Server as Spring Boot Backend

    Note over Kasir,Server: Kondisi Internet Terputus (Offline)
    Kasir->>UI: Tambah kue ke keranjang & klik Bayar Tunai
    UI->>IDB: Simpan transaksi ke tabel 'offline_transactions' (Status: PENDING_SYNC)
    UI->>IDB: Potong stok lokal di tabel 'cached_products'
    UI-->>Kasir: Cetak struk termal offline berhasil

    Note over Kasir,Server: Internet Kembali Terhubung (Online)
    Sync->>Sync: Deteksi window.navigator.onLine === true
    Sync->>IDB: Ambil semua antrean transaksi PENDING_SYNC
    loop Setiap Transaksi Offline
        Sync->>Server: POST /api/v1/sales/sync-offline
        Server-->>Sync: Return 200 OK & ID Invoice Resmi
        Sync->>IDB: Tandai status = SYNCED
    end
    Sync-->>UI: Notifikasi: "Semua transaksi offline berhasil disinkronkan!"
```

---

## 2. Struktur Object Store IndexedDB

- **`products`**: Menyimpan seluruh katalog kue dengan indeks `id`, `code`, dan `category_id`.
- **`offline_sales`**: Menyimpan data transaksi kasir yang dibuat dalam keadaan offline.
- **`offline_sale_items`**: Menyimpan rincian item, kuantitas, dan harga transaksi offline.
