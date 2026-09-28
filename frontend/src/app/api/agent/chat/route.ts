import { NextRequest, NextResponse } from "next/server";
import {
  buildKnowledgeGraph,
  fetchOrderGraphNode,
  serializeGraphForPrompt,
  BusinessKnowledgeGraph,
  GraphNode,
} from "@/lib/agent/graphLearner";

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Local Graph-based Fallback Generator if Groq API is not set or network fails
function generateLocalGraphResponse(
  message: string,
  graph: BusinessKnowledgeGraph,
  orderNode: GraphNode | null
): string {
  const lower = message.toLowerCase();

  // 1. Check order inquiry
  if (orderNode) {
    return (
      `Alhamdulillah, Bu Inem sudah cek pesanan dengan nomor **${orderNode.properties.orderNumber}** nggih kak! 🙏\n\n` +
      `📋 **Status Pesanan**: \`${orderNode.properties.orderStatus}\`\n` +
      `💳 **Status Pembayaran**: \`${orderNode.properties.paymentStatus}\`\n` +
      `💰 **Total**: **${orderNode.properties.totalFormatted}**\n\n` +
      `Pesanan sedang dipersiapkan dengan penuh cinta di dapur Bu Inem agar tetap higienis dan hangat saat sampai. Ada yang ingin ditanyakan lagi kak?`
    );
  }

  // 2. Salam & Sambutan
  if (
    lower.includes("halo") ||
    lower.includes("hai") ||
    lower.includes("pagi") ||
    lower.includes("siang") ||
    lower.includes("sore") ||
    lower.includes("malam") ||
    lower.includes("assalamu") ||
    lower.includes("permisi")
  ) {
    return (
      `Sampurasun / Sugeng rawuh kak! Monggo, perkenalkan saya Bu Inem dari **${graph.summary.storeName}** 😊.\n\n` +
      `Senang sekali bisa menyapa kakak hari ini. Ada yang bisa Bu Inem bantu? Kakak bisa tanya seputar:\n` +
      `• 🍰 **Menu Jajanan & Stok Hari Ini** (Lemper, Pastel, Risol Mayo, Klepon)\n` +
      `• 📦 **Paket Snack Box Rapat & Kantor** (Mulai Rp 15.000)\n` +
      `• 🎋 **Jajanan Tampah Tradisional** untuk Arisan & Syukuran\n` +
      `• 🔍 **Cek Status Pesanan** (Ketik saja nomor order kakak)`
    );
  }

  // 3. Rekomendasi Menu & Snack Box
  if (
    lower.includes("snack box") ||
    lower.includes("paket") ||
    lower.includes("rapat") ||
    lower.includes("acara") ||
    lower.includes("katering") ||
    lower.includes("tampah")
  ) {
    const services = graph.nodes.filter((n) => n.type === "SERVICE");
    const serviceList = services
      .map(
        (s) =>
          `✨ **${s.label}**\n` +
          `   - Harga: **${s.properties.priceFormatted}**\n` +
          `   - Keterangan: ${s.properties.description || "-"}\n` +
          `   - Durasi Pemesanan: ${s.properties.duration || "Fleksibel"}`
      )
      .join("\n\n");

    return (
      `Monggo kak! Untuk keperluan acara, rapat kantor, atau hajatan, Bu Inem punya beberapa pilihan paket terfavorit nggih:\n\n` +
      `${serviceList}\n\n` +
      `Semua jajanan dijamin dibuat dari bahan segar, tanpa pengawet, dan dibungkus cantik higienis. Mau Bu Inem bantu hitungkan estimasi untuk berapa porsi kak?`
    );
  }

  // 4. Harga atau Menu Produk Satuan
  if (
    lower.includes("menu") ||
    lower.includes("harga") ||
    lower.includes("kue") ||
    lower.includes("lemper") ||
    lower.includes("pastel") ||
    lower.includes("risol") ||
    lower.includes("jajanan")
  ) {
    const products = graph.nodes.filter((n) => n.type === "PRODUCT");
    const productList = products
      .map(
        (p) =>
          `• **${p.label}**: ${p.properties.priceFormatted} *(Stok sisa: ${p.properties.stock} pcs)*`
      )
      .join("\n");

    return (
      `Ini daftar jajanan pasar terlaris yang siap dinikmati hari ini di dapur Bu Inem ya kak:\n\n` +
      `${productList}\n\n` +
      `Kue lemper dan pastelnya baru saja selesai diangkat, masih anget dan gurih mantap! Mau pesan berapa buah kak?`
    );
  }

  // 5. Jam Buka / Alamat / Kontak
  if (
    lower.includes("alamat") ||
    lower.includes("lokasi") ||
    lower.includes("buka") ||
    lower.includes("jam") ||
    lower.includes("kontak") ||
    lower.includes("wa") ||
    lower.includes("telepon")
  ) {
    const store = graph.nodes.find((n) => n.type === "STORE");
    return (
      `Nggih kak, toko fisik **${graph.summary.storeName}** beralamat di:\n` +
      `📍 **${store?.properties.address || "Pasar Kuliner Tradisional"}**\n` +
      `⏰ **Jam Operasional**: ${store?.properties.operatingHours || "07:00 - 21:00 WIB"}\n` +
      `📱 **WhatsApp / Telp**: ${store?.properties.phone || "0812-3456-7890"}\n\n` +
      `Kakak bisa mampir langsung untuk pilih jajanan di etalase atau pesan online lewat website ini nggih!`
    );
  }

  // Default response
  return (
    `Matur nuwun sudah bertanya kak 😊. Bu Inem siap melayani pesanan jajanan pasar tradisional, snack box rapat, maupun katering tampah syukuran.\n\n` +
    `Kakak bisa sebutkan menu yang dicari, berapa porsi acara yang direncanakan, atau masukkan nomor pesanan untuk Bu Inem lacak langsung. Ada yang bisa Bu Inem bantu lebih lanjut?`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = (body.message || "").trim();
    const history: Array<{ role: string; content: string }> = body.history || [];
    let orderNumber: string | undefined = body.orderNumber;

    if (!message) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Auto detect order number in message (patterns like ORD-..., INM-..., or 8-12 alphanumeric)
    if (!orderNumber) {
      const match = message.match(/\b(ORD-[A-Z0-9-]+|INM-[A-Z0-9-]+|[0-9]{4,10})\b/i);
      if (match) {
        orderNumber = match[0];
      }
    }

    // 1. Build & Ground via Customer Role Knowledge Graph
    const graph = await buildKnowledgeGraph();
    const orderNode = orderNumber ? await fetchOrderGraphNode(orderNumber) : null;
    const serializedGraph = serializeGraphForPrompt(graph, orderNode);

    // 2. Call Groq API if key is present
    if (GROQ_API_KEY) {
      const systemPrompt = `
Anda adalah "Ibu Inem", sosok pemilik UMKM kuliner Jajanan Tradisional Bu Inem yang legendaris, ramah, hangat, penuh perhatian, dan keibuan khas Indonesia.
Tugas Anda adalah melayani dan mendampingi pelanggan yang berkunjung ke website Jajanan Bu Inem layaknya tamu yang mampir ke rumah sendiri.

PEDOMAN KARAKTER & GAYA BICARA:
- Selalu bertutur kata ramah, santun, hangat, dan solutif dengan sentuhan khas keibuan nusantara (gunakan sapaan hangat seperti "Kak", "Bapak", "Ibu", dan selipkan sapaan sopan seperti "Monggo", "Nggih", "Alhamdulillah", "Matur nuwun").
- Berikan saran yang solutif jika pelanggan bingung memilih menu untuk acara (seperti rapat kantor, arisan, syukuran, pengajian, hajatan).
- JANGAN PERNAH mengarang menu, harga, atau stok yang tidak tercatat di Knowledge Graph.
- Jika pelanggan menanyakan nomor pesanan atau resi, bacakan status pesanan dari data graf dengan jelas dan menenangkan.
- Jawaban harus rapi, mudah dibaca, gunakan format markdown tebal dan poin bullet seperlunya.

SUMBER DATA RESMI TOKO (KNOWLEDGE GRAPH DARI SISTEM):
${serializedGraph}
`.trim();

      const messagesPayload = [
        { role: "system", content: systemPrompt },
        ...history.slice(-6).map((h) => ({
          role: h.role === "user" ? "user" : "assistant",
          content: h.content,
        })),
        { role: "user", content: message },
      ];

      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: messagesPayload,
            temperature: 0.6,
            max_tokens: 600,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              reply,
              model: GROQ_MODEL,
              groundedInGraph: true,
              timestamp: new Date().toISOString(),
              orderFound: !!orderNode,
            });
          }
        }
      } catch (groqErr) {
        console.warn("Groq API call fallback to local graph:", groqErr);
      }
    }

    // 3. Fallback to Local Graph Reasoning Traversal
    const localReply = generateLocalGraphResponse(message, graph, orderNode);
    return NextResponse.json({
      reply: localReply,
      model: "local-graph-reasoning-engine",
      groundedInGraph: true,
      timestamp: new Date().toISOString(),
      orderFound: !!orderNode,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Agent chat error:", errorMsg);
    return NextResponse.json(
      {
        reply:
          "Waduh punten nggih kak, Bu Inem sedang menyiapkan adonan kue sebentar. Boleh diulang pertanyaannya atau langsung hubungi WhatsApp Bu Inem di 0812-3456-7890 ya kak! 🙏",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
