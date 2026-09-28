# ⚡ Frontend Tech Stack - Next.js 16 & Progressive Web App (PWA)

Dokumen ini mendokumentasikan arsitektur frontend modern menggunakan Next.js 16 (App Router), Zustand untuk manajemen state kasir, TanStack Query untuk caching data server, serta Service Worker untuk kemampuan PWA offline-first.

---

## 1. Arsitektur State & Alur Rendering Frontend

```mermaid
graph TD
    subgraph UIComponents["Komponen Antarmuka Pengguna"]
        Navbar["AppShell & Navbars"]
        POSCart["POS Cart & Quick Barcode Grid"]
        PublicCatalog["Portal Jajanan & Katalog Layanan"]
        ReceiptModal["Thermal Receipt 58mm Modal"]
        AgentWidget["Human Agent Floating Circle Button"]
    end

    subgraph StateManagement["Manajemen State & Cache"]
        CartStore["Zustand cart.store (Local Persist)"]
        AuthStore["Zustand auth.store (Token & Role)"]
        QueryCache["TanStack Query (Stale-While-Revalidate)"]
    end

    subgraph OfflineCapability["PWA & Penyimpanan Browser"]
        SW["Service Worker (sw.js)"]
        LocalCache["CacheStorage (Static Assets & Shell)"]
        IndexedDBStore["IndexedDB (Offline Transactions)"]
    end

    POSCart <--> CartStore
    Navbar <--> AuthStore
    PublicCatalog <--> QueryCache
    AgentWidget <--> QueryCache
    QueryCache <--> SW
    SW <--> LocalCache
    CartStore <--> IndexedDBStore

    style UIComponents fill:#eff6ff,stroke:#2563eb,stroke-width:2px;
    style StateManagement fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    style OfflineCapability fill:#ecfdf5,stroke:#059669,stroke-width:2px;
```

---

## 2. Fitur Unggulan Frontend

1. **Next.js 16 App Router & Server Components**:
   - SEO-friendly untuk halaman publik (`/`, `/services`, `/about`, `/faq`, `/pricing`).
   - Client Component interaktif untuk kasir cepat (`/pos`) dan formulir checkout order (`/order`).

2. **Progressive Web App (PWA) Siap Pasang**:
   - Disertai file `manifest.ts` dan service worker `sw.js`.
   - Dapat di-install di smartphone kasir Android/iOS dan tablet POS tanpa melalui Play Store (*standalone app*).

3. **Cetak Struk Termal 58mm Ramah Kertas**:
   - Mendukung format lebar 58mm standar kasir UMKM.
   - Pratinjau langsung, dialog print browser dengan CSS `@media print` tanpa header/footer browser.
