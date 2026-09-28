# 📦 Local Storage & Offline Cache Architecture

Dokumen ini mendokumentasikan pemanfaatan penyimpanan internal peramban (*browser local storage & session storage*) untuk menyimpan preferensi kasir, token JWT terenkripsi, serta keranjang belanja sementara.

---

## 1. Pembagian Ruang Simpan Browser (Browser Storage Allocation)

```mermaid
graph TD
    subgraph BrowserStorage["Penyimpanan Internal Klien (Client-Side Storage)"]
        LS["localStorage: Token JWT, Data Kasir Aktif, Preferensi Tema"]
        SS["sessionStorage: Filter Pencarian Sementara, Tab Aktif"]
        CS["CacheStorage: Shell PWA, File Ikon, Manifest, Font"]
        IDB["IndexedDB: Katalog Produk Lengkap & Antrean Transaksi Offline"]
    end

    POS["Aplikasi Kasir POS"] --> LS
    POS --> IDB
    PublicWeb["Portal Web Pelanggan"] --> CS
    PublicWeb --> SS

    style LS fill:#fef3c7,stroke:#f59e0b;
    style IDB fill:#ecfdf5,stroke:#10b981;
    style CS fill:#eff6ff,stroke:#3b82f6;
    style SS fill:#f5f3ff,stroke:#8b5cf6;
```

---

## 2. Struktur Kunci LocalStorage

| Key | Tipe Data | Deskripsi | Masa Berlaku |
| :--- | :--- | :--- | :--- |
| `auth_token` | String (JWT) | Token otorisasi kasir/admin | 24 Jam (Expires di server) |
| `pos_cart_state` | JSON Object | Item dalam keranjang kasir POS saat ini | Tetap tersimpan hingga checkout |
| `last_sync_timestamp`| Integer (Epoch) | Waktu terakhir katalog di-refresh dari server | Diperbarui per fetch |
| `human_agent_history`| JSON Array | Riwayat percakapan dengan Bu Inem di browser | Sesi pengguna |
