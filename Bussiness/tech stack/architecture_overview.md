# 🏗️ Architecture Overview - Tech Stack Ekosistem UMKM Bu Inem

Dokumen ini memetakan arsitektur teknologi berlapis (*layered enterprise architecture*) dari UMKM Bu Inem yang menghubungkan Frontend Next.js 16, Backend Spring Boot 3 Java 21, Database MariaDB/MySQL, serta Human Agent berbasis Groq LLaMA 3.3.

---

## 1. Arsitektur Berlapis (Tiered Architecture)

```mermaid
graph TB
    subgraph ClientTier["Klien & Antarmuka Pengguna (PWA / SPA)"]
        UI_Customer["Portal Web Publik & Katalog (/services, /order)"]
        UI_POS["Aplikasi Kasir POS Cepat (/pos)"]
        UI_Admin["CRM & Dashboard Admin (/dashboard, /leads)"]
        UI_Agent["Human Agent Circle Widget (Groq AI)"]
        SW["Service Worker (sw.js) & Local Cache PWA"]
    end

    subgraph APIGatewayTier["Keamanan & Router (Spring Security)"]
        SecFilter["JwtAuthenticationFilter & SecurityConfig"]
        CORS["CORS & Static Header Security"]
        RateLimit["Rate Limiter & Input Sanitizer"]
    end

    subgraph ServiceTier["Backend Application Layer (Spring Boot 3 - Java 21)"]
        Controller["REST Controllers (/api/v1/*)"]
        BusinessLogic["Service Layer: SaleService, OrderService, LeadService"]
        Validator["StockValidator & BusinessException Handlers"]
        AgentEngine["Human Agent Graph Reasoning Engine"]
    end

    subgraph DataTier["Penyimpanan & Data Layer"]
        DAO["DAO & JDBC PreparedStatements"]
        RDBMS[("MariaDB / MySQL 8.0 - Relational Data")]
        VectorStore[("Semantic Vector DB Ready - Embeddings")]
        LocalDB[("Browser IndexedDB & LocalStorage")]
    end

    subgraph ExternalServices["Layanan Pihak Ketiga"]
        GroqAPI["Groq Cloud API (LLaMA 3.3 70B Versatile)"]
        XenditQRIS["Xendit Payment Gateway (QRIS Dynamic)"]
        ThermalPrint["Web Bluetooth / ESC-POS 58mm Thermal Printer"]
    end

    ClientTier --> APIGatewayTier
    APIGatewayTier --> ServiceTier
    ServiceTier --> DataTier
    UI_Customer <--> SW
    SW <--> LocalDB
    AgentEngine <--> GroqAPI
    BusinessLogic <--> XenditQRIS
    UI_POS <--> ThermalPrint

    style ClientTier fill:#eff6ff,stroke:#3b82f6,stroke-width:2px;
    style ServiceTier fill:#ecfdf5,stroke:#10b981,stroke-width:2px;
    style DataTier fill:#fef3c7,stroke:#f59e0b,stroke-width:2px;
    style ExternalServices fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px;
```

---

## 2. Pola Komunikasi & Protokol

```mermaid
flowchart LR
    A[Browser Client] -- HTTP/2 + JSON (REST) --> B[Next.js App Router]
    B -- Server-Side Fetch & API Routes --> C[Spring Boot 3 API]
    C -- JDBC Connection Pool (HikariCP) --> D[(MySQL / MariaDB)]
    B -- HTTPS Streaming JSON --> E[Groq API Cloud]
    A -- Service Worker Fetch Intercept --> F[(Cache API & IndexedDB)]
```

---

## 3. Matriks Spesifikasi Teknis

| Komponen | Teknologi | Versi | Alasan Pemilihan |
| :--- | :--- | :--- | :--- |
| **Backend Core** | Spring Boot / Java | 3.3.4 / Java 21 LTS | Performa tinggi, eksekusi bare-metal efisien, ekosistem keamanan matang |
| **Frontend Core** | Next.js / React | 16.1.6 / React 19 | SSR/SSG untuk SEO publik, PWA capabilities, App Router cepat |
| **Styling** | Tailwind CSS | 4.x / Modern CSS | Utilitas responsif cepat, ukuran bundle minimal, desain konsisten |
| **Database** | MariaDB / MySQL | 10.11+ / 8.0+ | Integritas transaksi ACID, indexing B-Tree cepat, hemat memori UMKM |
| **LLM Inference** | Groq Cloud API | LLaMA 3.3 70B | Kecepatan respons ultra-rendah (<1.5 detik), biaya hemat, inferensi cerdas |
| **Printer POS** | ESC/POS ESC | 58mm Thermal | Standar nota struk kasir ritel murah, tahan lama tanpa tinta |
