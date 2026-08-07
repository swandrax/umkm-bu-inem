<style>
    .track-container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
    .track-card { background: white; border-radius: var(--radius); padding: 32px; border: 1px solid var(--border); box-shadow: var(--shadow); }
    .track-title { font-size: 22px; font-weight: 800; color: var(--dark); margin-bottom: 8px; text-align: center; }
    .track-sub { font-size: 14px; color: var(--text-muted); text-align: center; margin-bottom: 24px; }
    
    .timeline { margin-top: 24px; border-left: 3px solid var(--primary); padding-left: 20px; }
    .timeline-item { margin-bottom: 20px; position: relative; }
    .timeline-item::before { content: ''; position: absolute; left: -27px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); }
    .timeline-date { font-size: 12px; color: var(--text-muted); font-weight: 600; }
    .timeline-status { font-size: 15px; font-weight: 800; color: var(--dark); margin: 2px 0; }
    .timeline-desc { font-size: 13px; color: var(--text-main); }
    
    .status-badge-lg { display: inline-block; padding: 8px 16px; border-radius: 30px; font-weight: 800; font-size: 14px; margin: 10px 0; }
    .bg-menunggu { background: #fef3c7; color: #d97706; }
    .bg-diproses { background: #e0f2fe; color: #0284c7; }
    .bg-diantar { background: #f3e8ff; color: #7e22ce; }
    .bg-selesai { background: #dcfce7; color: #15803d; }
</style>

<div class="track-container">
    <div class="track-card">
        <h2 class="track-title">🔍 Lacak Pesanan Anda</h2>
        <p class="track-sub">Masukkan Nomor Transaksi (misal: WEB-2026...) untuk memantau status pesanan & kurir.</p>

        <form action="index.php" method="GET" style="display: flex; gap: 8px; margin-bottom: 24px;">
            <input type="hidden" name="route" value="track">
            <input type="text" name="trx" value="<?php echo htmlspecialchars($_GET['trx'] ?? ''); ?>" required placeholder="Nomor Transaksi WEB-..." style="flex:1; padding: 12px; border-radius: 10px; border: 1px solid var(--border); font-size: 14px;">
            <button type="submit" class="btn-checkout" style="width: auto; padding: 12px 24px;">Lacak</button>
        </form>

        <?php if (!empty($order)): ?>
            <div style="border-top: 1px dashed var(--border); padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: var(--text-muted);">No Transaksi:</span>
                    <b style="font-size: 15px; color: var(--dark);"><?php echo htmlspecialchars($order['transaction_number']); ?></b>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span style="font-size: 13px; color: var(--text-muted);">Customer:</span>
                    <b><?php echo htmlspecialchars($order['customer_name'] ?? 'Guest'); ?></b>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span style="font-size: 13px; color: var(--text-muted);">Tipe Pengiriman:</span>
                    <b><?php echo htmlspecialchars($order['shipping_type']); ?></b>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 13px; color: var(--text-muted);">Status Pengiriman:</div>
                    <?php 
                        $statusClass = 'bg-menunggu';
                        $statusText = $order['shipping_status'] ?? 'MENUNGGU';
                        if ($statusText === 'DIPROSES') $statusClass = 'bg-diproses';
                        if ($statusText === 'SEDANG DIANTAR' || $statusText === 'DIANTAR') $statusClass = 'bg-diantar';
                        if ($statusText === 'SELESAI') $statusClass = 'bg-selesai';
                    ?>
                    <span class="status-badge-lg <?php echo $statusClass; ?>"><?php echo $statusText; ?></span>
                </div>

                <h4>Riwayat Status (Log Kurir):</h4>
                <div class="timeline">
                    <?php if (!empty($logs)): ?>
                        <?php foreach ($logs as $log): ?>
                            <div class="timeline-item">
                                <div class="timeline-date"><?php echo $log['timestamp']; ?></div>
                                <div class="timeline-status"><?php echo htmlspecialchars($log['status']); ?></div>
                                <div class="timeline-desc"><?php echo htmlspecialchars($log['description']); ?></div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="timeline-item">
                            <div class="timeline-date"><?php echo $order['transaction_date']; ?></div>
                            <div class="timeline-status">PESANAN TERDAFTAR</div>
                            <div class="timeline-desc">Pesanan telah masuk ke sistem Kasir Ibu Inem dan menunggu diproses.</div>
                        </div>
                    <?php endif; ?>
                </div>

                <div style="margin-top: 24px; text-align: center;">
                    <a href="index.php?route=receipt&trx=<?php echo urlencode($order['transaction_number']); ?>" target="_blank" style="color: var(--primary-dark); font-weight: 700; text-decoration: none;">📄 Lihat Struk Digital Web &rarr;</a>
                </div>
            </div>
        <?php elseif (isset($_GET['trx'])): ?>
            <p style="text-align: center; color: #ef4444; font-weight: 600; margin-top: 20px;">Pesanan dengan nomor transaksi tersebut tidak ditemukan!</p>
        <?php endif; ?>
    </div>
</div>
