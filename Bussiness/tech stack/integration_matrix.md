# 🔌 Integration Matrix - Matriks Antarmuka & Layanan

Dokumen ini memetakan seluruh titik integrasi sistem internal dan eksternal UMKM Bu Inem beserta protokol, autentikasi, dan strategi mitigasi kegagalannya.

---

## 1. Peta Topologi Integrasi

```mermaid
graph LR
    Frontend["Frontend Next.js"]
    Backend["Backend Spring Boot 3"]
    Database[("MariaDB / MySQL 8.0")]
    Groq["Groq Cloud LLM API"]
    Xendit["Xendit Payment Gateway"]
    Printer["Printer Termal 58mm"]

    Frontend -- "Bearer JWT / REST JSON" --> Backend
    Backend -- "HikariCP JDBC (Port 3306)" --> Database
    Frontend -- "HTTPS REST (Groq API Key)" --> Groq
    Backend -- "HTTPS Webhook / Signature" --> Xendit
    Frontend -- "Web Print / Raw ESC-POS" --> Printer

    style Frontend fill:#eff6ff,stroke:#2563eb;
    style Backend fill:#ecfdf5,stroke:#10b981;
    style Database fill:#fef3c7,stroke:#d97706;
    style Groq fill:#f5f3ff,stroke:#7c3aed;
    style Xendit fill:#fff1f2,stroke:#e11d48;
```

---

## 2. Tabel Spesifikasi Integrasi

| Titik Integrasi | Arah & Protokol | Format Payload | Autentikasi | Fallback Saat Offline/Error |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend <-> Backend** | Bipasal / HTTP REST | JSON (`ApiResponse<T>`) | Bearer JWT Header | Cache lokal PWA & queue transaksi offline |
| **Backend <-> Database** | Sinkron / TCP JDBC | SQL PreparedStatements | Database Username & Password | Retry koneksi HikariCP + pool reconnection |
| **Agent <-> Groq API** | Bipasal / HTTPS REST | OpenAI Chat Completion format | `Authorization: Bearer gsk_...` | Local Graph Traversal Engine (tanpa LLM) |
| **Backend <-> Payment Gateway** | Asinkron Webhook | JSON (Xendit Signature) | HMAC Webhook Token | Polling manual status QRIS di dashboard |
| **Frontend <-> Kasir Printer** | Lokal / USB & Bluetooth | Plain text monospaced / ESC-POS | Driver Sistem Operasi | Cetak PDF / simpan tangkapan layar receipt |
