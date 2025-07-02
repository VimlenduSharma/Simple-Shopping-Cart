import { Router } from 'express';
import passport from 'passport';
import { jwtAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './cart.controller';

import { addToCartSchema, updateQtySchema } from './cart.schema';

const router = Router();

router.use(jwtAuth);

router.get('/', passport.authenticate('jwt', { session: false }), getCart);
router.post('/', passport.authenticate('jwt', { session: false }), addToCart);
router.get('/', getCart);
router.post('/', validate({ body: addToCartSchema }), addToCart);
router.put('/:itemId', validate({ body: updateQtySchema }), updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);
router.get('/me', jwtAuth, (req, res) => {
  res.json({ user: req.user });
});


export default router;