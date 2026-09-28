# Order, Authoritative Calculation & Payment Flow

## 1. Authoritative Calculation Principle

To ensure financial integrity and prevent client-side manipulation of prices, discounts, or taxes, **all order totals are calculated exclusively by the backend `OrderService`**.

1. The client sends only the selected `serviceProductId` and `quantity`.
2. `OrderService` looks up active price points (`basePrice`, `finalPrice`) directly from the database snapshot.
3. System calculations:
   $$\text{Line Subtotal} = \text{basePrice} \times \text{quantity}$$
   $$\text{Line Discount} = \max(0, \text{basePrice} - \text{finalPrice}) \times \text{quantity}$$
   $$\text{Subtotal} = \sum \text{Line Subtotal}$$
   $$\text{Total Discount} = \sum \text{Line Discount}$$
   $$\text{Taxable Amount} = \max(0, \text{Subtotal} - \text{Total Discount})$$
   $$\text{Tax Amount} = \text{Round}\left(\text{Taxable Amount} \times \frac{\text{taxRate}}{100}, 2\right)$$
   $$\text{Grand Total} = \text{Taxable Amount} + \text{Tax Amount}$$

Client-submitted subtotals or totals are strictly disregarded.

---

## 2. End-to-End Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Public Customer / Client
    participant Frontend as Next.js Web App
    participant API as Order & Payment API
    participant OrderSvc as OrderService
    participant DB as MySQL Database
    actor Cashier as UMKM Cashier / Admin

    Note over Customer,DB: Phase 1: Order Placement & Server Authoritative Pricing
    Customer->>Frontend: Selects Service Packages & Fills Contact
    Frontend->>API: POST /api/v1/orders (itemIds, quantities, contact)
    API->>OrderSvc: createOrder(request)
    OrderSvc->>DB: Fetch Service Prices & Tax Settings
    OrderSvc->>OrderSvc: Compute Authoritative Subtotal, Discount, Tax
    OrderSvc->>DB: INSERT orders & order_items
    OrderSvc->>DB: INSERT crm_activities (ORDER_CREATED)
    OrderSvc-->>API: Return OrderDto (Status: WAITING_PAYMENT, UNPAID)
    API-->>Frontend: 201 Created (orderNumber)
    Frontend-->>Customer: Redirect to /payment/{orderNumber}

    alt Payment Method: QRIS Dummy Simulation
        Note over Customer,DB: Phase 2A: Interactive QRIS Test Mode
        Customer->>Frontend: Views Safe QR Code & Test Simulation Banner
        Customer->>Frontend: Clicks "Simulasikan Pembayaran Berhasil"
        Frontend->>API: POST /api/v1/orders/{orderNumber}/simulate-qris (action: SUCCESS)
        API->>OrderSvc: processDummyQrisSimulation("SUCCESS")
        OrderSvc->>DB: UPDATE orders (PAID, QRIS_DUMMY, PROCESSING)
        OrderSvc->>DB: INSERT receipts (ORDER:{orderNumber}, is_qris_dummy=true)
        OrderSvc->>DB: INSERT crm_activities (PAYMENT_CONFIRMED)
        OrderSvc-->>Frontend: 200 OK (PaymentProofDto)
        Frontend-->>Customer: Redirect to /receipt/{orderNumber}
    else Payment Method: Cash with Change Calculation
        Note over Customer,DB: Phase 2B: Cash Payment at Store / POS
        Customer->>Cashier: Pays Cash (e.g., Rp 150,000 for Rp 100,000 order)
        Cashier->>Frontend: Enters Amount Received into Cash Calculator
        Frontend->>API: POST /api/v1/orders/{orderNumber}/pay-cash (amountReceived)
        API->>OrderSvc: processCashPayment(amountReceived)
        OrderSvc->>OrderSvc: Verify amountReceived >= totalAmount
        OrderSvc->>OrderSvc: changeAmount = amountReceived - totalAmount
        OrderSvc->>DB: UPDATE orders (PAID, CASH, PROCESSING)
        OrderSvc->>DB: INSERT receipts (amountDue, amountReceived, changeAmount)
        OrderSvc->>DB: INSERT crm_activities (PAYMENT_CONFIRMED)
        OrderSvc-->>Frontend: 200 OK (PaymentProofDto with changeAmount)
        Frontend-->>Cashier: Display Change Due & Print Thermal Struk
    end

    Note over Customer,DB: Phase 3: Receipt Generation & Real-Time Tracking
    Customer->>Frontend: Visits /order/{orderNumber} (Auto-polling status)
    Frontend->>Customer: Displays Completed Timeline & Printable Thermal Struk
```

---

## 3. Receipt & Barcode Specification

Receipts comply with standard 58mm POS thermal printers as well as responsive web layouts:
- **Receipt Header**: Dynamic store name, address, phone, and CS email from `business_settings`.
- **Order Barcode**: Clean SVG Code 128 barcode rendering payload format `ORDER:{orderNumber}`.
- **Cash Line**: Explicitly breaks down Total Tagihan, Uang Diterima, and Kembalian.
- **QRIS Notice**: If paid via dummy QRIS, displays an explicit banner: `QRIS DEMO / TEST PAYMENT - BUKAN TRANSAKSI PERBANKAN NYATA`.
- **Footer**: Dynamic thank you message from settings.
