# 🎨 UI/UX Design System - Identitas Visual UMKM Bu Inem

Dokumen ini mendokumentasikan panduan identitas visual, palet warna, tipografi, dan komponen antarmuka yang mencerminkan kearifan lokal kuliner nusantara yang higienis, hangat, dan modern.

---

## 1. Palet Warna & Filosofi Estetika

```mermaid
graph LR
    subgraph PrimaryColor["Warna Utama: Warm Amber (#f59e0b)"]
        P1["Melambangkan kehangatan jajanan gorengan & kue tradisional yang baru matang"]
    end
    subgraph SecondaryColor["Warna Aksen: Traditional Emerald (#059669)"]
        S1["Melambangkan daun pisang segar pembungkus lemper & kue basah alami"]
    end
    subgraph NeutralColor["Warna Dasar: Warm Stone (#faf9f5 & #292524)"]
        N1["Tekstur kertas kraft bungkus makanan dan kenyamanan visual layar"]
    end

    style PrimaryColor fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    style SecondaryColor fill:#ecfdf5,stroke:#059669,stroke-width:2px;
    style NeutralColor fill:#f5f5f4,stroke:#78716c,stroke-width:2px;
```

---

## 2. Tipografi & Hierarki Visual

1. **Heading & Display**: Font `Geist Sans` dan varian bobot 700/800 untuk judul yang tegas dan mudah terbaca kasir dalam jarak pandang 50 cm.
2. **Body & Angka Transaksi**: Tabular numbers dan `Geist Mono` untuk label harga, kuantitas item, serta total nominal Rupiah guna mencegah kesalahan hitung kasir.

---

## 3. Desain Komponen Kasir POS & Portal Publik

```mermaid
flowchart TD
    subgraph PosDesign["Prinsip Desain Kasir POS"]
        P_Touch["Tombol Besar Touch-Friendly (Min 48px)"]
        P_Speed["Pencarian Produk Instan (< 100ms)"]
        P_Cart["Keranjang Belanja Mengapung Selalu Terlihat"]
    end

    subgraph PublicDesign["Prinsip Desain Portal Publik"]
        W_Hero["Banner Visual Hangat & Menggugah Selera"]
        W_Agent["Tombol Lingkaran Human Agent Selalu Siap di Kanan Bawah"]
        W_Order["Formulir Pesanan 1 Halaman Tanpa Registrasi Rumit"]
    end
```
