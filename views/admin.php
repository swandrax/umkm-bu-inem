<style>
    .admin-container { max-width: 1100px; margin: 30px auto; padding: 0 20px; }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .admin-header h2 { font-size: 24px; font-weight: 800; color: var(--dark); }
    .tabs { display: flex; gap: 12px; margin-bottom: 20px; border-bottom: 2px solid var(--border); }
    .tab-btn { padding: 12px 24px; font-weight: 700; border: none; background: none; cursor: pointer; color: var(--text-muted); border-bottom: 3px solid transparent; }
    .tab-btn.active { color: var(--primary-dark); border-bottom-color: var(--primary); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    
    .table-card { background: white; border-radius: var(--radius); padding: 24px; border: 1px solid var(--border); box-shadow: var(--shadow); }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: 14px; }
    th { background: #f8fafc; font-weight: 700; color: var(--dark); }
    
    .badge-status { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .badge-active { background: #dcfce7; color: #15803d; }
    .badge-inactive { background: #fee2e2; color: #b91c1c; }
    
    .btn-sm { padding: 6px 12px; border-radius: 8px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; }
    .btn-edit { background: #3b82f6; color: white; }
    .btn-delete { background: #ef4444; color: white; }
    .btn-create { background: var(--primary); color: white; padding: 10px 20px; border-radius: 10px; font-weight: 700; border: none; cursor: pointer; }
</style>

<div class="admin-container">
    <div class="admin-header">
        <h2>Panel Kelola Data (Web CRUD Admin)</h2>
        <a href="index.php?route=catalog" class="btn-sm" style="background: var(--dark); color: white; text-decoration: none; padding: 10px 16px;">&larr; Kembali ke Katalog Web</a>
    </div>

    <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('products', this)">Kelola Produk</button>
        <button class="tab-btn" onclick="switchTab('customers', this)">Kelola Customer</button>
    </div>

    <!-- Products Tab -->
    <div class="tab-content active" id="tab-products">
        <div class="table-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Daftar Produk Jajanan</h3>
                <button class="btn-create" onclick="openProductModal()">+ Tambah Produk Baru</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th>Nama Produk</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $p): ?>
                        <tr>
                            <td><b><?php echo htmlspecialchars($p['code']); ?></b></td>
                            <td><?php echo htmlspecialchars($p['name']); ?></td>
                            <td><?php echo htmlspecialchars($p['category_name'] ?? 'Umum'); ?></td>
                            <td>Rp <?php echo number_format($p['price'], 0, ',', '.'); ?></td>
                            <td><?php echo $p['stock']; ?> pcs</td>
                            <td><span class="badge-status <?php echo $p['active'] ? 'badge-active' : 'badge-inactive'; ?>"><?php echo $p['active'] ? 'Aktif' : 'Non-Aktif'; ?></span></td>
                            <td>
                                <button class="btn-sm btn-edit" onclick='editProduct(<?php echo json_encode($p); ?>)'>Edit</button>
                                <button class="btn-sm btn-delete" onclick="deleteProduct(<?php echo $p['id']; ?>)">Hapus</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Customers Tab -->
    <div class="tab-content" id="tab-customers">
        <div class="table-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Daftar Customer Terdaftar</h3>
                <button class="btn-create" onclick="openCustomerModal()">+ Tambah Customer Baru</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Customer</th>
                        <th>Nomor HP</th>
                        <th>Alamat</th>
                        <th>Tanggal Daftar</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($customers as $c): ?>
                        <tr>
                            <td>#<?php echo $c['id']; ?></td>
                            <td><b><?php echo htmlspecialchars($c['name']); ?></b></td>
                            <td><?php echo htmlspecialchars($c['phone']); ?></td>
                            <td><?php echo htmlspecialchars($c['address']); ?></td>
                            <td><?php echo $c['created_at']; ?></td>
                            <td>
                                <button class="btn-sm btn-edit" onclick='editCustomer(<?php echo json_encode($c); ?>)'>Edit</button>
                                <button class="btn-sm btn-delete" onclick="deleteCustomer(<?php echo $c['id']; ?>)">Hapus</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Product Modal -->
<div class="modal" id="productModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="prodModalTitle">Tambah Produk Baru</h3>
            <button class="close-btn" onclick="closeModal('productModal')">&times;</button>
        </div>
        <form onsubmit="saveProduct(event)">
            <input type="hidden" id="prodId" name="id" value="0">
            <div class="form-group">
                <label>Kode Produk *</label>
                <input type="text" id="prodCode" name="code" required placeholder="Contoh: PRD-010">
            </div>
            <div class="form-group">
                <label>Nama Produk *</label>
                <input type="text" id="prodName" name="name" required placeholder="Contoh: Risol Mayo">
            </div>
            <div class="form-group">
                <label>Kategori *</label>
                <select id="prodCat" name="category_id">
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?php echo $cat['id']; ?>"><?php echo htmlspecialchars($cat['name']); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label>Harga (Rp) *</label>
                <input type="number" id="prodPrice" name="price" required placeholder="3500">
            </div>
            <div class="form-group">
                <label>Stok (pcs) *</label>
                <input type="number" id="prodStock" name="stock" required placeholder="50">
            </div>
            <button type="submit" class="btn-checkout">Simpan Produk</button>
        </form>
    </div>
</div>

<!-- Customer Modal -->
<div class="modal" id="customerModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="custModalTitle">Tambah Customer Baru</h3>
            <button class="close-btn" onclick="closeModal('customerModal')">&times;</button>
        </div>
        <form onsubmit="saveCustomer(event)">
            <input type="hidden" id="custModalId" name="id" value="0">
            <div class="form-group">
                <label>Nama Customer *</label>
                <input type="text" id="custModalName" name="name" required placeholder="Nama Lengkap">
            </div>
            <div class="form-group">
                <label>Nomor HP / WA</label>
                <input type="text" id="custModalPhone" name="phone" placeholder="08123456789">
            </div>
            <div class="form-group">
                <label>Alamat</label>
                <textarea id="custModalAddress" name="address" rows="2" placeholder="Alamat rumah..."></textarea>
            </div>
            <button type="submit" class="btn-checkout">Simpan Customer</button>
        </form>
    </div>
</div>

<script>
    function switchTab(tabName, btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + tabName).classList.add('active');
    }

    function openModal(id) { document.getElementById(id).style.display = 'flex'; }
    function closeModal(id) { document.getElementById(id).style.display = 'none'; }

    function openProductModal() {
        document.getElementById('prodId').value = 0;
        document.getElementById('prodCode').value = '';
        document.getElementById('prodName').value = '';
        document.getElementById('prodPrice').value = '';
        document.getElementById('prodStock').value = '';
        document.getElementById('prodModalTitle').innerText = 'Tambah Produk Baru';
        openModal('productModal');
    }

    function editProduct(p) {
        document.getElementById('prodId').value = p.id;
        document.getElementById('prodCode').value = p.code;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodCat').value = p.category_id;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodStock').value = p.stock;
        document.getElementById('prodModalTitle').innerText = 'Edit Produk #' + p.code;
        openModal('productModal');
    }

    async function saveProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await fetch('index.php?route=save_product', { method: 'POST', body: formData });
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    }

    async function deleteProduct(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
        const res = await fetch('index.php?route=delete_product&id=' + id);
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    }

    function openCustomerModal() {
        document.getElementById('custModalId').value = 0;
        document.getElementById('custModalName').value = '';
        document.getElementById('custModalPhone').value = '';
        document.getElementById('custModalAddress').value = '';
        document.getElementById('custModalTitle').innerText = 'Tambah Customer Baru';
        openModal('customerModal');
    }

    function editCustomer(c) {
        document.getElementById('custModalId').value = c.id;
        document.getElementById('custModalName').value = c.name;
        document.getElementById('custModalPhone').value = c.phone;
        document.getElementById('custModalAddress').value = c.address;
        document.getElementById('custModalTitle').innerText = 'Edit Customer #' + c.name;
        openModal('customerModal');
    }

    async function saveCustomer(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await fetch('index.php?route=save_customer', { method: 'POST', body: formData });
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    }

    async function deleteCustomer(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus customer ini?')) return;
        const res = await fetch('index.php?route=delete_customer&id=' + id);
        const data = await res.json();
        alert(data.message);
        if (data.success) location.reload();
    }
</script>
