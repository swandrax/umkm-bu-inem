# 🌐 Production Infrastructure - Infrastruktur Skalabel & Hemat Biaya

Dokumen ini mendokumentasikan spesifikasi infrastruktur server fisik/cloud yang dirancang efisien untuk skala UMKM dengan alokasi sumber daya optimal.

---

## 1. Topologi Infrastruktur Produksi

```mermaid
graph TD
    Internet([Trafik Internet Pelanggan & Kasir]) --> Cloudflare[Cloudflare DNS + CDN + DDoS Protection]
    Cloudflare -->|SSL Termination Port 443| NginxReverse[Nginx Reverse Proxy & HTTP Caching]
    
    subgraph ServerNode["Single-Node VPS (Ubuntu 22.04 LTS / 2 vCPU / 4 GB RAM)"]
        NginxReverse -->|Reverse Proxy :3000| NextApp[Frontend Next.js 16 Node Server]
        NginxReverse -->|Reverse Proxy :8080| JavaApp[Backend Spring Boot 3 / JVM 21]
        JavaApp -->|Socket / TCP :3306| MariaDB[(MariaDB 10.11 InnoDB Engine)]
        
        CronBackup[Cron Job Backup Harian 02:00] --> MariaDB
        CronBackup --> LocalArchive[(Folder Backup Internal /backup)]
        LocalArchive -.->|Encrypted Sync| S3Remote[(Cloud Object Storage S3)]
    end

    style Cloudflare fill:#fef3c7,stroke:#f59e0b;
    style ServerNode fill:#ecfdf5,stroke:#059669,stroke-width:2px;
```

---

## 2. Alokasi Sumber Daya Server (Resource Sizing)

| Layanan | CPU Allocation | RAM Limit | Disk Space | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Spring Boot 3 (JVM)** | 0.8 vCPU | 768 MB (`-Xmx512m`) | 200 MB (App JAR) | Heap size dibatasi agar tidak swap |
| **Next.js 16 (Node.js)** | 0.6 vCPU | 512 MB | 300 MB (Standalone) | SSR & Dynamic Route rendering |
| **MariaDB 10.11** | 0.5 vCPU | 512 MB buffer pool | 10 GB SSD | Penanganan transaksi hingga 100k data |
| **OS & Backup Temp** | 0.1 vCPU | 256 MB | 5 GB SSD | Logging rotasi dan file dump sementara |
| **Total Server Minimum** | **2 vCPU** | **2 GB - 4 GB** | **20 GB NVMe** | Biaya ~$5-$10/bulan (Sangat terjangkau UMKM) |
