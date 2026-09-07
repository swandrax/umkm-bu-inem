import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Nama pelanggan wajib diisi").max(100, "Maksimal 100 karakter"),
  phone: z.string().max(20, "Maksimal 20 karakter").optional().or(z.literal("")),
  address: z.string().max(255, "Maksimal 255 karakter").optional().or(z.literal("")),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
