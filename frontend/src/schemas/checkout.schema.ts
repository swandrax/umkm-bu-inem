import { z } from "zod";

export const checkoutSchema = z.object({
  customerId: z.number().nullable().optional(),
  paymentMethod: z.enum([
    "CASH",
    "QRIS",
    "TRANSFER",
    "DEBIT",
    "OVO",
    "GOPAY",
    "DANA",
    "SHOPEEPAY",
  ]),
  cashAmount: z.number().min(0, "Nominal pembayaran tidak boleh minus"),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
