# Keamanan, UU PDP, UU ITE, dan ISO 27001

## Kontrol yang diterapkan

| Area | Implementasi saat ini | Operasional yang wajib dilakukan |
|---|---|---|
| Akses | RBAC admin/kasir, JWT 15 menit, BCrypt cost 12 | buat akun lewat admin; cabut akun saat pegawai keluar |
| Rahasia | tidak ada secret default, `.env` diabaikan Git | rotasi JWT/DB password dan simpan di secret manager VPS/CI |
| Transport | gateway siap TLS, header keamanan | HTTPS wajib di domain produksi; HSTS setelah HTTPS stabil |
| Data | PII minimum, consent/tombstone/hash telepon di migrasi V2 | catat tujuan dan dasar pemrosesan sebelum mengisi pelanggan |
| Audit | tabel audit disiapkan | catat login, perubahan akun, ekspor, penghapusan, dan akses PII |
| Ketahanan | health check, backup dan monitoring | uji restore backup berkala; alert untuk API/DB down |
| Kerentanan | `npm audit`, Trivy CI | perbaiki HIGH/CRITICAL sebelum rilis dan rekam pengecualian berjangka |

## Pemetaan kepatuhan

UU PDP memerlukan tujuan pemrosesan yang jelas, minimalisasi data, keamanan, hak subjek data, retensi, dan prosedur insiden. UU ITE membutuhkan pengamanan sistem elektronik serta jejak yang dapat dipertanggungjawabkan. ISO/IEC 27001:2022 dijadikan kerangka ISMS: inventaris aset dan risiko, kontrol akses, manajemen kerentanan, logging, backup, respons insiden, serta evaluasi berkala.

Sebelum produksi, tetapkan retensi per jenis data, kanal DSAR (akses/koreksi/penghapusan), SOP notifikasi insiden, register risiko, pemilik aset, DPA dengan penyedia VPS/pembayaran, dan persetujuan eksplisit bila data pelanggan dipakai di luar transaksi. Jangan menyimpan PAN kartu, CVV, atau kredensial pembayaran.

`V2__security_privacy_and_scale.sql` bersifat additive. Backup terlebih dahulu, jalankan oleh akun migrasi terbatas, dan verifikasi indeks serta hasil restore di staging.
