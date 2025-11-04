import { z } from 'zod';

export const createContactoSchema = z.object({
  mail: z.email('Email inválido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
});

export const updateContactoSchema = z.object({
  mail: z.email('Email inválido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
});
