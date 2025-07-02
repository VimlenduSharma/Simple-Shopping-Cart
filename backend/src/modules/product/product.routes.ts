import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';

import {
  getProducts,
  getSingleProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from './product.controller';

import {
  createProductSchema,
  updateProductSchema,
} from './product.schema';

const router = Router();

router.get('/',         getProducts);
router.get('/:idOrSlug', getSingleProduct);

/* Admin-only (add your own `adminAuth` middleware before these) */
router.post('/',  /* adminAuth, */ validate({ body: createProductSchema }), createProductHandler);
router.put('/:id', /* adminAuth, */ validate({ body: updateProductSchema }), updateProductHandler);
router.delete('/:id', /* adminAuth, */ deleteProductHandler);

export default router;