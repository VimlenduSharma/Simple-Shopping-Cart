import { Router } from 'express';
import { jwtAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

import { getMe, updateMe, deleteMe } from './user.controller';
import { updateProfileSchema } from './user.schema';

const router = Router();

router.get('/me', jwtAuth, getMe);
router.put('/me', jwtAuth, validate({ body: updateProfileSchema }), updateMe);
router.delete('/me', jwtAuth, deleteMe);

export default router;
