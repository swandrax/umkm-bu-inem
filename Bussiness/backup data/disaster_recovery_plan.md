# 🚨 Disaster Recovery Plan (DRP) - Rencana Pemulihan Bencana

Dokumen ini menguraikan prosedur pemulihan sistem jika terjadi insiden kegagalan perangkat keras server, korupsi data, atau kehilangan akses.

---

## 1. Alur Pemulihan Bencana (Disaster Recovery Workflow)

```mermaid
flowchart TD
    Incident([Insiden Terjadi: Server Crash / Data Corrupt]) --> Triage[Identifikasi Dampak & Sumber Kerusakan]
    Triage --> PrepareEnv[Siapkan Instance Server Baru / Docker Bersih]
    PrepareEnv --> FetchBackup[Ambil Snapshot Backup Terakhir yang Terverifikasi]
    FetchBackup --> CheckIntegrity{Uji Checksum SHA-256}
    
    CheckIntegrity -- Valid --> RestoreDB[Eksekusi Restore Database: gunzip < backup.sql.gz | mysql]
    CheckIntegrity -- Rusak --> FetchOlder[Ambil Backup H-1 Hari Sebelumnya]
    FetchOlder --> CheckIntegrity
    
    RestoreDB --> StartServices[Nyalakan Kontainer Spring Boot & Next.js]
    StartServices --> SanityCheck[Uji Login Kasir & Cek Konsistensi Saldo]
    SanityCheck --> ReconnectDNS[Arahkan DNS Domain ke Server Baru]
    ReconnectDNS --> Normal([Sistem Kembali Beroperasi Normal])

    style Incident fill:#fee2e2,stroke:#ef4444;
    style RestoreDB fill:#fef3c7,stroke:#f59e0b;
    style Normal fill:#ecfdf5,stroke:#10b981;
```

---

## 2. Metrik Sasaran Pemulihan (RTO & RPO)

| Metrik Pemulihan | Target | Tindakan Nyata |
| :--- | :--- | :--- |
| **Recovery Time Objective (RTO)** | < 30 Menit | Kontainerisasi Docker memungkinkan deployment ulang 1 perintah |
| **Recovery Point Objective (RPO)** | < 24 Jam (Atau realtime dengan binlog) | Backup terjadwal harian + replikasi transaksi offline di browser kasir |
