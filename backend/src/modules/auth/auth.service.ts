import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

import { prisma } from '../../config/db';
import { env, isProd } from '../../config/env';
import { ApiError } from '../../utils/apiError';

const COOKIE_NAME   = 'token';
const COOKIE_MAX_MS = 7 * 24 * 60 * 60 * 1000;

function signJwt(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '7d' });
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure:  isProd,
    sameSite: 'lax',
    maxAge:  COOKIE_MAX_MS,
  });
}

export function getPublicUser<T extends { passwordHash?: unknown }>(
  user: T,
): Omit<T, 'passwordHash'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...publicUser } = user as any;
  return publicUser;
}

/* -------------------------------------------------------------------------- */
/* Main Service Methods                                                       */
/* -------------------------------------------------------------------------- */

/** Register new account and return `{ user, token }` */
export async function registerUser(args: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const { email, password, firstName, lastName } = args;

  /* Check duplicates */
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, 'Email already registered');

  /* Hash pwd & store */
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName },
  });

  const token = signJwt(user.id);
  return { user: getPublicUser(user), token };
}

/** Validate credentials and return `{ user, token }` */
export async function authenticateUser(args: {
  email: string;
  password: string;
}) {
  const { email, password } = args;

  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const token = signJwt(user.id);
  return { user: getPublicUser(user), token };
}