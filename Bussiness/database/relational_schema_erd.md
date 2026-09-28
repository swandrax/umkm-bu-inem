# 🗄️ Relational Schema & Entity Relationship Diagram (ERD)

Dokumen ini menyajikan model data konseptual dan relasional lengkap dari sistem database POS, CRM, dan Order Commerce UMKM Jajanan Bu Inem.

---

## 1. Entity Relationship Diagram (ERD) Lengkap

```mermaid
erDiagram
    USERS ||--o{ SALES : "memproses transaksi"
    USERS ||--o{ AUDIT_LOGS : "mencatat aktivitas"
    CATEGORIES ||--o{ PRODUCTS : "mengelompokkan produk"
    PRODUCTS ||--o{ SALE_ITEMS : "tercatat di item penjualan"
    SALES ||--o{ SALE_ITEMS : "memiliki rincian item"
    SALES ||--o| PAYMENTS : "memiliki catatan pembayaran"
    CUSTOMERS ||--o{ SALES : "melakukan pembelian"
    
    CATEGORIES ||--o{ SERVICE_PRODUCTS : "mengelompokkan layanan"
    CUSTOMERS ||--o{ CRM_LEADS : "terhubung ke prospek"
    ORDERS ||--o{ ORDER_ITEMS : "memiliki rincian item order"
    ORDERS ||--o| RECEIPTS : "memiliki struk termal"
    ORDERS ||--o{ ORDER_STATUS_HISTORY : "memiliki riwayat status"

    USERS {
        int id PK
        varchar username UK
        varchar password_hash
        varchar full_name
        enum role "SUPER_ADMIN, ADMIN, CASHIER"
        boolean active
    }

    CATEGORIES {
        int id PK
        varchar name
        text description
    }

    PRODUCTS {
        int id PK
        varchar code UK
        varchar name
        int category_id FK
        decimal price
        int stock
        boolean active
    }

    SALES {
        int id PK
        varchar invoice_number UK
        int user_id FK
        int customer_id FK
        decimal total_amount
        decimal discount_amount
        decimal final_amount
        enum payment_method "CASH, QRIS, TRANSFER"
        enum payment_status "PENDING, PAID, CANCELLED"
    }

    SERVICE_PRODUCTS {
        bigint id PK
        varchar slug UK
        varchar name
        int category_id FK
        decimal base_price
        decimal final_price
        varchar duration
        json features
        boolean active
    }

    ORDERS {
        bigint id PK
        varchar order_number UK
        varchar customer_name
        varchar customer_phone
        decimal total_amount
        enum payment_status "PENDING, PAID, FAILED"
        enum order_status "PENDING, PROCESSING, COMPLETED"
    }

    BUSINESS_SETTINGS {
        int id PK
        varchar key UK
        text value
        varchar category
    }
```

---

## 2. Struktur Normalisasi Data

1. **Bentuk Normal Ketiga (3NF)**: Setiap atribut non-kunci bergantung secara fungsional penuh pada primary key masing-masing tabel tanpa dependensi transitif.
2. **Snapshot Harga Historis**: Tabel `sale_items` dan `order_items` menduplikasi `price_at_sale` untuk mencegah perubahan harga di master produk mengubah laporan keuangan masa lalu.
