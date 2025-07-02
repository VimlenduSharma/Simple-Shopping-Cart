// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';                       // typed env loader
import logger from './config/logger';                     // pino / winston
import { errorHandler } from './middlewares/error.middleware';
import { NotFoundError } from './utils/apiError';         // custom 404 error

// -------- feature routes --------
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import productRoutes from './modules/product/product.routes';
import categoryRoutes from './modules/category/category.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/order/order.routes';

import { loggerStream } from './config/logger';
import passport from 'passport';
import configurePassport from './config/passport';


const app = express();


app.use(helmet());                          
app.use(
  cors({
    origin: env.CORS_ORIGIN,                  
    credentials: true,                        
  }),
);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: loggerStream }));
app.use(morgan('combined', { stream: loggerStream }));
app.use(express.json({ limit: '10kb' }));      // parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());                       // parse cookies

configurePassport(passport);
app.use(passport.initialize());


app.get('/api/healthcheck', (_req, res) =>
  res.status(200).json({ status: 'ok', timestamp: Date.now() }),
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


app.all('*', (_req: Request, _res: Response, next: NextFunction) =>
  next(new NotFoundError('Route not found')),
);


app.use(errorHandler);

export default app;
