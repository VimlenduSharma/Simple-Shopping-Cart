import { Prisma, CartItem, Product } from '@prisma/client';
import { prisma } from '../../config/db';

export type CartItemWithProduct = Pick<CartItem,
  'id' | 'quantity' | 'productId' | 'userId' | 'createdAt'
> & {
  product: Pick<Product, 'id' | 'name' | 'price' | 'images' | 'stock'>;
};

const cartSelect = {
  id: true,
  quantity: true,
  productId: true,
  userId: true,
  createdAt: true,
  product: {
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      stock: true,
    },
  },
} satisfies Prisma.CartItemSelect;

export const CartItemModel = {
  /** Get all cart items for a given user */
  listByUser(userId: string): Promise<CartItemWithProduct[]> {
    return prisma.cartItem.findMany({
      where: { userId },
      select: cartSelect,
    });
  },

  findById(id: string, userId: string) {
    return prisma.cartItem.findFirst({
      where: { id, userId },
      select: cartSelect,
    });
  },

  findByUserAndProduct(userId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: { userId, productId },
    });
  },

  /** Create a fresh cart item (assumes product & user exist) */
  create(data: Prisma.CartItemCreateInput) {
    return prisma.cartItem.create({
      data,
      select: cartSelect,
    });
  },

  /** Update quantity (or any field) */
  update(
    id: string,
    userId: string,
    data: Prisma.CartItemUpdateInput,
  ): Promise<CartItemWithProduct | null> {
    return prisma.cartItem.update({
      where: { id_userId: { id, userId } }, // compound unique if defined
      data,
      select: cartSelect,
    });
  },

  /** Delete a single cart item */
  delete(id: string, userId: string) {
    return prisma.cartItem.delete({
      where: { id_userId: { id, userId } },
    });
  },

  /** Empty entire cart for a user */
  clearCart(userId: string) {
    return prisma.cartItem.deleteMany({ where: { userId } });
  },
};