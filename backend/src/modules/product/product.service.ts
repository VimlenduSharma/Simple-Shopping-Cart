import { Prisma } from '@prisma/client';

import {
  ProductModel,
  ProductFilters,
  Pagination,
  PublicProduct,
} from './product.model';
import { ApiError } from '../../utils/apiError';

export async function listProducts(
  filters: ProductFilters = {},
  pagination: Pagination = {},
) {
  return ProductModel.list(filters, pagination, { createdAt: 'desc' }, publicSelect);
}

export async function getProduct(identifier: { id?: string; slug?: string }): Promise<PublicProduct> {
  const { id, slug } = identifier;

  const product = id
    ? await ProductModel.findById(id, publicSelect)
    : slug
    ? await ProductModel.findBySlug(slug, publicSelect)
    : null;

  if (!product) throw new ApiError(404, 'Product not found');
  return product as PublicProduct;
}

export function createProduct(data: Prisma.ProductCreateInput) {
  return ProductModel.create(data, publicSelect);
}

/** updateProduct – Admin-only */
export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  const existing = await ProductModel.findById(id);
  if (!existing) throw new ApiError(404, 'Product not found');

  return ProductModel.update(id, data, publicSelect);
}

export async function deleteProduct(id: string): Promise<void> {
  const existing = await ProductModel.findById(id);
  if (!existing) throw new ApiError(404, 'Product not found');

  await ProductModel.delete(id);
}

const publicSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  description: true,
  images: true,
  stock: true,
  rating: true,
  ratingCount: true,
  categoryId: true,
  createdAt: true,
};