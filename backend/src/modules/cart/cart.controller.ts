import { Request, Response, NextFunction } from 'express';
import {
  getUserCart,
  addItemToCart,
  updateCartItemQty,
  removeItemFromCart,
  clearUserCart,
} from './cart.service';

export async function getCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cart = await getUserCart(req.user!.id);
    res.json({ status: 'success', ...cart });
  } catch (err) {
    next(err);
  }
}

export async function addToCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId, qty } = req.body as { productId: string; qty?: number };
    const cart = await addItemToCart({
      userId: req.user!.id,
      productId,
      qty,
    });
    res.status(201).json({ status: 'success', ...cart });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { itemId } = req.params;
    const { qty } = req.body as { qty: number };
    const cart = await updateCartItemQty({
      userId: req.user!.id,
      itemId,
      qty,
    });
    res.json({ status: 'success', ...cart });
  } catch (err) {
    next(err);
  }
}

export async function removeFromCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { itemId } = req.params;
    const cart = await removeItemFromCart(req.user!.id, itemId);
    res.json({ status: 'success', ...cart });
  } catch (err) {
    next(err);
  }
}

export async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cart = await clearUserCart(req.user!.id);
    res.json({ status: 'success', ...cart });
  } catch (err) {
    next(err);
  }
}