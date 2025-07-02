import { Prisma, OrderItem } from '@prisma/client';
import { prisma } from '../../config/db';

export const orderItemSelect = {
  id: true,
  orderId: true,
  productId: true,
  name: true,
  price: true,
  quantity: true,
} satisfies Prisma.OrderItemSelect;


export const OrderItemModel = {
  /** Bulk-create many items at once (used at checkout) */
  createMany(items: Prisma.OrderItemCreateManyInput[]) {
    return prisma.orderItem.createMany({ data: items });
  },

  /** Fetch all items for a particular order */
  listByOrder(orderId: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: { orderId },
      select: orderItemSelect,
    });
  },

  /** Fetch all items for all orders of a user (reporting helper) */
  listByUser(userId: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: { order: { userId } },
      select: orderItemSelect,
    });
  },

  /** Top-selling products (simple example report) */
  topSellingProducts(limit = 10) {
    return prisma.orderItem.groupBy({
      by: ['productId', 'name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });
  },
};