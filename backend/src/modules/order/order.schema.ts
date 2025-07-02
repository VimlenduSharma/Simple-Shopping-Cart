import { z } from 'zod';

export const shippingSchema = z.object({
  fullName:    z.string().min(1),
  address1:    z.string().min(1),
  address2:    z.string().optional(),
  city:        z.string().min(1),
  state:       z.string().min(1),
  postalCode:  z.string().min(1),
  country:     z.string().min(1),
  phone:       z.string().optional(),
});

export const createOrderSchema = z.object({
  shipping:    shippingSchema,
  paymentInfo: z.any(), // Stripe PaymentIntent snapshot, etc.
});
