# 💾 Automated Backup Strategy - Strategi Pencadangan Otomatis

Dokumen ini mendokumentasikan prosedur pencadangan otomatis (*automated backup*) database transaksi dan aset sistem UMKM Bu Inem untuk mencegah kehilangan data berharga.

---

## 1. Topologi & Alur Backup Otomatis

```mermaid
sequenceDiagram
    autonumber
    participant Cron as Linux Crontab / Task Scheduler
    participant Script as Script backup.sh / backup.bat
    participant DB as MariaDB / MySQL Database
    participant Disk as Internal Storage (/var/backups)
    participant Cloud as Remote S3 / Google Drive Backup

    Cron->>Script: Eksekusi Harian Setiap Pukul 02:00 WIB
    Script->>DB: Jalankan mysqldump --single-transaction --quick
    DB-->>Script: Data SQL Dump Lengkap
    Script->>Script: Kompresi Gzip (tar.gz) + Enkripsi AES-256
    Script->>Disk: Simpan Arsip Lokal (Retensi 7 Hari)
    Script->>Cloud: Unggah Snapshot Terenkripsi ke Cloud Storage
    Cloud-->>Script: Verifikasi MD5 / Checksum Berhasil
    Script-->>Cron: Catat Status Sukses di Audit Log
```

---

## 2. Parameter Perintah Backup Aman

```bash
mysqldump -u ${DB_USER} -p${DB_PASSWORD} \
  --host=${DB_HOST} \
  --port=${DB_PORT} \
  --single-transaction \
  --quick \
  --lock-tables=false \
  --routines \
  --triggers \
  ${DB_NAME} | gzip -9 > /backup/pos_bu_inem_$(date +%Y%m%d_%H%M%S).sql.gz
```

Klausa `--single-transaction` memastikan operasional kasir tidak terkunci (*no lock*) saat proses pencadangan berlangsung di latar belakang.
