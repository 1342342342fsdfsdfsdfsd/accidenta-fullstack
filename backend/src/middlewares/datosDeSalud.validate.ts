// src/middlewares/datosDeSalud.validate.ts

import { z } from 'zod';

export const createDatoSaludSchema = z.object({
  grupoSanguineo: z
    .string()
    .min(1, 'El grupo sanguíneo es obligatorio')
    .regex(/^(A|B|AB|O)[+-]$/, 'Debe ser un grupo sanguíneo válido (A+, O-, etc.)'),

  altura: z
    .string()
    .min(1, 'La altura es obligatoria')
    .regex(/^\d+(\.\d+)?$/, 'La altura debe ser un valor numérico positivo.')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 50 && num <= 250;
      },
      {
        message: 'La altura debe estar entre 50 y 250 cm.',
      },
    ),

  peso: z
    .string()
    .min(1, 'El peso es obligatorio')
    .regex(/^\d+(\.\d+)?$/, 'El peso debe ser un valor numérico positivo.')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 1 && num <= 500;
      },
      {
        message: 'El peso debe estar entre 1 y 500 kg.',
      },
    ),

  patologias: z
    .array(z.string().min(1, 'La patología no puede estar vacía'))
    .max(3, 'Máximo 3 patologías permitidas')
    .optional(),

  medicacion: z
    .array(z.string().min(1, 'La medicación no puede estar vacía'))
    .max(3, 'Máximo 3 medicamentos permitidos')
    .optional(),

  sexo: z
    .string()
    .min(1, 'El sexo es obligatorio')
    .regex(/^(masculino|femenino|otro)$/i, 'Sexo inválido'),

  alergias: z
    .array(z.string().min(1, 'La alergia no puede estar vacía'))
    .max(3, 'Máximo 3 alergias permitidas')
    .optional(),
});
export const updateDatoSaludSchema = createDatoSaludSchema.partial();
export type UpdateDatoSaludInput = z.infer<typeof updateDatoSaludSchema>;
