import { z } from "zod";

export const OrderSchema = z.object({
  item: z.string().min(1),
  price: z.number().positive(),
});
