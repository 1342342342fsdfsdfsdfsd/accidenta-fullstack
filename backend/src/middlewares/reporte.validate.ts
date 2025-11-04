import { z, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const reporteSchema = z.object({
  tipoAccidente: z.string().nonempty('Tipo de accidente es obligatorio'),
  dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
  descripcion: z.string().min(10, 'Descripción mínima 10 caracteres'),
  ubicacion: z.string().nonempty('Ubicación es obligatoria'),
});

export const validateReporteForm = (req: Request, res: Response, next: NextFunction) => {
  try {
    reporteSchema.parse(req.body);
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
