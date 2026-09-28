# Code Optimization & Architecture Baseline Report
**Project:** UMKM Bu Inem Digital Platform Transformation  
**Date:** September 2026  
**Environment:** Java 21 LTS + Spring Boot 3.4.x / Next.js 16.3.4 (Turbopack) + React 19.2.8 + TypeScript 5 + Tailwind CSS v4  
**Git Branch:** `development/crm-marketing-refactor`

---

## 1. Executive Summary & Objective

This document captures the rigorous baseline measurements of the legacy "Jajanan Ibu Inem POS" codebase before initiating the non-destructive transformation into the modern **UMKM Digital Business, CRM, Marketing, and Service Commerce Platform**.

As mandated by Section 28 of the technical specification:
- Baseline metrics are measured from actual repository scans, compile runs, lint output, and code inspections.
- No fabricated figures or artificial "67% targets" are assumed without direct measurement.
- The 67% code optimization target will be measured across concrete refactored and new modules (reusability, deduplication of business logic, round-trip efficiency, cache utilization, and state centralization) without destroying legacy compatibility code.

---

## 2. Quantitative Baseline Measurements

| Metric Area | Baseline Measurement | Observation / Source |
|---|---|---|
| **Backend Test Coverage** | 2 test classes, 6 unit tests | `ProductMapperTest` (2 tests), `StockValidatorTest` (4 tests). Zero integration tests for Order, Dummy QRIS, Cash validation, or CRM workflows. |
| **Backend Build Status** | `./mvnw.cmd test-compile` & `test`: SUCCESS | Total compile: 97 source files, execution time ~11.1s. 0 compilation failures. |
| **Backend Warnings** | 2 JVM reflection/deprecated warnings | Sun Unsafe & Jansi loader native access warnings on Java 21 runtime. |
| **Frontend Dependency Audit** | 377 packages, 0 vulnerabilities | Verified via `npm audit --omit=dev --audit-level=high`. |
| **Frontend Lint Status** | ESLint 9 + Next.js config: 0 errors | Clean baseline lint run. |
| **Frontend Build Time** | Turbopack compile: 19.2s | Total Next.js static page generation: 17 routes in 1022ms. |
| **Active Routes Count** | 17 routes (100% internal/POS focused) | `/`, `/categories`, `/customers`, `/dashboard`, `/login`, `/payments`, `/pos`, `/products`, `/reports`, `/sales-history`, `/settings`, `/shipping`, `/transactions`, `/users`, `/_not-found`. |
| **Public Marketing Routes** | 0 routes | No public `/`, `/services`, `/about`, `/portfolio`, `/pricing`, `/contact`, `/order`, `/payment/[id]`, or `/receipt/[id]`. |
| **Authentication Bottleneck** | 100% of routes guarded | `AppShell.tsx` redirects all unauthenticated visitors directly to `/login`, preventing public customer visits. |
| **Business Settings** | 0 database-driven settings | Hardcoded strings in `ThermalReceiptModal.tsx` ("Jl. Malioboro No. 45", "0812-3456-7890") and `AppShell.tsx`. |

---

## 3. Code Duplication, Redundancy, & Hotspot Analysis

### 3.1 Repeated Business Calculations & Formatting
- **Money formatting (`formatRupiah`)**: Re-declared or inconsistently applied across multiple pages and modals instead of a single immutable utility contract.
- **Discount & Tax Calculation**: Cart calculations in `cart.store.ts` calculate tax and discount client-side; `SaleService.java` re-calculates server-side with hardcoded logic. No reusable Discount Engine entity or service existed.
- **Receipt Rendering Logic**: Modal rendering in `ThermalReceiptModal.tsx` contains duplicated inline layout logic for cash vs non-cash, store metadata, and date parsing.

### 3.2 Unnecessary API Calls & Query Cache Redundancy
- **Separate Customer & Category Queries**: On multiple pages (`pos`, `transactions`, `customers`), customer and category datasets are fetched without stale-time configuration, triggering repetitive refetches on tab changes.
- **Missing Selective Payloads**: `CustomerDAO.getAll()` and `ProductDAO.getAll()` fetch full records including heavy text columns regardless of UI view requirements.

### 3.3 State & Navigation Anti-Patterns
- **POS Centric Navigation**: `NAV_ITEMS` in `Sidebar.tsx` positions `Kasir (POS)` as Item #1 with `/pos` as default landing page upon authentication.
- **Client-Side Auth Barrier**: Root `/` simply evaluates `isAuthenticated` and pushes `/dashboard` or `/login`. No public showcase or visitor landing page exists.

### 3.4 Cyclomatic Complexity Hotspots
1. `SaleService.checkout()`: Single 270-line method performing 13 distinct procedural steps (validation, stock checks, calculation, multiple DAO inserts).
2. `PosPage.tsx`: 402 lines handling keyboard shortcuts, filtering, modal state, cart management, and layout in a monolithic component.
3. `PaymentModal.tsx`: 250 lines mixing UI presentation, quick-cash shortcuts, payment method switching, and validation.

---

## 4. Optimization Score Target Model

To track the **67% Code Optimization Target** scientifically, we define a composite Code Optimization Index (COI) evaluated across 5 key dimensions:

1. **Deduplication Ratio ($D_r$)**: Reduction of duplicated business rules, formatting functions, and form schemas across frontend and backend.
2. **Query & Network Roundtrips ($Q_r$)**: Reduction of unnecessary database round trips, caching efficiency (TanStack Query staleTime/gcTime), and controlled polling/SSE implementation.
3. **Component Reusability & Granularity ($C_r$)**: Breaking monolithic components (>250 lines) into focused, single-responsibility components and shared hooks.
4. **Server-Side Validation & Security Hardening ($S_v$)**: Server-side calculation authority (discounts, order totals, taxes) eliminating client-side trust vulnerabilities.
5. **Test Coverage of Critical Flows ($T_c$)**: Raising test coverage of checkout, order state lifecycle, discount logic, dummy QRIS, and cash validation from 2 tests to comprehensive coverage.

Final optimization results will be measured and reported in `docs/optimization-report.md`.
