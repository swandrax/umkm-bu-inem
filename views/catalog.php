<style>
    .container { max-width: 1100px; margin: 24px auto; padding: 0 20px; }
    .hero-banner { background: linear-gradient(135deg, #1e272e, #34495e); color: white; border-radius: var(--radius); padding: 32px; margin-bottom: 24px; box-shadow: var(--shadow); }
    .hero-banner h2 { font-size: 26px; font-weight: 800; margin-bottom: 8px; }
    .hero-banner p { color: #bdc3c7; font-size: 14px; max-width: 500px; }
    .controls { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; align-items: center; justify-content: space-between; }
    .search-box { position: relative; flex: 1; min-width: 250px; }
    .search-box input { width: 100%; padding: 12px 18px; border-radius: 12px; border: 1px solid var(--border); font-size: 14px; outline: none; background: white; }
    .search-box input:focus { border-color: var(--primary); }
    .categories-filter { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
    .cat-chip { padding: 10px 18px; border-radius: 30px; background: white; border: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--text-main); cursor: pointer; white-space: nowrap; transition: all 0.2s; }
    .cat-chip.active, .cat-chip:hover { background: var(--primary); color: white; border-color: var(--primary); }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
    .product-card { background: var(--card-bg); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border); box-shadow: var(--shadow); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1); }
    .prod-category { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--primary-dark); letter-spacing: 0.5px; margin-bottom: 6px; }
    .prod-title { font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 12px; }
    .prod-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding-top: 12px; border-top: 1px dashed var(--border); }
    .prod-price { font-size: 17px; font-weight: 800; color: var(--primary-dark); }
    .prod-stock { font-size: 12px; color: var(--text-muted); }
    .btn-add { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; }
    .btn-add:hover { background: var(--primary-dark); }
    .btn-add:disabled { background: #cbd5e1; cursor: not-allowed; }

    /* Modal */
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; z-index: 200; backdrop-filter: blur(4px); }
    .modal-content { background: white; width: 90%; max-width: 540px; border-radius: 20px; padding: 24px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
    .modal-header h3 { font-size: 20px; font-weight: 800; }
    .close-btn { font-size: 24px; cursor: pointer; border: none; background: none; color: var(--text-muted); }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
    .qty-controls { display: flex; align-items: center; gap: 8px; }
    .qty-btn { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--border); background: #f8fafc; font-weight: 700; cursor: pointer; }
    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-main); }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); font-size: 14px; outline: none; }
    .total-box { background: #f8fafc; padding: 16px; border-radius: 12px; margin: 16px 0; display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 18px; }
    .btn-checkout { width: 100%; background: var(--primary); color: white; border: none; padding: 14px; border-radius: 12px; font-size: 16px; font-weight: 800; cursor: pointer; }
</style>

<div class="container">
    <div class="hero-banner">
        <h2>Pesan Jajanan Favoritmu! 🍩</h2>
        <p>Nikmati aneka kue basah, gorengan renyah, dan minuman segar khas Ibu Inem. Pesanan Anda akan langsung diproses oleh Kasir Desktop.</p>
    </div>

    <div class="controls">
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Cari nama kue / jajanan..." oninput="filterProducts()">
        </div>
        <div class="categories-filter" id="categoryChips">
            <button class="cat-chip active" onclick="selectCategory(0, this)">Semua</button>
            <?php foreach ($categories as $c): ?>
                <button class="cat-chip" onclick="selectCategory(<?php echo $c['id']; ?>, this)"><?php echo htmlspecialchars($c['name']); ?></button>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="product-grid" id="productGrid">
        <!-- Rendered dynamically -->
    </div>
</div>

<!-- Cart & Checkout Modal -->
<div class="modal" id="cartModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Keranjang & Checkout</h3>
            <button class="close-btn" onclick="toggleCart()">&times;</button>
        </div>

        <div id="cartItemsContainer"></div>

        <div class="total-box">
            <span>Total Pembayaran:</span>
            <span id="cartTotalText" style="color: var(--primary-dark);">Rp 0</span>
        </div>

        <form id="checkoutForm" onsubmit="submitOrder(event)">
            <div class="form-group">
                <label>Nama Anda *</label>
                <input type="text" id="custName" required placeholder="Contoh: Budi Santoso">
            </div>
            <div class="form-group">
                <label>Nomor HP / WhatsApp *</label>
                <input type="tel" id="custPhone" required placeholder="Contoh: 08123456789">
            </div>
            <div class="form-group">
                <label>Jenis Pesanan *</label>
                <select id="shippingType" onchange="toggleAddressField()">
                    <option value="TAKEAWAY">Takeaway (Ambil Sendiri di Toko)</option>
                    <option value="DINE_IN">Dine In (Makan di Tempat / Meja)</option>
                    <option value="DELIVERY">Delivery (Diantar Kurir)</option>
                </select>
            </div>
            <div class="form-group" id="addressGroup" style="display:none;">
                <label>Alamat Pengiriman</label>
                <textarea id="custAddress" rows="2" placeholder="Alamat lengkap pengiriman..."></textarea>
            </div>
            <div class="form-group">
                <label>Metode Pembayaran *</label>
                <select id="paymentMethod">
                    <option value="QRIS">QRIS / E-Wallet</option>
                    <option value="CASH">Bayar Tunai di Kasir</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                </select>
            </div>
            <button type="submit" class="btn-checkout" id="btnSubmit">Kirim Pesanan ke Kasir</button>
        </form>
    </div>
</div>

<script>
    let products = <?php echo json_encode($products); ?>;
    let cart = [];
    let selectedCatId = 0;

    function formatRupiah(amount) {
        return 'Rp ' + Number(amount).toLocaleString('id-ID');
    }

    function renderProducts() {
        const grid = document.getElementById('productGrid');
        const search = document.getElementById('searchInput').value.toLowerCase();
        
        const filtered = products.filter(p => {
            const matchCat = selectedCatId === 0 || p.category_id == selectedCatId;
            const matchSearch = p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search);
            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">Tidak ada jajanan yang ditemukan.</p>`;
            return;
        }

        grid.innerHTML = filtered.map(p => `
            <div class="product-card">
                <div>
                    <div class="prod-category">${p.category_name || 'Umum'}</div>
                    <div class="prod-title">${p.name}</div>
                    <div class="prod-stock">Stok: <b>${p.stock} pcs</b></div>
                </div>
                <div class="prod-footer">
                    <div class="prod-price">${formatRupiah(p.price)}</div>
                    <button class="btn-add" ${p.stock <= 0 ? 'disabled' : ''} onclick="addToCart(${p.id})">
                        ${p.stock > 0 ? '+ Tambah' : 'Habis'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    function selectCategory(catId, btn) {
        selectedCatId = catId;
        document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
    }

    function filterProducts() { renderProducts(); }

    function addToCart(prodId) {
        const prod = products.find(p => p.id === prodId);
        if (!prod || prod.stock <= 0) return;

        const existing = cart.find(c => c.id === prodId);
        if (existing) {
            if (existing.quantity + 1 > prod.stock) {
                alert('Jumlah melebihi stok!');
                return;
            }
            existing.quantity++;
        } else {
            cart.push({ id: prod.id, name: prod.name, price: prod.price, quantity: 1, maxStock: prod.stock });
        }
        updateCartUI();
    }

    function updateCartUI() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').innerText = count;

        const container = document.getElementById('cartItemsContainer');
        if (cart.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--text-muted);">Keranjang masih kosong.</p>`;
            document.getElementById('cartTotalText').innerText = 'Rp 0';
            return;
        }

        let total = 0;
        container.innerHTML = cart.map((item, idx) => {
            const sub = item.price * item.quantity;
            total += sub;
            return `
                <div class="cart-item">
                    <div>
                        <div style="font-weight: 700;">${item.name}</div>
                        <div style="font-size: 12px; color: var(--text-muted);">${formatRupiah(item.price)} x ${item.quantity} = <b>${formatRupiah(sub)}</b></div>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('cartTotalText').innerText = formatRupiah(total);
    }

    function changeQty(idx, delta) {
        const item = cart[idx];
        if (delta > 0 && item.quantity + 1 > item.maxStock) {
            alert('Stok tidak mencukupi!');
            return;
        }
        item.quantity += delta;
        if (item.quantity <= 0) cart.splice(idx, 1);
        updateCartUI();
    }

    function toggleCart() {
        const modal = document.getElementById('cartModal');
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
        updateCartUI();
    }

    function toggleAddressField() {
        const type = document.getElementById('shippingType').value;
        document.getElementById('addressGroup').style.display = type === 'DELIVERY' ? 'block' : 'none';
    }

    async function submitOrder(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Keranjang belanja masih kosong!');
            return;
        }

        const btn = document.getElementById('btnSubmit');
        btn.disabled = true;
        btn.innerText = 'Mengirim Pesanan...';

        const payload = {
            customer_name: document.getElementById('custName').value,
            customer_phone: document.getElementById('custPhone').value,
            shipping_type: document.getElementById('shippingType').value,
            shipping_address: document.getElementById('custAddress').value,
            payment_method: document.getElementById('paymentMethod').value,
            items: cart
        };

        try {
            const res = await fetch('index.php?route=checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert('🎉 PESANAN BERHASIL!\n\nNo Transaksi: ' + data.transaction_number + '\nTotal: ' + formatRupiah(data.total) + '\n\nPesanan Anda telah terdaftar dan sedang diproses secara real-time di layar Kasir.');
                cart = [];
                toggleCart();
                location.reload();
            } else {
                alert('Gagal: ' + data.message);
            }
        } catch (err) {
            alert('Terjadi kesalahan koneksi.');
        } finally {
            btn.disabled = false;
            btn.innerText = 'Kirim Pesanan ke Kasir';
        }
    }

    renderProducts();
</script>
