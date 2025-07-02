import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

type Schemas = {
  body?:   ZodTypeAny;
  query?:  ZodTypeAny;
  params?: ZodTypeAny;
};

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        // Collate all issues into a single message
        const message = err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
        return next(new ApiError(400, `Validation Error: ${message}`));
      }
      return next(err);
    }
  };
}
