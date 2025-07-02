import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { jwtAuth } from '../../middlewares/auth.middleware';

import {
  register,
  login,
  getMe,
  logout,
} from './auth.controller';

import {
  registerSchema,
  loginSchema,
} from './auth.schema';

const router = Router();

router.post('/register', validate({ body: registerSchema }), register);
router.post('/login',    validate({ body: loginSchema }),    login);

/* -------------------------------------------------------------------------- */
/* Protected routes                                                           */
/* -------------------------------------------------------------------------- */
router.get('/me',     jwtAuth, getMe);
router.post('/logout', jwtAuth, logout);

export default router;