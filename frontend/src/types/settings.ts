export interface BusinessSettings {
  id?: number;
  businessName: string;
  tagline?: string;
  description?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  customerServiceEmail?: string;
  logoUrl?: string;
  website?: string;
  taxRate: number;
  currency: string;
  receiptFooter?: string;
  socialMedia?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  businessName: "UMKM Bu Inem",
  tagline: "Solusi Digital & Layanan UMKM Terpercaya",
  description: "Platform layanan digital, transformasi teknologi, dan pemberdayaan bisnis UMKM Indonesia.",
  address: "Jl. Malioboro No. 45, D.I. Yogyakarta 55271",
  phone: "0812-3456-7890",
  whatsapp: "6281234567890",
  email: "halo@bu-inem.com",
  customerServiceEmail: "cs@bu-inem.com",
  website: "https://bu-inem.com",
  taxRate: 0,
  currency: "IDR",
  receiptFooter: "Terima kasih telah mempercayakan pertumbuhan bisnis Anda bersama UMKM Bu Inem.",
};
