import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export function jwtAuth(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: unknown, user: Express.User | false) => {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Unauthorized (invalid token)' });
      }

      req.user = user; //  <-- Type-safe after the declaration merge below
      return next();
    },
  )(req, res, next);
}