# 🔄 Agent Learning Pipeline - Pembelajaran Mandiri dari API Endpoint

Dokumen ini mendokumentasikan pipeline pembelajaran adaptif (*adaptive learning & synchronization*) Human Agent Bu Inem yang secara dinamis menyegarkan konteks pengetahuannya setiap kali ada pembaruan produk, perubahan harga, atau pergantian status pesanan.

---

## 1. Siklus Pembelajaran & Refresh Pengetahuan

```mermaid
stateDiagram-v2
    [*] --> IdleCache: Konteks Graf Tersedia di Memori Sesi
    IdleCache --> RequestReceived: Pesan Pelanggan Masuk
    
    state RequestReceived {
        [*] --> CheckIntent: Deteksi Niat (Katalog, Harga, Status Order, Info Toko)
        CheckIntent --> FetchDelta: Tarik Endpoint Sesuai Niat
        FetchDelta --> ReconstructGraph: Perbarui Node Graf di Memori
        ReconstructGraph --> GroundPrompt: Injeksi Graf ke Prompt Groq
    }

    RequestReceived --> GroqInference: Kirim Konteks Terkini
    GroqInference --> DeliverResponse: Jawaban Ramah Tersaji
    DeliverResponse --> IdleCache: Tunggu Interaksi Lanjutan
```

---

## 2. Pola Penanganan Kegagalan (Graceful Degradation)

```mermaid
flowchart TD
    Start[User Query Datang] --> CheckGroq{Apakah API Groq Terhubung & Tersedia?}
    
    CheckGroq -- Ya --> GroqEngine[Panggil Groq LLaMA 3.3 dengan Persona Bu Inem + Graph Nodes]
    GroqEngine --> OutputAI[Respon AI Cerdas Ramah]
    
    CheckGroq -- Tidak / Error / Quota Habis --> FallbackGraph[Aktifkan Local Graph Traversal Engine]
    FallbackGraph --> RuleMatch[Pencocokan Node Graf: Cari Kategori, Harga, Rekomendasi Menu]
    RuleMatch --> OutputLocal[Respon Template Ramah Khas Bu Inem Berbasis Graf Langsung]
    
    OutputAI --> Selesai[Kirim ke Layar Chat Pelanggan]
    OutputLocal --> Selesai
```

---

## 3. Batasan Keamanan Peran Pelanggan (Customer Role Guardrails)

- **Strict Customer Role Scope**: Agen HANYA menarik data dari endpoint yang diizinkan untuk peran publik/pelanggan (`business-settings`, `services`, `products`, `orders/{num}/status`).
- **No Internal Leaks**: Agen secara ketat dilarang meminta atau memaparkan informasi sensitif internal seperti `users`, password hash, laporan laba rugi admin, atau data kredensial pembayaran.
