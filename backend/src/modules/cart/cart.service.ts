import { prisma } from '../../config/db';
import { ApiError } from '../../utils/apiError';

import {
  CartItemModel,
  CartItemWithProduct,
} from './cartItem.model';

function summariseCart(items: CartItemWithProduct[]) {
  const subtotal = items.reduce(
    (acc, ci) => acc + ci.product.price.toNumber() * ci.quantity,
    0,
  );
  const itemCount = items.reduce((acc, ci) => acc + ci.quantity, 0);

  return { items, subtotal, itemCount };
}

/* -------------------------------------------------------------------------- */
/* 1. Read cart                                                               */
/* -------------------------------------------------------------------------- */
export async function getUserCart(userId: string) {
  const items = await CartItemModel.listByUser(userId);
  return summariseCart(items);
}

export async function addItemToCart(params: {
  userId: string;
  productId: string;
  qty?: number;
}) {
  const { userId, productId, qty = 1 } = params;

  if (qty <= 0) throw new ApiError(400, 'Quantity must be positive');

  /* Ensure product exists & has stock */
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stock < qty) throw new ApiError(400, 'Insufficient stock');

  /* Check if the item is already in cart */
  const existing = await CartItemModel.findByUserAndProduct(userId, productId);

  if (existing) {
    // Update quantity (additive)
    const newQty = existing.quantity + qty;
    if (product.stock < newQty)
      throw new ApiError(400, 'Quantity exceeds available stock');

    await CartItemModel.update(existing.id, userId, { quantity: newQty });
  } else {
    await CartItemModel.create({
      quantity: qty,
      user:    { connect: { id: userId } },
      product: { connect: { id: productId } },
    });
  }

  return getUserCart(userId);
}

/* -------------------------------------------------------------------------- */
/* 3. Update quantity                                                         */
/* -------------------------------------------------------------------------- */
export async function updateCartItemQty(params: {
  userId: string;
  itemId: string;
  qty: number;
}) {
  const { userId, itemId, qty } = params;

  if (qty <= 0) throw new ApiError(400, 'Quantity must be positive');

  const item = await CartItemModel.findById(itemId, userId);
  if (!item) throw new ApiError(404, 'Cart item not found');

  /* Stock check */
  const product = await prisma.product.findUnique({ where: { id: item.productId } });
  if (!product || product.stock < qty)
    throw new ApiError(400, 'Insufficient stock');

  await CartItemModel.update(itemId, userId, { quantity: qty });

  return getUserCart(userId);
}

/* -------------------------------------------------------------------------- */
/* 4. Remove single item                                                      */
/* -------------------------------------------------------------------------- */
export async function removeItemFromCart(userId: string, itemId: string) {
  const item = await CartItemModel.findById(itemId, userId);
  if (!item) throw new ApiError(404, 'Cart item not found');

  await CartItemModel.delete(itemId, userId);

  return getUserCart(userId);
}

/* -------------------------------------------------------------------------- */
/* 5. Clear cart                                                              */
/* -------------------------------------------------------------------------- */
export async function clearUserCart(userId: string) {
  await CartItemModel.clearCart(userId);
  return summariseCart([]);
}