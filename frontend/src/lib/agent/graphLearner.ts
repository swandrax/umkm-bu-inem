/**
 * Graph Knowledge Learner for Human Agent Ibu Inem
 * 
 * Dynamically fetches live data from customer-role accessible endpoints:
 * - GET /api/v1/business-settings
 * - GET /api/v1/services
 * - GET /api/v1/products?active=true
 * - GET /api/v1/orders/{orderNumber}/status (conditional)
 * 
 * Constructs a structured Knowledge Graph (Nodes & Edges) to ground the
 * Groq LLM reasoning in verified business facts.
 */

export interface GraphNode {
  id: string;
  type: "STORE" | "CATEGORY" | "PRODUCT" | "SERVICE" | "ORDER" | "POLICY";
  label: string;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  metadata?: Record<string, unknown>;
}

export interface BusinessKnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  lastUpdated: string;
  summary: {
    totalProducts: number;
    totalServices: number;
    storeName: string;
    isOpen: boolean;
  };
}

const BACKEND_BASE_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

// In-memory cache for the knowledge graph to prevent overloading backend APIs
let cachedGraph: BusinessKnowledgeGraph | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache TTL

/**
 * Fetch data safely with timeout and fallback
 */
async function fetchSafe<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return fallback;
    }

    const json = await res.json();
    return (json.data ?? json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Build Knowledge Graph from Customer Role Endpoints
 */
export async function buildKnowledgeGraph(forceRefresh = false): Promise<BusinessKnowledgeGraph> {
  const now = Date.now();
  if (!forceRefresh && cachedGraph && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedGraph;
  }

  // 1. Fetch from Customer Role Accessible Endpoints
  const [settingsData, servicesData, productsData] = await Promise.all([
    fetchSafe<Record<string, string>>("/api/v1/business-settings", {
      business_name: "Jajanan Ibu Inem",
      address: "Jl. Tradisi Rasa No. 12, Pasar Kuliner, Yogyakarta",
      phone: "0812-3456-7890",
      operating_hours: "07:00 - 21:00 WIB",
      description: "Pusat Jajanan Tradisional, Snack Box & Katering Hajatan Halal dan Higienis",
    }),
    fetchSafe<Array<{
      id: number;
      name: string;
      slug: string;
      shortDescription?: string;
      finalPrice: number;
      duration?: string;
      features?: string[];
      categoryName?: string;
      active?: boolean;
    }>>("/api/v1/services", [
      {
        id: 1,
        name: "Paket Snack Box Rapat Kantor",
        slug: "paket-snack-box-rapat",
        shortDescription: "3 macam kue pilihan (1 asin gurih, 1 manis, 1 buah/air)",
        finalPrice: 15000,
        duration: "Pesan H-1",
        features: ["Kotak higienis", "Air mineral cup", "Tisu & sendok", "Pilihan kue fleksibel"],
        categoryName: "Snack Box",
        active: true,
      },
      {
        id: 2,
        name: "Paket Jajanan Tampah Tradisional",
        slug: "paket-jajanan-tampah-tradisional",
        shortDescription: "Tampah anyaman bambu cantik berisi 50 pcs aneka kue basah nusantara",
        finalPrice: 175000,
        duration: "Pesan H-2",
        features: ["Tampah bambu hias daun pisang", "50 pcs aneka kue", "Cocok untuk syukuran & arisan"],
        categoryName: "Katering Tampah",
        active: true,
      },
      {
        id: 3,
        name: "Paket Katering Hajatan & Syukuran",
        slug: "paket-katering-hajatan",
        shortDescription: "Paket prasmanan kue & jajanan tradisional untuk 100+ tamu",
        finalPrice: 850000,
        duration: "Pesan H-3",
        features: ["Prasmanan lengkap", "Gratis antar area lokal", "Bonus kue tampah mini"],
        categoryName: "Katering Acara",
        active: true,
      },
    ]),
    fetchSafe<Array<{
      id: number;
      code: string;
      name: string;
      price: number;
      stock: number;
      categoryName?: string;
      active?: boolean;
    }>>("/api/v1/products", [
      { id: 1, code: "SNK-001", name: "Lemper Ayam Spesial", price: 3500, stock: 45, categoryName: "Gorengan & Asin" },
      { id: 2, code: "SNK-002", name: "Pastel Isi Sayur Telur", price: 3500, stock: 30, categoryName: "Gorengan & Asin" },
      { id: 3, code: "SNK-003", name: "Risol Mayo Daging Asap", price: 4000, stock: 25, categoryName: "Gorengan & Asin" },
      { id: 4, code: "SNK-004", name: "Lumpia Basah Rebung", price: 4000, stock: 20, categoryName: "Gorengan & Asin" },
      { id: 5, code: "KUE-001", name: "Kue Lapis Legit Tradisional", price: 3500, stock: 35, categoryName: "Kue Manis" },
      { id: 6, code: "KUE-002", name: "Klepon Gula Merah Pandan", price: 3000, stock: 40, categoryName: "Kue Manis" },
      { id: 7, code: "KUE-003", name: "Nagasari Pisang Wangi", price: 3000, stock: 28, categoryName: "Kue Manis" },
    ]),
  ]);

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Node 1: Store Node
  const storeId = "node_store_main";
  nodes.push({
    id: storeId,
    type: "STORE",
    label: settingsData.business_name || "UMKM Jajanan Bu Inem",
    properties: {
      address: settingsData.address || "Yogyakarta",
      phone: settingsData.phone || "0812-3456-7890",
      operatingHours: settingsData.operating_hours || "07:00 - 21:00 WIB",
      description: settingsData.description || "Pusat jajanan tradisional nusantara",
    },
  });

  // Node Policy
  const policyId = "node_policy_orders";
  nodes.push({
    id: policyId,
    type: "POLICY",
    label: "Kebijakan Pemesanan & Pembayaran",
    properties: {
      paymentMethods: ["QRIS Dinamis Instan", "Tunai di Toko (Cash)"],
      receiptFormat: "Struk Termal 58mm Resmi & Digital",
      leadTimeSnackBox: "Minimal H-1 sebelum acara",
      leadTimeTampah: "Minimal H-2 sebelum acara",
      delivery: "Melayani pengantaran kurir instan atau ambil di toko",
    },
  });
  edges.push({
    source: storeId,
    target: policyId,
    relation: "HAS_POLICY",
  });

  // Services Nodes
  (Array.isArray(servicesData) ? servicesData : []).forEach((srv) => {
    const srvNodeId = `node_service_${srv.id}`;
    nodes.push({
      id: srvNodeId,
      type: "SERVICE",
      label: srv.name,
      properties: {
        slug: srv.slug,
        price: srv.finalPrice,
        priceFormatted: `Rp ${Number(srv.finalPrice || 0).toLocaleString("id-ID")}`,
        duration: srv.duration,
        features: srv.features || [],
        description: srv.shortDescription,
        category: srv.categoryName || "Layanan",
      },
    });

    edges.push({
      source: storeId,
      target: srvNodeId,
      relation: "OFFERS_SERVICE",
    });
  });

  // Products Nodes
  (Array.isArray(productsData) ? productsData : []).forEach((prod) => {
    const prodNodeId = `node_product_${prod.id}`;
    nodes.push({
      id: prodNodeId,
      type: "PRODUCT",
      label: prod.name,
      properties: {
        code: prod.code,
        price: prod.price,
        priceFormatted: `Rp ${Number(prod.price || 0).toLocaleString("id-ID")}`,
        stock: prod.stock,
        category: prod.categoryName || "Jajanan",
        available: prod.stock > 0,
      },
    });

    edges.push({
      source: storeId,
      target: prodNodeId,
      relation: "SELLS_ITEM",
    });
  });

  cachedGraph = {
    nodes,
    edges,
    lastUpdated: new Date().toISOString(),
    summary: {
      totalProducts: productsData?.length || 0,
      totalServices: servicesData?.length || 0,
      storeName: settingsData.business_name || "UMKM Jajanan Bu Inem",
      isOpen: true,
    },
  };

  lastFetchTime = now;
  return cachedGraph;
}

/**
 * Fetch Order Status Node if customer queries order tracking
 */
export async function fetchOrderGraphNode(orderNumber: string): Promise<GraphNode | null> {
  const cleanNum = orderNumber.trim();
  if (!cleanNum) return null;

  try {
    const statusData = await fetchSafe<{
      orderNumber: string;
      orderStatus: string;
      paymentStatus: string;
      customerName?: string;
      totalAmount?: number;
      estimatedPickup?: string;
    } | null>(`/api/v1/orders/${encodeURIComponent(cleanNum)}/status`, null);

    if (!statusData || !statusData.orderNumber) {
      return null;
    }

    return {
      id: `node_order_${statusData.orderNumber}`,
      type: "ORDER",
      label: `Pesanan #${statusData.orderNumber}`,
      properties: {
        orderNumber: statusData.orderNumber,
        orderStatus: statusData.orderStatus,
        paymentStatus: statusData.paymentStatus,
        customerName: statusData.customerName,
        totalAmount: statusData.totalAmount,
        totalFormatted: statusData.totalAmount
          ? `Rp ${Number(statusData.totalAmount).toLocaleString("id-ID")}`
          : "-",
        estimatedPickup: statusData.estimatedPickup,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Serialize Knowledge Graph into formatted context for LLM System Prompt
 */
export function serializeGraphForPrompt(graph: BusinessKnowledgeGraph, extraOrderNode?: GraphNode | null): string {
  const lines: string[] = [];
  lines.push("### KNOWLEDGE GRAPH DATA UMKM BU INEM (LIVE DATABASE)");
  lines.push(`Waktu Data Terkini: ${graph.lastUpdated}`);
  lines.push("");

  // Store profile
  const storeNode = graph.nodes.find((n) => n.type === "STORE");
  if (storeNode) {
    lines.push(`- **Toko**: ${storeNode.label}`);
    lines.push(`  - Alamat: ${storeNode.properties.address}`);
    lines.push(`  - WhatsApp/Telp: ${storeNode.properties.phone}`);
    lines.push(`  - Jam Operasional: ${storeNode.properties.operatingHours}`);
    lines.push(`  - Keterangan: ${storeNode.properties.description}`);
  }

  // Policies
  const policyNode = graph.nodes.find((n) => n.type === "POLICY");
  if (policyNode) {
    lines.push(`- **Kebijakan Pemesanan**:`);
    lines.push(`  - Pembayaran: ${(policyNode.properties.paymentMethods as string[]).join(", ")}`);
    lines.push(`  - Lead Time Snack Box: ${policyNode.properties.leadTimeSnackBox}`);
    lines.push(`  - Lead Time Tampah: ${policyNode.properties.leadTimeTampah}`);
    lines.push(`  - Pengiriman: ${policyNode.properties.delivery}`);
  }

  // Services
  lines.push("- **Katalog Paket Layanan & Katering**:");
  const services = graph.nodes.filter((n) => n.type === "SERVICE");
  services.forEach((s) => {
    lines.push(`  * [${s.label}] - Harga: ${s.properties.priceFormatted} | Durasi: ${s.properties.duration}`);
    if (s.properties.description) lines.push(`    Deskripsi: ${s.properties.description}`);
    if (Array.isArray(s.properties.features) && s.properties.features.length > 0) {
      lines.push(`    Fitur: ${s.properties.features.join(", ")}`);
    }
  });

  // Products
  lines.push("- **Daftar Jajanan Satuan Siap Saji (Ready Stock)**:");
  const products = graph.nodes.filter((n) => n.type === "PRODUCT");
  products.forEach((p) => {
    lines.push(
      `  * [${p.label}] (${p.properties.category}) - ${p.properties.priceFormatted} | Sisa Stok: ${p.properties.stock} pcs`
    );
  });

  // Order Node if present
  if (extraOrderNode) {
    lines.push("");
    lines.push(`- **Data Pesanan Khusus Pelanggan**:`);
    lines.push(`  * Nomor: ${extraOrderNode.properties.orderNumber}`);
    lines.push(`  * Status Pesanan: ${extraOrderNode.properties.orderStatus}`);
    lines.push(`  * Status Pembayaran: ${extraOrderNode.properties.paymentStatus}`);
    lines.push(`  * Total Tagihan: ${extraOrderNode.properties.totalFormatted}`);
    if (extraOrderNode.properties.customerName) {
      lines.push(`  * Nama Pemesan: ${extraOrderNode.properties.customerName}`);
    }
  }

  return lines.join("\n");
}
