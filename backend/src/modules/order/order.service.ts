import { Prisma } from '@prisma/client';
import {  prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';
import { CartItemModel } from '../cart/cartItem.model';
import { OrderModel, orderSelect } from './order.model';

export type ShippingInfo = {
  fullName:   string;
  address1:   string;
  address2?:  string;
  city:       string;
  state:      string;
  postalCode: string;
  country:    string;
  phone?:     string;
};


export type PlaceOrderParams = {
  userId:      string;
  shipping:    ShippingInfo;
  paymentInfo: unknown;  
};


export async function placeOrder(
  params: PlaceOrderParams,
): Promise<Prisma.OrderGetPayload<{ select: typeof orderSelect }>> {
  const { userId, shipping, paymentInfo } = params;

  // 1. Fetch and validate cart
  const cartItems = await CartItemModel.listByUser(userId);
  if (cartItems.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }
  for (const ci of cartItems) {
    if (ci.product.stock < ci.quantity) {
      throw new ApiError(400, `Insufficient stock for ${ci.product.name}`);
    }
  }

  // 2. Compute total (snapshot prices)
  const subtotal = cartItems.reduce(
    (sum, ci) => sum + ci.product.price.toNumber() * ci.quantity,
    0,
  );
  const totalDecimal = new Prisma.Decimal(subtotal); // ensures correct Decimal type

  // 3. Transaction: create order + items, decrement stock, clear cart
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total: totalDecimal,
        shipping:    shipping    as Prisma.InputJsonValue,
        paymentInfo: paymentInfo as Prisma.InputJsonValue,
        items: {
          createMany: {
            data: cartItems.map((ci) => ({
              productId: ci.productId,
              name:      ci.product.name,
              price:     ci.product.price,
              quantity:  ci.quantity,
            })),
          },
        },
      },
      select: orderSelect,
    });

    // decrement stock
    await Promise.all(
      cartItems.map((ci) =>
        tx.product.update({
          where: { id: ci.productId },
          data:  { stock: { decrement: ci.quantity } },
        }),
      ),
    );

    // clear cart
    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  return order;
}

/** Fetch a single order (must belong to the user) */
export async function getOrderById(
  userId: string,
  orderId: string,
) {
  const order = await OrderModel.findById(orderId, userId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  return order;
}

/** List all orders for a given user */
export function listUserOrders(userId: string) {
  return OrderModel.listByUser(userId);
}
