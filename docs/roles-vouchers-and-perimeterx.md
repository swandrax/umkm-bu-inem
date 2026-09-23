# Role, voucher, barcode, dan audit PerimeterX

## RBAC

| Role | Diizinkan | Dilarang |
|---|---|---|
| `SUPER_ADMIN` | CRUD akun, CRUD master, voucher, laporan, audit | — |
| `ADMIN` | CRUD katalog/kategori dan operasional | membuat Super Admin, manajemen akun |
| `CASHIER` | pilih/scan produk, POS, pembayaran, cek voucher | CRUD master, laporan/akun |
| `CUSTOMER` | lihat katalog, klaim dan gunakan voucher miliknya, pembayaran miliknya | melihat data pengguna lain |

RBAC wajib diperiksa pada API; menyembunyikan menu frontend tidak cukup. Akses Customer ke data miliknya memerlukan relasi customer-user pada endpoint profil sebelum UI customer dibuka.

## Voucher dan barcode

Migrasi V4 menyediakan data voucher dan klaim. Voucher dibuat aktif selama maksimal dua hari, berlaku hanya saat pembelian berada pada Rp60.000–Rp100.000, dan dapat diklaim satu kali per customer. Pekerja terjadwal wajib menandai klaim lewat masa aktif sebagai `EXPIRED`; validasi expiry tetap dilakukan saat klaim/redeem.

Barcode produk memakai `GET /api/v1/products/code/{code}`. Scanner USB/Bluetooth bertindak sebagai keyboard; POS harus mengambil produk/harga dari API. Barcode voucher adalah kode acak berentropi tinggi, bukan ID urut.

## Real-time dan Onsen UI

Sumber kebenaran adalah commit database. UI meng-invalidasi TanStack Query setelah checkout/payment; untuk multi-kasir gunakan SSE/WebSocket yang menerbitkan `sale.created`, `payment.updated`, `stock.updated`, dan `voucher.claimed` setelah commit tanpa PII.

Onsen UI core v2 dipasang untuk CSS mobile native. Binding `react-onsenui` belum kompatibel dengan React 19 karena peer dependency React 18; aplikasi memakai core styling/Web Components bertahap agar dependency tidak dipaksa tidak kompatibel.

## PerimeterX / HUMAN Bot Defender

PerimeterX dikelola HUMAN Security. Integrasi Next.js membutuhkan `px_app_id`, `px_auth_token`, dan `px_cookie_secret`; simpan hanya di environment server/edge. Aktifkan monitor mode dahulu, tandai login, klaim voucher, checkout, dan webhook sebagai sensitive routes, uji false positive, baru aktifkan blocking bersama dukungan HUMAN.

```env
PX_APP_ID=
PX_AUTH_TOKEN=
PX_COOKIE_SECRET=
PX_ENABLED=false
PX_BLOCK_ENABLED=false
```

Callback Xendit, `/actuator/health`, dan Prometheus internal hanya boleh di-allowlist bila sumbernya diverifikasi; jangan membuka seluruh `/api` sebagai bypass.
