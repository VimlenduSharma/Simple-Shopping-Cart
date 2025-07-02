import { Prisma, Product } from '@prisma/client';
import { prisma } from '../../config/db';

export type ProductFilters = {
  q?: string;          // search by name/description
  categoryId?: string; // filter by category
  minPrice?: number;
  maxPrice?: number;
};

export type Pagination = {
  page?: number;  // 1-based page index
  limit?: number; // per-page items
};

export type PublicProduct = Pick<
  Product,
  | 'id'
  | 'name'
  | 'slug'
  | 'price'
  | 'description'
  | 'images'
  | 'stock'
  | 'rating'
  | 'ratingCount'
  | 'categoryId'
  | 'createdAt'
>;

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { description: { contains: filters.q } },
    ];
  }

  if (filters.categoryId) where.categoryId = filters.categoryId;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  return where;
}


export const ProductModel = {
  /** Create product */
  create(data: Prisma.ProductCreateInput, select?: Prisma.ProductSelect) {
    return prisma.product.create({ data, ...(select && { select }) });
  },

  /** Fetch by primary key */
  findById(id: string, select?: Prisma.ProductSelect) {
    return prisma.product.findUnique({ where: { id }, ...(select && { select }) });
  },

  /** Fetch by slug */
  findBySlug(slug: string, select?: Prisma.ProductSelect) {
    return prisma.product.findUnique({ where: { slug }, ...(select && { select }) });
  },

  /** Update product */
  update(id: string, data: Prisma.ProductUpdateInput, select?: Prisma.ProductSelect) {
    return prisma.product.update({ where: { id }, data, ...(select && { select }) });
  },

  /** Delete product */
  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  async list(
    filters: ProductFilters = {},
    { page = 1, limit = 20 }: Pagination = {},
    orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' },
    select?: Prisma.ProductSelect,
  ) {
    const where = buildWhere(filters);
    const take = limit;
    const skip = (page - 1) * limit;

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        take,
        skip,
        ...(select && { select }),
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  },
};