# 🤖 Human Agent Interface Design - Widget Lingkaran Kanan Bawah

Dokumen ini mendefinisikan rancangan antarmuka komponen **Human Agent Floating Circle Button** yang terletak di pojok kanan bawah aplikasi untuk melayani pelanggan secara interaktif, ramah, dan solutif.

---

## 1. Tata Letak & Anatomi Komponen Widget

```mermaid
graph TD
    subgraph FloatingButton["Tombol Lingkaran Mengapung (Bottom-Right)"]
        Icon["Avatar Ramah Bu Inem (Wajah Tersenyum Tradisional)"]
        Badge["Indikator Hijau Aktif / Online Pulse"]
        Tooltip["Tooltip Mengambang: 'Tanya Bu Inem (Asisten Ramah 24/7)'"]
    end

    subgraph ChatDrawer["Jendela Percakapan Interaktif (Drawer / Modal)"]
        Header["Header: Foto Bu Inem, Status 'Aktif & Ramah', Tombol Tutup & Reset"]
        ChipList["Daftar Pertanyaan Cepat: Menu Terlaris, Paket Acara, Cek Resi"]
        MessageList["Gelembung Pesan: Pelanggan (Kanan) & Bu Inem (Kiri)"]
        CardPreview["Kartu Pratinjau Produk / Status Order di Dalam Chat"]
        InputBar["Bilah Input Pesan + Tombol Kirim + Status Mengetik"]
    end

    FloatingButton -- "Klik / Ketuk" --> ChatDrawer
```

---

## 2. Diagram State Interaksi Widget

```mermaid
stateDiagram-v2
    [*] --> Minimized: Pengunjung Masuk Halaman
    Minimized --> Bouncing: Notifikasi Sambutan Hangat Muncul (Setelah 3s)
    Bouncing --> Minimized: Pengguna Mengabaikan
    Minimized --> OpenChat: Pengguna Mengklik Tombol Lingkaran
    
    state OpenChat {
        [*] --> IdleReady: Tampilkan Salam Pembuka Hangat Bu Inem
        IdleReady --> FetchingGraph: Pengguna Mengirim Pesan
        FetchingGraph --> GeneratingGroq: Data Graph Endpoint Pelanggan Terkumpul
        GeneratingGroq --> DisplayAnswer: Tampilkan Jawaban Ramah + Kartu Rekomendasi
        DisplayAnswer --> IdleReady: Menunggu Pertanyaan Berikutnya
    }

    OpenChat --> Minimized: Pengguna Klik Tombol Minimalkan / Luar Modal
```

---

## 3. Spesifikasi CSS & Aksesibilitas

- **Posisi Layar**: `fixed bottom-6 right-6 z-50`
- **Ukuran Tombol**: `w-14 h-14 sm:w-16 sm:h-16` (Memenuhi standar touch minimum 48px WCAG 2.1 AA).
- **Efek Visual**: `shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all duration-300 ring-4 ring-amber-400/40`.
- **Dukungan Aksesibilitas**: `aria-label="Buka Chat Asisten Bu Inem"`, `role="dialog"`, dan dukungan penutupan dengan tombol keyboard `Escape`.
