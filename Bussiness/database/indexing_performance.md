# ⚡ Indexing & Performance Optimization

Dokumen ini mendokumentasikan strategi pengindeksan database MariaDB/MySQL untuk menjamin kueri kasir POS tetap di bawah 10ms meskipun jumlah data transaksi terus bertumbuh.

---

## 1. Peta Indeks B-Tree Kunci

```mermaid
graph TD
    subgraph TableSales["Tabel sales"]
        Idx_Inv["idx_sales_invoice (invoice_number) [UNIQUE]"]
        Idx_Date["idx_sales_created_at (created_at) [BTREE]"]
        Idx_Status["idx_sales_payment_status (payment_status) [BTREE]"]
    end

    subgraph TableOrders["Tabel orders"]
        Idx_OrderNum["idx_orders_order_number (order_number) [UNIQUE]"]
        Idx_OrderDate["idx_orders_created_at (created_at) [BTREE]"]
        Idx_OrderCust["idx_orders_customer_phone (customer_phone) [BTREE]"]
    end

    subgraph TableProducts["Tabel products"]
        Idx_Code["idx_products_code (code) [UNIQUE]"]
        Idx_CatActive["idx_products_cat_active (category_id, active) [COMPOSITE]"]
    end
```

---

## 2. Optimasi Query & Execution Plan

1. **Composite Indexing untuk Filter Kasir**:
   - `CREATE INDEX idx_products_cat_active ON products(category_id, active);`
   - Memungkinkan dropdown kategori di kasir langsung menggunakan index range scan tanpa table scan penuh (*Using index condition*).
2. **Kueri Pagination Terbatas**:
   - Menggunakan klausa `LIMIT ? OFFSET ?` dengan order primary key terindeks untuk mencegah memory sort buffer overflow.
3. **Penyimpanan JSON Features**:
   - Kolom `features` pada `service_products` disimpan dalam format JSON ringan tanpa tabel relasi berlebih, mengurangi jumlah `JOIN` yang tidak perlu.
