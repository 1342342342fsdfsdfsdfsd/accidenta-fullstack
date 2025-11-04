import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private authService: AuthService = new AuthService()) {}

  public registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const usuarioData = {
        ...req.body,
        imagen: req.file?.filename || 'default.png',
      };

      await this.authService.register(usuarioData);

      return res.status(201).json({ message: 'Usuario registrado' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        switch (err.message) {
          case 'El email ya esta registrado.':
            return res.status(409).json({ message: err.message });
          case 'El DNI ya esta registrado.':
            return res.status(409).json({ message: err.message });
        }
      }
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);

      res.setHeader('Access-Control-Expose-Headers', 'Authorization');
      res.setHeader('Authorization', `Bearer ${token}`);

      return res.json({ token });
    } catch (err) {
      if (err instanceof Error) {
        let status = 500;

        if (err.message === 'BAD_REQUEST') status = 400;
        if (err.message === 'NOT_FOUND') status = 404;

        if (status === 400 || status === 404) {
          return res.status(status).json({ message: 'Email o contraseña incorrectos.' });
        }
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  };
}
