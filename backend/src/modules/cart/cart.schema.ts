import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  qty:       z.number().int().positive().optional().default(1),
});

export const updateQtySchema = z.object({
  qty: z.number().int().positive(),
});
