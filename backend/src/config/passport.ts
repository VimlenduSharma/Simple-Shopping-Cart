import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { env } from './env';
import { prisma } from './db';

interface JwtPayload {
  sub: string;   // userId (issued when the token is created)
  iat: number;
  exp: number;
}

export default function configurePassport(passport: PassportStatic): void {
  /* ------------------------------------------------------------------------ */
  /* 1. Tell Passport where to find the token & how to verify it              */
  /* ------------------------------------------------------------------------ */
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      /** Custom extractor:
       *  – First look for  Authorization: Bearer <token>
       *  – Fallback to signed/regular cookie  token=<token>
       */
      (req) => {
        let token: string | null = null;

        /* Header */
        if (req?.headers?.authorization?.startsWith('Bearer ')) {
          token = req.headers.authorization.split(' ')[1];
        }
        /* Cookie */
        if (!token && req?.cookies?.token) {
          token = req.cookies.token as string;
        }
        return token;
      },
    ]),
    secretOrKey: env.JWT_SECRET,
  };

  /* ------------------------------------------------------------------------ */
  /* 2. Strategy verify callback                                              */
  /* ------------------------------------------------------------------------ */
  passport.use(
    new JwtStrategy(opts, async (payload: JwtPayload, done) => {
      try {
        /* Find the user referenced by  payload.sub  */
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });

        if (!user) {
          return done(null, false);                // no user ⇒ 401
        }
        return done(null, user);                   // attaches user to req.user
      } catch (err) {
        return done(err, false);                   // DB error ⇒ 500
      }
    }),
  );
}