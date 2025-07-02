import { PrismaClient } from '@prisma/client';
import { isProd } from './env';

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

const prisma =
  global.__prisma__ ||
  new PrismaClient({
    log: isProd ? ['error'] : ['query', 'error', 'warn'],
  });

if (!isProd) {
  global.__prisma__ = prisma; // preserve across hot-reloads
}

/* ----------------------------------------------------------------------
   Helper wrappers – optional but convenient
---------------------------------------------------------------------- */
export async function connectDB(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}

/* ----------------------------------------------------------------------
   Most modules will just import { prisma } directly
---------------------------------------------------------------------- */
export { prisma };