import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './category.controller';

import {
  createCategorySchema,
  updateCategorySchema,
} from './category.schema';

const router = Router();

/* Public */
router.get('/', listCategories);

/* Admin-only – add your own `adminAuth` middleware before these */
router.post('/',  /* adminAuth, */ validate({ body: createCategorySchema }), createCategory);
router.put('/:id', /* adminAuth, */ validate({ body: updateCategorySchema }), updateCategory);
router.delete('/:id', /* adminAuth, */ deleteCategory);

export default router;
