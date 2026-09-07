# Jajanan Ibu Inem - Modern Full-Stack POS Architecture

Sistem Point of Sales (POS) & Manajemen Toko UMKM modern untuk **Jajanan Ibu Inem**. Direfaktor secara menyeluruh menjadi arsitektur full-stack modern dengan **Java 21 + Spring Boot 3** sebagai satu-satunya backend utama, **Next.js 16 (App Router) + TypeScript** sebagai frontend utama, dan **tanpa legacy PHP**.

---

## 🏗️ Tech Stack & Arsitektur Utama

### Backend
- **Runtime & Framework**: Java 21 (LTS) + Spring Boot 3
- **Architecture**: Clean Layered Architecture (`controller` -> `service` -> `repository` / `dao` -> `MySQL`)
- **API**: REST API standar `/api/v1/*` dengan JSON response seragam (`ApiResponse<T>`)
- **Security**: Spring Security + JWT Stateless Authentication + BCrypt Password Hashing (Role: `ADMIN`, `CASHIER`)
- **Integrity**: Transactional Checkout & Concurrency Stock Protection (Anti-race condition, rollback otomotis)
- **Database**: MySQL

### Frontend
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Server State**: **TanStack Query** (sole server-state engine: caching, stale time, invalidation, mutations)
- **Table / Data Interaction**: **TanStack Table** (sorting, client/server pagination, filters)
- **Client / UI State**: **Zustand** (`cart.store.ts`, `ui.store.ts`, `filter.store.ts`, `auth.store.ts`)
- **Forms & Validation**: **React Hook Form** + **Zod** schema validation
- **Styling**: **Tailwind CSS** dengan **LIGHT THEME ONLY** (Desain hangat bernuansa UMKM: soft warm white `#faf9f5`, putih, amber/orange primary, abu-abu netral)
- **Icons**: Lucide React

---

## 🚀 Fitur Utama

1. **Kasir POS Cepat & Responsif (`/pos`)**
   - Pencarian instan dan filter kategori.
   - Keranjang belanja real-time (tambah/kurang qty, kalkulasi subtotal, diskon, pajak, grand total).
   - Dukungan 8 metode pembayaran: **CASH, QRIS, TRANSFER, DEBIT, GOPAY, OVO, DANA, SHOPEEPAY**.
   - Integrasi modal cetak struk thermal 58mm dengan kode QR verifikasi transaksi.

2. **Dashboard Real-Time Metrics (`/dashboard`)**
   - Metrik riil langsung dari backend Spring Boot: Omset Hari Ini, Jumlah Transaksi, Produk Terjual, dan Pelanggan Terdaftar.
   - Grafik tren harian, ranking top produk terlaris, dan distribusi metode pembayaran.
   - Peringatan stok produk menipis (Low Stock Alert).

3. **Master Produk (`/products`)**
   - CRUD Produk dengan validasi Zod + React Hook Form.
   - Tabel interaktif TanStack Table dengan sorting, pagination, dan filter kategori.
   - Soft delete dan pemantauan stok aman.

4. **Kategori Jajanan (`/categories`)**
   - Pengelompokan aneka jajanan pasar, kue basah, snack kering, dan minuman.
   - CRUD Kategori dengan TanStack Table & TanStack Query.

5. **Data Pelanggan & Loyalitas (`/customers`)**
   - Manajemen pelanggan setia, nomor WhatsApp/telepon, dan alamat pengiriman.
   - Pelacakan poin loyalitas kasir.

6. **Riwayat Transaksi Kasir (`/transactions`)**
   - Daftar seluruh transaksi dengan filter tanggal dan no transaksi.
   - Modal rincian belanja dan cetak ulang struk thermal.

7. **Monitoring Pembayaran (`/payments`)**
   - Rekapitulasi pembayaran kasir dengan status dan nomor referensi.

8. **Manajemen Pengiriman & Kurir (`/shipping`)**
   - Pelacakan status kirim pesanan (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED).
   - Pengisian nomor resi kurir dan catatan pengantaran.

