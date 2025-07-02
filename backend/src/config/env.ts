
import { config as loadEnv } from 'dotenv';
import path from 'path';
import { z } from 'zod';


loadEnv({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  /* Networking ----------------------------------------------------------- */
  PORT: z
    .preprocess(
      (val) => (val ? Number(val) : 4000),
      z
        .number()
        .int()
        .min(1, 'PORT must be between 1 and 65535')
        .max(65535, 'PORT must be between 1 and 65535'),
    ),

  /* Security ------------------------------------------------------------- */
  JWT_SECRET: z
    .string()
    .min(10, 'JWT_SECRET must be at least 10 characters long'),

  /* CORS ----------------------------------------------------------------- */
  CORS_ORIGIN: z
    .string()
    .url('CORS_ORIGIN must be a valid URL')
    .default('http://localhost:5173'),

  /* Database ------------------------------------------------------------- */
  DATABASE_URL: z.string().url(),

  /* Payments (optional) --------------------------------------------------- */
  STRIPE_SECRET_KEY: z.string().optional(),

  /* HTTPS (optional) ------------------------------------------------------ */
  SSL_KEY_PATH: z.string().optional(),
  SSL_CERT_PATH: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // zod gives rich error info; flatten for readability
  console.error(
    '❌ Invalid or missing environment variables:\n',
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export type Env = z.infer<typeof envSchema>;

export const env: Readonly<Env> = Object.freeze(parsed.data);

/* Convenient helpers (non-critical) ------------------------------------- */
export const isProd = env.NODE_ENV === 'production';
export const isDev  = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
