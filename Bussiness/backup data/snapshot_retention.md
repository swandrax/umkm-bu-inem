# 📅 Snapshot Retention Policy - Kebijakan Retensi Arsip Data

Dokumen ini mendefinisikan jadwal rotasi dan retensi arsip snapshot data (*Grandfather-Father-Son rotation*) agar ruang penyimpanan disk server tetap optimal dan terkendali.

---

## 1. Siklus Rotasi Retensi (GFS Retention Scheme)

```mermaid
graph TD
    Daily["Harian (Son): Disimpan selama 7 Hari Terakhir"]
    Weekly["Mingguan (Father): Disimpan Setiap Minggu (4 Minggu Terakhir)"]
    Monthly["Bulanan (Grandfather): Disimpan Setiap Akhir Bulan (12 Bulan)"]
    Yearly["Tahunan: Arsip Penutupan Buku Akhir Tahun (Disimpan Permanen)"]

    Daily -->|Ditingkatkan jika hari Minggu| Weekly
    Weekly -->|Ditingkatkan jika akhir bulan| Monthly
    Monthly -->|Ditingkatkan jika akhir tahun| Yearly

    style Daily fill:#eff6ff,stroke:#3b82f6;
    style Weekly fill:#ecfdf5,stroke:#10b981;
    style Monthly fill:#fef3c7,stroke:#d97706;
    style Yearly fill:#f5f3ff,stroke:#7c3aed;
```

---

## 2. Aturan Pembersihan Disk Otomatis

Script pembersih disk dijalankan berkala untuk menghapus file snapshot yang telah melewati batas kedaluwarsa:
```bash
# Hapus backup harian yang berumur lebih dari 7 hari
find /backup/daily -type f -name "*.sql.gz" -mtime +7 -delete

# Hapus backup mingguan yang berumur lebih dari 30 hari
find /backup/weekly -type f -name "*.sql.gz" -mtime +30 -delete
```
