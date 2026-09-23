import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f59e0b",
};

export const metadata: Metadata = {
  title: {
    default: "Jajanan Ibu Inem - Sistem Kasir & POS UMKM Modern",
    template: "%s | Jajanan Ibu Inem",
  },
  description:
    "Aplikasi Point of Sales (POS), Kasir Cepat, dan Manajemen Operasional UMKM Jajanan Tradisional Ibu Inem.",
  keywords: [
    "POS UMKM",
    "Kasir Jajanan",
    "Jajanan Ibu Inem",
    "Point of Sales",
    "Aplikasi Kasir",
    "Kue Tradisional",
  ],
  authors: [{ name: "UMKM Jajanan Ibu Inem" }],
  creator: "Ibu Inem",
  publisher: "Jajanan Ibu Inem",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Jajanan Ibu Inem - Sistem Kasir & POS UMKM Modern",
    description:
      "Aplikasi Point of Sales (POS), Kasir Cepat, dan Manajemen Operasional UMKM Jajanan Tradisional Ibu Inem.",
    type: "website",
    locale: "id_ID",
    siteName: "Jajanan Ibu Inem POS",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
