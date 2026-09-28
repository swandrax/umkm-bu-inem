# 🚀 CI/CD Pipeline - Otomasi Pengujian & Rilis

Dokumen ini menjelaskan alur integrasi berkelanjutan (*Continuous Integration*) dan pengiriman otomatis (*Continuous Delivery*) menggunakan GitHub Actions untuk menjamin stabilitas kode.

---

## 1. Alur Pipeline GitHub Actions

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / Pair Programmer
    participant Git as GitHub Repository
    participant Runner as GitHub Actions Runner
    participant VPS as VPS Server Produksi

    Dev->>Git: Push Commit ke branch development / main
    Git->>Runner: Trigger Workflow CI (Java & Next.js)
    Runner->>Runner: Setup JDK 21 & Node.js 20
    Runner->>Runner: Jalankan mvn clean test (14 Test Kasir & Order)
    Runner->>Runner: Jalankan npm run lint & build
    
    alt Jika Pengujian Lolos
        Runner->>Runner: Build Docker Images (Backend & Frontend)
        Runner->>VPS: SSH Deploy: docker compose pull && up -d --build
        VPS-->>Runner: Status Healthcheck HTTP 200 OK
        Runner-->>Git: Status Hijau (Build Passed)
    else Jika Pengujian Gagal
        Runner-->>Git: Status Merah (Build Failed)
        Runner-->>Dev: Notifikasi Kegagalan (Mencegah Rilis Rusak)
    end
```

---

## 2. Pengecekan Kualitas Otomatis

1. **Backend Unit Testing**: Validasi integritas kalkulasi harga, pemotongan stok `StockValidator`, dan DTO mapper.
2. **TypeScript Strict Checking**: Memastikan tidak ada *type error* atau impor rusak pada komponen UI.
3. **Audit Kepatuhan Keamanan**: Pengecekan celah keamanan dependensi dengan `npm audit` dan OWASP dependency check.
