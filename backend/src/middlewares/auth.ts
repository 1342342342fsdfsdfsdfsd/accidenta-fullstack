import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1]; // formato "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET! || 'secreto') as {
      id: string;
      email: string;
      iat: number;
      exp: number;
    };
    (req as unknown as AuthenticatedRequest).user = decoded;
    next();
  } catch (_) {
    return res.status(401).json({ error: 'Token no válido o expirado' });
  }
}
