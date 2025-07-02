import { Prisma, Order, OrderItem } from '@prisma/client';
import { prisma } from '../../config/db';

export const orderSelect = {
  id: true,
  status: true,
  total: true,
  shipping: true,
  paymentInfo: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      productId: true,
      name: true,          // snapshot name
      price: true,         // snapshot price
      quantity: true,
    },
  },
} satisfies Prisma.OrderSelect;

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export const OrderModel = {
  /** Create a brand-new order (used in checkout flow) */
  create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({ data, select: orderSelect });
  },

  /** Fetch a single order by id & user (ensures privacy) */
  findById(id: string, userId: string) {
    return prisma.order.findFirst({
      where: { id, userId },
      select: orderSelect,
    });
  },

  /** List all orders for a user, newest first */
  listByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: orderSelect,
    });
  },

  /** Update order status (e.g., admin dashboard or webhook) */
  updateStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status },
      select: orderSelect,
    });
  },
};