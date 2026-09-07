import { z } from "zod";

export const productSchema = z.object({
  code: z.string().min(1, "Kode produk wajib diisi").max(50, "Maksimal 50 karakter"),
  name: z.string().min(1, "Nama produk wajib diisi").max(150, "Maksimal 150 karakter"),
  categoryId: z.coerce.number({ invalid_type_error: "Kategori wajib dipilih" }).min(1, "Pilih kategori produk"),
  price: z.coerce.number({ invalid_type_error: "Harga wajib diisi angka" }).min(0, "Harga tidak boleh minus"),
  stock: z.coerce.number({ invalid_type_error: "Stok wajib diisi angka" }).min(0, "Stok tidak boleh minus"),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
