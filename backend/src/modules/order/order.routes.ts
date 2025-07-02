import { Router } from 'express';
import { jwtAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

import {
  createOrder,
  getMyOrders,
  getOrder,
} from './order.controller';

import { createOrderSchema } from './order.schema';

const router = Router();

router.use(jwtAuth);              // all order routes require auth

router.post('/', validate({ body: createOrderSchema }), createOrder);
router.get('/',  getMyOrders);
router.get('/:id', getOrder);

export default router;
