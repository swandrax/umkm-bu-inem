# 🗄️ Strategi Migrasi Database - Zero Downtime & Backward Compatibility

Dokumen ini menjelaskan strategi migrasi database skema relasional UMKM Bu Inem dari versi awal V1 (POS legacy) hingga penambahan modul CRM & Jasa V5-V8 secara aditif tanpa merusak data transaksi eksisting.

---

## 1. Peta Jalur Migrasi Skema (V1 s/d V8)

```mermaid
graph TD
    V1["V1: Core POS Legacy (users, categories, products, sales, sale_items)"]
    V2["V2: Optimasi Index & Audit Logs"]
    V3["V3: Payment Gateway & Xendit QRIS Fields"]
    V4["V4: Offline Sync & Version Tracking"]
    V5["V5: business_settings (Konfigurasi Profil Toko, Jam Buka, No WA)"]
    V6["V6: crm_leads (Manajemen Calon Pelanggan & Katering)"]
    V7["V7: service_products (Katalog Paket Jajanan & Katering Acara)"]
    V8["V8: orders, order_items & receipts (Order Commerce & Struk 58mm)"]

    V1 --> V2 --> V3 --> V4 --> V5 --> V6 --> V7 --> V8

    style V1 fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    style V5 fill:#ecfdf5,stroke:#059669;
    style V6 fill:#ecfdf5,stroke:#059669;
    style V7 fill:#ecfdf5,stroke:#059669;
    style V8 fill:#ecfdf5,stroke:#059669;
```

---

## 2. Prinsip Non-Destruktif (Additive Schema Changes)

```mermaid
flowchart LR
    subgraph Rule1["Aturan 1: Dilarang Drop Kolom"]
        R1["Kolom legacy tetap ada untuk kompatibilitas DAO lama"]
    end
    subgraph Rule2["Aturan 2: Default Value Aman"]
        R2["Setiap kolom baru wajib memiliki DEFAULT value yang aman"]
    end
    subgraph Rule3["Aturan 3: IF NOT EXISTS"]
        R3["Seluruh skrip migrasi wajib memakai klausa DDL aman IF NOT EXISTS"]
    end
```

---

## 3. Prosedur Rollback & Verifikasi Migrasi

1. **Pre-Migration Backup**: Eksekusi dump skema dan data menggunakan `mysqldump --single-transaction`.
2. **Dry-Run Staging**: Verifikasi skrip SQL pada instance database uji coba.
3. **Execution**: Eksekusi file migrasi terurut (`V5__...sql`, `V6__...sql`, dst.).
4. **Smoke Test Backend**: Menjalankan pengujian otomatis `mvn test` untuk memastikan semua DAO lulus verifikasi 100%.