9. **Laporan Penjualan & Ekspor (`/reports`)**
   - Laporan Harian, Mingguan, dan Bulanan.
   - Ekspor data CSV untuk **BMC Bisnis & Data Analytics Mingguan**.
   - Ekspor spreadsheet Excel (`.xlsx`) dan PDF struk laporan.

10. **Pengaturan Toko & POS (`/settings`)**
    - Konfigurasi nama toko, alamat, telepon, footer struk, dan pajak resto default.

11. **Manajemen Pengguna (`/users`)**
    - Manajemen akun Admin dan Kasir dengan role-based authorization.

---

## 📁 Struktur Repository

```text
umkm-bu-inem/
│
├── frontend/                     # Next.js 16 App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── pos/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── customers/
│   │   │   ├── transactions/
│   │   │   ├── payments/
│   │   │   ├── shipping/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   ├── users/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/               # Button, Input, Modal, Badge, Card
│   │   │   ├── layout/           # Navbar, Sidebar, AppShell
│   │   │   └── pos/              # PaymentModal, ThermalReceiptModal
│   │   ├── hooks/                # TanStack Query custom hooks
│   │   ├── lib/
│   │   │   ├── api/              # Centralized REST API client
│   │   │   ├── query/            # Query client & query keys
│   │   │   └── utils.ts
│   │   ├── schemas/              # Zod validation schemas
│   │   ├── stores/               # Zustand UI stores (cart, ui, filter, auth)
│   │   └── types/                # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── src/main/java/com/ibuinem/pos/ # Java 21 + Spring Boot 3 Backend
│   ├── config/                   # Security, DB, Web MVC Config
│   ├── controller/               # REST API Controllers (/api/v1/*)
│   ├── service/                  # Business & Transaction Services
│   ├── repository/               # Data Access Interfaces
│   ├── dao/                      # JDBC DAOs & MySQL Operations
│   ├── model/                    # Domain Entities
│   ├── dto/                      # Data Transfer Objects
│   ├── mapper/                   # Entity & DTO Mappers
│   ├── security/                 # JWT Authentication Filters
│   ├── exception/                # Global @ControllerAdvice Handler
│   ├── validation/               # Concurrency & Stock Validators
│   ├── utils/                    # CSV / Excel / PDF Exporters
│   └── PosApplication.java       # Spring Boot Main Application
│
├── database.sql                  # MySQL Database Schema
├── pom.xml                       # Maven Configuration
├── .env.example                  # Environment Variables Template
└── README.md
```

---

## ⚙️ Cara Menjalankan Aplikasi

### 1. Prasyarat
- **Java 21 (JDK 21 LTS)**
- **Node.js 20+** dan **npm**
- **MySQL Database** (dapat menggunakan XAMPP, Laragon, atau MySQL Server standalone)

### 2. Konfigurasi Database
1. Buat database baru di MySQL:
   ```sql
   CREATE DATABASE jajanan_ibu_inem;
   ```
2. Impor schema tabel dari `database.sql`:
   ```bash
   mysql -u root -p jajanan_ibu_inem < database.sql
   ```
3. Salin `.env.example` menjadi `.env` di root direktori jika ingin menyesuaikan koneksi database:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=jajanan_ibu_inem
   DB_USERNAME=root
   DB_PASSWORD=
   JWT_SECRET=BuInemSuperSecretKeyForPOSApplication2026SecureJWTKey!
   ```

### 3. Menjalankan Backend Spring Boot
Dari root direktori project:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
Backend akan aktif di `http://localhost:8080` dan menyediakan API di `http://localhost:8080/api/v1/*`.

### 4. Menjalankan Frontend Next.js
Dari direktori `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
Buka browser di `http://localhost:3000`.

### 5. Akun Login Default
- **Admin**: Username: `admin` | Password: `password`
- **Kasir**: Username: `kasir1` | Password: `password`
