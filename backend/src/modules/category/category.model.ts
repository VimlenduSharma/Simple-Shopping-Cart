import { Prisma, Category } from '@prisma/client';
import { prisma } from '../../config/db';

export type PublicCategory = Pick<Category, 'id' | 'name'>;

export const CategoryModel = {
  /** List all categories (alphabetical) */
  listAll(): Promise<PublicCategory[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  },

  /** Find by primary key */
  findById(id: string): Promise<PublicCategory | null> {
    return prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  },

  /** Create (admin task) */
  create(data: Prisma.CategoryCreateInput): Promise<PublicCategory> {
    return prisma.category.create({
      data,
      select: { id: true, name: true },
    });
  },

  /** Update (admin task) */
  update(id: string, data: Prisma.CategoryUpdateInput): Promise<PublicCategory> {
    return prisma.category.update({
      where: { id },
      data,
      select: { id: true, name: true },
    });
  },

  /** Delete (admin task) */
  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};