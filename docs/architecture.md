# Arsitektur, LRS, dan pengembangan

Dokumen ini adalah baseline implementasi. Ia tidak menggantikan penilaian hukum, DPIA, atau sertifikasi ISO; pemilik sistem tetap bertanggung jawab atas pengendalian dan bukti pelaksanaannya.

## System design

```mermaid
flowchart LR
  U[Kasir/Admin] --> G[Caddy TLS gateway]
  G --> W[Next.js web]
  G --> A[Spring Boot API]
  A --> DB[(MySQL 8.4)]
  A --> P[Prometheus]
  P --> GR[Grafana]
  A --> AL[(Audit log)]
```

Prinsipnya: browser hanya berbicara ke origin yang sama; database dan Actuator tidak dipublikasikan. Caddy menjadi satu-satunya ingress. Dalam VPS, aktifkan HTTPS otomatis dengan mengganti `:80` menjadi nama domain pada `Caddyfile`, batasi SSH, dan simpan `.env` hanya di server.

## Logical record structure (LRS)

| Rekaman | Kunci / relasi | Fungsi |
|---|---|---|
| `users` | `id`, `username` unik | akun internal, hash BCrypt, RBAC |
| `customers` | `id`, opsional pada `sales` | PII minimum; consent, hash telepon, penghapusan lunak |
| `categories` → `products` | `products.category_id` | katalog dan stok |
| `sales` → `sale_details` | `sale_details.sale_id` | header transaksi dan snapshot item/harga |
| `sales` → `payments` | `payments.sale_id` | bukti/status pembayaran, bukan data kartu |
| `sales` → `shipping` → `delivery_logs` | FK berantai | fulfilment dan riwayat pengiriman |
| `audit_logs` | actor/resource/waktu | jejak akses dan tindakan penting |

## ERD target

```mermaid
erDiagram
  USERS ||--o{ SALES : processes
  CUSTOMERS o|--o{ SALES : places
  CATEGORIES ||--o{ PRODUCTS : contains
  SALES ||--|{ SALE_DETAILS : contains
  PRODUCTS ||--o{ SALE_DETAILS : snapshots
  SALES ||--o{ PAYMENTS : settles
  SALES ||--o| SHIPPING : fulfils
  SHIPPING ||--o{ DELIVERY_LOGS : tracks
  USERS o|--o{ AUDIT_LOGS : acts
  USERS { bigint id PK
          varchar username UK
          varchar password_hash
          enum role
          boolean active }
  CUSTOMERS { bigint id PK
              varchar name
              varchar phone
              char phone_hash
              datetime consent_at
              datetime deleted_at }
  SALES { bigint id PK
          varchar transaction_number UK
          bigint user_id FK
          bigint customer_id FK
          decimal total
          datetime transaction_date }
  AUDIT_LOGS { bigint id PK
               bigint actor_user_id FK
               varchar action
               varchar resource_type
               enum outcome
               datetime created_at }
```

`sale_details.product_name` dan `price` sengaja disimpan sebagai snapshot: perubahan katalog tidak mengubah bukti transaksi historis. Nilai uang memakai `DECIMAL`, bukan float.

## Alur transaksi yang aman

```mermaid
sequenceDiagram
  participant K as Kasir
  participant A as API
  participant D as MySQL
  K->>A: POST /sales + Bearer JWT
  A->>A: validasi DTO, RBAC, hitung total server-side
  A->>D: BEGIN
  A->>D: UPDATE products SET stock=stock-qty WHERE stock >= qty
  alt stok atau pembayaran tidak valid
    D-->>A: 0 row / error
    A->>D: ROLLBACK
    A-->>K: 400 tanpa data sensitif
  else valid
    A->>D: insert sales, details, payment, audit log
    A->>D: COMMIT
    A-->>K: 201 struk
  end
```

Perbaikan penting: verifikasi stok pada database tetap atomik melalui conditional update. Refactor berikutnya yang disarankan adalah memindahkan seluruh DAO ke repository Spring yang diinjeksi dan memakai satu transaksi Spring; saat ini `SaleDAO` masih mengelola transaksi JDBC sendiri sehingga `@Transactional` pada service bukan sumber transaksi sebenarnya.
