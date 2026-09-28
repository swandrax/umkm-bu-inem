# 🗺️ Customer Journey Map - Pengalaman Pelanggan

Dokumen ini memetakan peta perjalanan pelanggan (*Customer Journey Map*) mulai dari pencarian jajanan, konsultasi dengan Human Agent Bu Inem, pemesanan, pembayaran QRIS, hingga penerimaan pesanan.

---

## 1. Peta Perjalanan Pelanggan (Customer Journey)

```mermaid
journey
    title Perjalanan Pelanggan Memesan Paket Jajanan Bu Inem
    section Penemuan (Discovery)
      Melihat website Bu Inem di smartphone: 5: Pelanggan
      Membaca katalog kue & harga snack box: 4: Pelanggan
    section Konsultasi (Consultation)
      Klik Tombol Lingkaran Human Agent di Kanan Bawah: 5: Pelanggan
      Tanya menu rekomendasi & porsi untuk 50 tamu: 5: Pelanggan, Human Agent
      Mendapat respon ramah hangat & rincian paket: 5: Pelanggan, Human Agent
    section Pemesanan & Pembayaran (Checkout)
      Memilih paket & tanggal pengiriman acara: 4: Pelanggan
      Scan QRIS dinamis di layar: 5: Pelanggan
      Pembayaran terverifikasi otomatis: 5: Pelanggan, Sistem
    section Pengiriman & Pasca-Jual (Fulfillment)
      Menerima notifikasi status pesanan: 4: Pelanggan
      Pesanan tiba tepat waktu, hangat dan lezat: 5: Pelanggan
      Menerima struk termal 58mm & ucapan terima kasih: 5: Pelanggan
```

---

## 2. Touchpoint & Emosi Pengguna

```mermaid
graph TD
    A[Titik Masuk Web Publik] -->|Rasa Ingin Tahu| B[Katalog Layanan & Produk]
    B -->|Butuh Bantuan & Rekomendasi| C[Tombol Human Agent Melayang]
    C -->|Rasa Tenang & Nyaman Dilayani Ramah| D[Rekomendasi Paket Disepakati]
    D -->|Mudah & Tanpa Ribet| E[Checkout & QRIS Instan]
    E -->|Percaya & Puas| F[Struk Digital / Fisik Terbit]
```
