# Legacy POS Backward Compatibility & Non-Destructive Evolution

## 1. Non-Destructive Policy

In accordance with strict system constraints, the legacy desktop POS system was **not deleted or destructively rewritten**. Instead:
- All legacy database tables (`categories`, `products`, `sales`, `sale_details`, `payments`, `shippings`, `users`, `audit_logs`) remain intact.
- Existing Spring Boot endpoints (`/api/v1/sales`, `/api/v1/products`, `/api/v1/categories`, `/api/v1/payments`, `/api/v1/reports`) remain fully functional.
- The `/pos` route in the frontend is preserved, with a clear contextual notice banner guiding operators to the unified CRM & Order platform when relevant.

---

## 2. Coexistence Matrix

| Layer / Feature | Legacy POS Cashier Subsystem | Modern UMKM Digital & CRM Platform |
|---|---|---|
| **Primary Audience** | Offline Cashier / In-Store Staff | Public Inbound Visitors, Online Customers, Sales Reps, Management |
| **Data Scope** | Food & Snack Products (Jajanan Pasar) | Service Packages (Website, CRM, QRIS, Digital Marketing) + Retail Items |
| **Navigation Status** | Deprecated from primary sidebar; accessible at `/pos` | Primary top-level navigation (Dashboard, Pesanan, Pelanggan, Prospek, Aktivitas, Pengaturan) |
| **Cart & Calculations** | In-store instant cart with barcode scanner input | Multi-step booking checkout with server-authoritative calculations |
| **Payment Handling** | Cash & Card manual entry | Cash (with automated change calculation) & QRIS Demo simulator |
| **Receipt Output** | In-browser popup receipt modal | 58mm Thermal Printable Layout + SVG Barcode (`ORDER:{orderNumber}`) + Real-time tracking link |
| **Customer Retention** | Basic phone/name directory | Full Kanban Sales Pipeline, Stage Transitions, Lead-to-Customer conversion, Audit Activities |

---

## 3. Database Migration Compatibility (`db/migration/`)

All new schemas were applied strictly through additive migrations:
- `V1__init.sql` - `V4__shipping_module.sql`: Original legacy tables.
- `V5__business_settings_and_crm_leads.sql`: Added `business_settings` and `leads`. Non-destructively added `company`, `address`, `status`, `notes`, `source`, `total_spent` to `customers`.
- `V6__service_products.sql`: Added `service_products` with foreign key linking optionally to `categories`.
- `V7__orders_and_order_items.sql`: Added `orders` and `order_items` independent of `sales`.
- `V8__crm_activities_and_receipts.sql`: Added `crm_activities` and persistent `receipts`.

No `DROP TABLE`, `ALTER TABLE ... DROP COLUMN`, or data-destructive DDL statements were executed.
