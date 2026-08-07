<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jajanan Ibu Inem - Menu & Pemesanan Online</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2ecc71;
            --primary-dark: #27ae60;
            --dark: #1e272e;
            --light-bg: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #2c3e50;
            --text-muted: #7f8c8d;
            --border: #e2e8f0;
            --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            --radius: 16px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: var(--light-bg); color: var(--text-main); padding-bottom: 100px; }
        
        .navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid var(--border);
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-logo {
            width: 42px; height: 42px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 22px; color: white;
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        }
        .brand-text h1 { font-size: 18px; font-weight: 800; color: var(--dark); }
        .brand-text p { font-size: 12px; color: var(--text-muted); font-weight: 500; }
        
        .cart-btn {
            position: relative; background: var(--dark); color: white;
            border: none; padding: 10px 18px; border-radius: 30px;
            font-weight: 700; font-size: 14px; cursor: pointer;
            display: flex; align-items: center; gap: 8px; transition: all 0.2s ease;
        }
        .cart-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(30, 39, 46, 0.2); }
        .cart-badge { background: var(--primary); color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="brand">
            <div class="brand-logo">🍢</div>
            <div class="brand-text">
                <h1>Jajanan Ibu Inem</h1>
                <p>E-Katalog & Pesan Online (MVC Mode)</p>
            </div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
            <a href="index.php?route=track" style="background: rgba(255,255,255,0.8); border: 1px solid var(--border); padding: 8px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; text-decoration: none; color: var(--dark);">🔍 Lacak Pesanan</a>
            <a href="index.php?route=admin" style="background: rgba(255,255,255,0.8); border: 1px solid var(--border); padding: 8px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; text-decoration: none; color: var(--dark);">⚙️ Panel Admin</a>
            <button class="cart-btn" onclick="toggleCart()">
                🛒 Keranjang <span class="cart-badge" id="cartCount">0</span>
            </button>
        </div>
    </nav>
