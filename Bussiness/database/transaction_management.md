# 🔒 Transaction Management & ACID Guarantees

Dokumen ini mendokumentasikan implementasi transaksi database tingkat kode menggunakan Java JDBC murni untuk menjamin konsistensi data finansial dan stok inventaris.

---

## 1. Alur Transaksi Kasir & Checkout Atomik

```mermaid
sequenceDiagram
    autonumber
    actor Kasir as Kasir / Pelanggan Web
    participant Service as OrderService / SaleService
    participant Conn as JDBC Connection
    participant DB as MariaDB InnoDB

    Kasir->>Service: Eksekusi Checkout (3 Item Kue)
    Service->>Conn: conn.setAutoCommit(false) [Mulai Transaksi]
    
    Service->>DB: INSERT INTO sales / orders
    DB-->>Service: Return Generated PK ID
    
    loop Setiap Item Pesanan
        Service->>DB: SELECT stock FROM products WHERE id = ? FOR UPDATE [Pessimistic Lock]
        alt Jika Stok Cukup
            Service->>DB: UPDATE products SET stock = stock - ? WHERE id = ?
            Service->>DB: INSERT INTO sale_items / order_items
        else Jika Stok Kurang
            Service->>Conn: conn.rollback() [Batalkan Seluruh Transaksi]
            Service-->>Kasir: Throw BusinessException("INSUFFICIENT_STOCK")
        end
    end

    Service->>DB: INSERT INTO payments / receipts
    Service->>Conn: conn.commit() [Simpan Permanen]
    Service->>Conn: conn.setAutoCommit(true)
    Service-->>Kasir: Transaksi Berhasil & Cetak Struk
```

---

## 2. Prinsip ACID yang Dijamin

- **Atomicity**: Jika ada satu item yang stoknya mendadak habis atau koneksi terputus di tengah jalan, seluruh transaksi di-rollback tanpa sisa data yatim (*orphan data*).
- **Consistency**: Aturan stok tidak boleh minus (`CHECK (stock >= 0)`) selalu ditegakkan.
- **Isolation**: Tingkat isolasi `READ COMMITTED` mencegah *dirty reads* antar kasir yang melayani bersamaan di jam sibuk.
- **Durability**: Redo log InnoDB memastikan data yang sudah di-commit tidak akan hilang saat terjadi listrik padam mendadak.
