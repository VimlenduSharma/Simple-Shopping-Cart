import { z } from 'zod';

const name        = z.string().min(1);
const slug        = z.string().min(1);
const price       = z.number().positive();
const description = z.string().min(1);
const images      = z.array(z.string().url()).min(1);
const stock       = z.number().int().nonnegative();
const categoryId  = z.string().cuid();

export const createProductSchema = z.object({
  name,
  slug,
  price,
  description,
  images,
  stock,
  categoryId,
});

export const updateProductSchema = createProductSchema.partial();