import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(100, "Maksimal 100 karakter"),
  description: z.string().max(255, "Maksimal 255 karakter").optional().or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
