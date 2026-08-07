<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk Digital - <?php echo htmlspecialchars($order['transaction_number']); ?></title>
    <style>
        body { font-family: 'Courier New', Courier, monospace; background: #f1f5f9; padding: 20px; display: flex; justify-content: center; }
        .receipt-card { background: white; width: 320px; padding: 20px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px dashed #cbd5e1; }
        .center { text-align: center; }
        .line { border-bottom: 1px dashed #94a3b8; margin: 12px 0; }
        .flex { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
        .bold { font-weight: bold; }
        @media print {
            body { background: white; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="receipt-card">
        <div class="center">
            <h2 style="margin:0;">JAJANAN IBU INEM</h2>
            <div style="font-size:12px;">Kue Basah, Gorengan & Minuman</div>
            <div style="font-size:11px; color:#64748b;">JL. Kebon Bawang No. 1, Jakarta</div>
        </div>

        <div class="line"></div>

        <div class="flex"><span>No:</span><span class="bold"><?php echo htmlspecialchars($order['transaction_number']); ?></span></div>
        <div class="flex"><span>Tgl:</span><span><?php echo $order['transaction_date']; ?></span></div>
        <div class="flex"><span>Customer:</span><span><?php echo htmlspecialchars($order['customer_name'] ?? 'Guest'); ?></span></div>
        <div class="flex"><span>Tipe:</span><span><?php echo htmlspecialchars($order['shipping_type']); ?></span></div>

        <div class="line"></div>

        <?php foreach ($details as $d): ?>
            <div class="flex">
                <span><?php echo htmlspecialchars($d['product_name']); ?> x<?php echo $d['quantity']; ?></span>
                <span>Rp <?php echo number_format($d['subtotal'], 0, ',', '.'); ?></span>
            </div>
        <?php endforeach; ?>

        <div class="line"></div>

        <div class="flex bold"><span>TOTAL:</span><span>Rp <?php echo number_format($order['total'], 0, ',', '.'); ?></span></div>
        <div class="flex"><span>Metode Bayar:</span><span><?php echo htmlspecialchars($order['payment_method']); ?></span></div>
        <div class="flex"><span>Status:</span><span style="color:#16a34a; font-weight:bold;"><?php echo htmlspecialchars($order['status']); ?></span></div>

        <div class="line"></div>

        <div class="center" style="font-size:11px; color:#64748b; margin-top:10px;">
            Terima kasih telah berbelanja di<br><b>Jajanan Ibu Inem!</b>
        </div>

        <div class="center no-print" style="margin-top:16px;">
            <button onclick="window.print()" style="padding: 8px 16px; background:#1e272e; color:white; border:none; border-radius:6px; cursor:pointer;">🖨️ Cetak Struk</button>
        </div>
    </div>
</body>
</html>
