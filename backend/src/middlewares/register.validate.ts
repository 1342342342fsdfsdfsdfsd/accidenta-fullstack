import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

const usuarioSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
  nombre: z.string().nonempty('El nombre es obligatorio'),
  apellido: z.string().nonempty('El apellido es obligatorio'),
  fechaNacimiento: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha de nacimiento inválida'),
  telefono: z.string().nonempty('Teléfono es obligatorio'),
  email: z.email({ message: 'Email inválido' }),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type UsuarioRegisterDTO = z.infer<typeof usuarioSchema>;

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: UsuarioRegisterDTO = usuarioSchema.parse(req.body);

    if (!req.file) {
      req.file = {
        fieldname: 'imagen',
        originalname: 'default.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'uploads/', // carpeta donde tengas las imágenes
        filename: 'default.png', // nombre de la imagen por defecto
        path: 'uploads/default.png', // ruta completa
        size: 0, // tamaño (puede quedar en 0 si no importa)
      } as Express.Multer.File;
    }

    req.body = data;
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
