# 🧠 Migrasi ke Semantic Vector Database - Roadmap & Arsitektur

Dokumen ini menguraikan peta jalan transisi dari pencarian kata kunci berbasis SQL `LIKE %keyword%` menuju pencarian semantik vektor (*Vector Semantic Search*) menggunakan pgvector, Qdrant, atau ChromaDB untuk katalog jajanan dan Human Agent Bu Inem.

---

## 1. Arsitektur Hybrid: SQL Keyword + Vector Search

```mermaid
graph TD
    Query["Pertanyaan / Kata Kunci Pengguna: 'Kue yang cocok buat arisan ibu-ibu rasa gurih'"]
    
    subgraph TraditionalSearch["Pencarian Tradisional (SQL LIKE / FullText)"]
        SQL["SELECT * FROM products WHERE name LIKE '%arisan%' OR name LIKE '%gurih%'"]
        SQLResult["Hasil: Kosong / Sedikit (Karena nama kue: 'Lemper Ayam Spesial')"]
    end

    subgraph SemanticSearch["Pencarian Semantik (Vector Embeddings)"]
        EmbeddingModel["Text-Embedding Model (e.g. text-embedding-3-small)"]
        VectorDB[("Vector DB: pgvector / Qdrant")]
        CosineSim["Cosine Similarity Search: Jarak Vektor Terdekat"]
        VectorResult["Hasil Cerdas: Lemper Ayam, Pastel Isi Sayur, Risol Mayo"]
    end

    Query --> TraditionalSearch
    Query --> SemanticSearch
    EmbeddingModel --> VectorDB
    VectorDB --> CosineSim
    CosineSim --> VectorResult

    subgraph HybridReranker["Penggabungan & Reranking"]
        Combine["Reciprocal Rank Fusion (RRF)"]
        FinalList["Daftar Rekomendasi Menu Paling Relevan"]
    end

    SQLResult --> Combine
    VectorResult --> Combine
    Combine --> FinalList

    style TraditionalSearch fill:#fee2e2,stroke:#ef4444;
    style SemanticSearch fill:#ecfdf5,stroke:#10b981;
    style HybridReranker fill:#fef3c7,stroke:#f59e0b;
```

---

## 2. Struktur Data Embedding Produk

```json
{
  "product_id": 1,
  "name": "Lemper Ayam Spesial",
  "category": "Snack Tradisional",
  "flavor_profile": ["gurih", "asin", "santan gurih", "aroma daun pisang"],
  "event_suitability": ["arisan", "hajatan", "rapat kantor", "snack box"],
  "price": 3500,
  "vector_embedding": [0.0124, -0.0452, 0.0891, "...(1536 dimensi)..."]
}
```

---

## 3. Tahapan Implementasi Migrasi Vektor

1. **Fase 1 (Current)**: Pencarian frontend memfilter data produk lokal di sisi klien dengan pagination cepat dan search keyword.
2. **Fase 2 (Hybrid Sync)**: Saat produk ditambahkan atau diubah di backend, event listener mengirim ringkasan teks produk ke model embedding dan menyimpan vektor ke koleksi vector database.
3. **Fase 3 (Agent Grounding)**: Human Agent Bu Inem menanyakan vector database untuk rekomendasi menu berdasarkan konteks emosional dan anggaran pelanggan.
