import { NextFunction, Request, Response } from 'express';
import { z, ZodError, ZodType } from 'zod';

export const validate =
  <T extends ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as z.infer<T>; // tipado seguro
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        }));
        return res.status(400).json({ errors });
      }
      next(err);
    }
  };
