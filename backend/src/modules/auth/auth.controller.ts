import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendSuccess } from '../../utils/apiResponse';

import { prisma } from '../../config/db';
import { env, isProd } from '../../config/env';
import { ApiError } from '../../utils/apiError';
import { registerUser, authenticateUser } from './auth.service';

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function signJwt(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '7d' });
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  });
}

/** POST /api/auth/register */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // delegate all business logic to the service
    const { user, token } = await registerUser(req.body);
    setAuthCookie(res, token);           // attach JWT as http-only cookie
    res.status(201).json({ status: 'success', user });
  } catch (err) {
    next(err);
  }
}

/** POST /api/auth/login */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { user, token } = await authenticateUser(req.body);
    setAuthCookie(res, token);           // attach JWT as http-only cookie
    res.json({ status: 'success', user });
  } catch (err) {
    next(err);
  }
}

/** GET /api/auth/me  (protected) */
export async function getMe(
  req: Request,
  res: Response,
): Promise<void> {
  res.json({ status: 'success', user: req.user });
}

/** POST /api/auth/logout */
export async function logout(
  _req: Request,
  res: Response,
): Promise<void> {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
  });
  res.json({ status: 'success', message: 'Logged out' });
}