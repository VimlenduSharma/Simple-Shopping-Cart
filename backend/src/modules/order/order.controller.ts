import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/apiResponse';

import {
  placeOrder,
  listUserOrders,
  getOrderById,
} from './order.service';

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await placeOrder({
      userId: req.user!.id,
      shipping:   req.body.shipping,
      paymentInfo: req.body.paymentInfo,
    });
    res.status(201).json({ status: 'success', order });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const orders = await listUserOrders(req.user!.id);
    return sendSuccess(res, { orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const order = await getOrderById(req.user!.id, req.params.id);
    return sendSuccess(res, { order });
  } catch (err) {
    next(err);
  }
}