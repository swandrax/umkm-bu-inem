"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, RotateCcw, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_GREETING: ChatMessage = {
  id: "msg_init",
  role: "assistant",
  content:
    "Sampurasun / Sugeng rawuh kak! Monggo, perkenalkan saya **Bu Inem** 😊.\n\n" +
    "Ada yang bisa Bu Inem bantu hari ini? Kakak bisa tanya seputar **menu jajanan pasar hari ini**, **paket snack box rapat/acara**, atau **cek status pesanan** dengan mengetik nomor order nggih! 🙏",
  timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
};

const QUICK_PROMPTS = [
  "🍪 Menu jajanan terlaris apa saja?",
  "📦 Rekomendasi snack box rapat kantor",
  "🎋 Berapa harga paket jajanan tampah?",
  "⏰ Jam buka dan lokasi toko di mana?",
];

export default function HumanAgentCircleButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);
    setHasInteracted(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const botReply =
        data.reply ||
        "Nggih kak, pesan sudah Bu Inem terima. Ada hal lain yang bisa Bu Inem bantu seputar jajanan pasar kami?";

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: "assistant",
        content: botReply,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content:
          "Mohon maaf nggih kak, jaringan Bu Inem agak terputus sebentar. Boleh diulang pertanyaannya atau hubungi WhatsApp Bu Inem di **0812-3456-7890** ya kak! 🙏",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    setInputMessage("");
  };

  return (
    <>
      {/* 1. Floating Circle Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end select-none">
        {/* Warm Greeting Badge for New Visitors */}
        {!isOpen && !hasInteracted && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-amber-200 text-stone-800 rounded-full shadow-lg cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 text-xs font-medium animate-bounce"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Tanya Bu Inem (Asisten Ramah 24/7)</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Tutup Asisten Bu Inem" : "Buka Tanya Bu Inem"}
          className={`relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-300 ${
            isOpen
              ? "bg-stone-800 text-white hover:bg-stone-900 rotate-90"
              : "bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-white hover:scale-105 shadow-amber-500/40 ring-4 ring-white"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              {/* Smiling Traditional Chef / Mother Icon & Pulse Ring */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl" role="img" aria-label="Ibu Inem">
                  👵
                </span>
                <span className="text-[9px] font-black uppercase tracking-tight text-amber-950 mt-[-2px] bg-amber-200/90 px-1 rounded-sm">
                  Inem
                </span>
              </div>

              {/* Online Green Pulsing Indicator */}
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* 2. Interactive Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-amber-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl shadow-inner border-2 border-white">
                👵
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  Bu Inem (Asisten Ramah)
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                </h3>
                <p className="text-[11px] text-amber-100 font-medium">
                  Online • Siap Melayani dengan Hangat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Mulai Percakapan Baru"
                className="p-1.5 text-amber-100 hover:text-white hover:bg-amber-700/40 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup Obrolan"
                className="p-1.5 text-amber-100 hover:text-white hover:bg-amber-700/40 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#faf9f5] space-y-3.5 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-amber-500 text-white rounded-br-none"
                      : "bg-white text-stone-800 border border-stone-200/80 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-stone-500 text-xs italic bg-white/80 border border-amber-100 px-3 py-2 rounded-2xl w-fit">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                </div>
                <span>Bu Inem sedang meracik jawaban...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-700 border border-stone-200/80 hover:border-amber-300 rounded-full transition-colors shadow-2xs disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanya menu, paket snack box, status order..."
              disabled={isLoading}
              className="flex-1 bg-stone-100 focus:bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-transparent focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              aria-label="Kirim Pesan"
              className="p-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-full transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
