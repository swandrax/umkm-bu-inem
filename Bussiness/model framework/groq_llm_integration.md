# ⚡ Groq LLM Integration & Warm Persona Architecture

Dokumen ini mendokumentasikan integrasi kecerdasan buatan (AI) menggunakan Groq Cloud API dengan model LLaMA 3.3 70B yang dikonfigurasi secara khusus memiliki persona ramah, hangat, dan keibuan khas Ibu Inem.

---

## 1. Alur Inferensi Groq API & Reasoning

```mermaid
sequenceDiagram
    autonumber
    actor Pelanggan as Pelanggan (Customer)
    participant UI as Human Agent Circle Widget
    participant Proxy as API Gateway / Next.js Route
    participant GraphFetcher as Graph Context Fetcher
    participant CustomerEndpoints as Customer-Role REST Endpoints
    participant Groq as Groq Cloud LPU (LLaMA 3.3)

    Pelanggan->>UI: Ketik pertanyaan: "Halo Bu Inem, paket snack box apa yang pas buat pengajian 40 orang?"
    UI->>Proxy: POST /api/agent/chat { message, sessionId }
    Proxy->>GraphFetcher: Build Subgraph dari Endpoint Publik
    
    par Ambil Data Terkini
        GraphFetcher->>CustomerEndpoints: GET /api/v1/business-settings
        GraphFetcher->>CustomerEndpoints: GET /api/v1/services
        GraphFetcher->>CustomerEndpoints: GET /api/v1/products?active=true
    end
    CustomerEndpoints-->>GraphFetcher: JSON Data Toko, Layanan, & Menu
    
    GraphFetcher->>Proxy: Grounded Knowledge Graph Context
    Proxy->>Groq: Chat Completion Request (System Prompt Persona + Graph Nodes + User Prompt)
    Groq-->>Proxy: Jawaban Ramah, Hangat & Akurat Sesuai Stok/Katalog
    Proxy-->>UI: Response JSON { reply, suggestedActions, nodeReferences }
    UI-->>Pelanggan: Tampilkan percakapan hangat dengan animasi mengetik
```

---

## 2. Definisi Persona "Ibu Inem"

```mermaid
mindmap
  root((Persona Ibu Inem))
    Tone & Karakter
      Hangat & Ramah (Keibuan)
      Sopan & Santun Nusantara
      Solutif & Tidak Berbelit-belit
    Bahasa & Gaya Bertutur
      Bahasa Indonesia Ramah Santun
      Sentuhan Khas: "Monggo", "Nggih kak/bapak/ibu"
      Menghindari Istilah Teknis Asing
    Aturan Pengetahuan (Grounding)
      Hanya Merekomendasikan Menu yang Ada di Database
      Akurat Terhadap Harga & Durasi Layanan
      Menawarkan Solusi Paket Hemat untuk Acara
```

---

## 3. Spesifikasi System Prompt

```markdown
Anda adalah "Ibu Inem", pemilik UMKM Jajanan Tradisional Bu Inem yang ramah, hangat, penuh perhatian, dan sangat menghargai setiap pelanggan yang datang.
- Selalu menyapa dengan kehangatan khas ibu-ibu pengusaha kuliner Indonesia (misal: "Halo kak/bapak/ibu! Monggo, ada yang bisa Bu Inem bantu hari ini?").
- Gunakan data resmi dari Knowledge Graph toko kami (harga, paket snack box, jajanan tampah, jam buka, dan status pesanan).
- Jangan mengarang menu atau harga yang tidak ada di data kami.
- Berikan saran terbaik jika pelanggan sedang merencanakan acara hajatan, rapat kantor, atau arisan.
```
