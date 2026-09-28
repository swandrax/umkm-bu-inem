# 🛡️ Legacy Coexistence - Panduan Menjaga Integritas Kode Warisan

Dokumen ini menjabarkan aturan ketat isolasi sistem warisan (*legacy system isolation*) agar penambahan fitur modern (CRM, Public Commerce, Human Agent AI) tidak mengganggu modul kasir POS dasar yang telah stabil.

---

## 1. Pola Strangler Fig Pattern

```mermaid
graph TD
    subgraph LegacyBoundary["Zona Terlindungi: Core POS Legacy (TIDAK BOLEH DIUBAH)"]
        L_SaleDAO["SaleDAO & SaleItemDAO"]
        L_ProductDAO["ProductDAO & CategoryDAO"]
        L_PosCart["Kasir POS Cepat & Quick Checkout"]
        L_LegacySchema["Tabel: users, products, categories, sales, sale_items"]
    end

    subgraph ModernBoundary["Zona Ekstensi: Fitur Modern & CRM"]
        M_ServiceDAO["ServiceProductDAO & OrderDAO"]
        M_LeadDAO["LeadDAO & BusinessSettingDAO"]
        M_HumanAgent["Human Agent AI & Graph Fetcher"]
        M_PublicWeb["Portal Web, Checkout Online, Struk 58mm"]
    end

    ModernBoundary -.->|Hanya Membaca Melalui Interface Aman| LegacyBoundary
    LegacyBoundary -.->|Tidak Terikat Logika Baru| ModernBoundary

    style LegacyBoundary fill:#fef3c7,stroke:#d97706,stroke-width:3px;
    style ModernBoundary fill:#ecfdf5,stroke:#059669,stroke-width:2px;
```

---

## 2. Prinsip Rekayasa Perangkat Lunak

1. **Anti-Corruption Layer (ACL)**: Setiap konversi data antara format lama dan format baru dilakukan melalui DTO Mapper murni (`ProductMapper`, `OrderMapper`).
2. **Backward Compatibility Testing**: Setiap perubahan diverifikasi dengan test suite komprehensif (`mvn test`) untuk memastikan tidak ada regresi pada fungsionalitas lama.
3. **No Breaking Schema**: Tidak mengubah tipe data, constraint, atau nama kolom pada tabel legacy `sales` dan `products`.
