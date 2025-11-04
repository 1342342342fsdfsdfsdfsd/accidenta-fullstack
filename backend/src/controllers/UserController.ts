import { Request, Response } from 'express';
import { DB } from '../config/db';
import { UsuarioCivil } from '../models/User';
import { UsuarioService } from '../services/UsuarioService';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import { ReporteService } from '../services/ReporteService';
import { createDatoSaludSchema, updateDatoSaludSchema } from '../middlewares/datosDeSalud.validate';
export class UsuarioController {
  private usuarioService: UsuarioService;
  private reportService: ReporteService;

  constructor() {
    this.usuarioService = new UsuarioService();
    this.reportService = new ReporteService();
  }

  public getAllUsers = async (_: Request, res: Response) => {
    try {
      const usuarios = await this.usuarioService.getAll();
      res.json(usuarios);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  };

  public getUser = async (req: Request, res: Response) => {
    const authReq = req as unknown as AuthenticatedRequest;

    try {
      const userRepository = DB.getRepository(UsuarioCivil);
      const usuario = await userRepository.findOne({
        where: { id: authReq.user?.id },
      });
      const lastReport = await this.reportService.getLastReportByUserID(authReq.user.id);

      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      const { password: _, ...usuarioSinPassword } = usuario;
      return res.json({ ...usuarioSinPassword, lastReport });
    } catch (_) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public getContacts = async (req: Request, res: Response) => {
    const authReq = req as unknown as AuthenticatedRequest;
    try {
      const contactos = await this.usuarioService.getAllContactsByUserID(authReq.user.id);
      res.json(contactos);
    } catch (err: unknown) {
      console.log(err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  public addContact = async (req: Request, res: Response) => {
    const authReq = req as unknown as AuthenticatedRequest;

    try {
      const { nombre, mail } = req.body;

      const contacto = await this.usuarioService.addContact(authReq.user.id, {
        nombre: nombre,
        mail,
      });
      return res.status(201).json(contacto);
    } catch (error: unknown) {
      console.error('Error en addContact:', error);

      // Manejo seguro de errores específicos del servicio
      if (error instanceof Error) {
        const errorMessage = error.message;

        if (errorMessage.includes('No puedes usar tu propio correo como contacto de confianza')) {
          return res
            .status(400)
            .json({ message: 'No puedes agregar tu propio correo como contacto' });
        }

        if (errorMessage.includes('El contacto ya existe')) {
          return res.status(409).json({ message: 'Ya existe un contacto con ese correo' });
        }
      }

      // Error genérico para casos no manejados
      return res.status(500).json({ message: 'Error al agregar contacto' });
    }
  };

  public updateContact = async (req: Request, res: Response) => {
    const authReq = req as unknown as AuthenticatedRequest;
    const { id } = req.params;
    const { nombre, mail } = req.body;
    try {
      if (!id) {
        return res.status(400).json({ message: 'ID de contacto es requerido' });
      }

      const contacto = await this.usuarioService.updateContact(authReq.user.id, id, {
        nombre: nombre,
        mail,
      });

      return res.status(200).json(contacto);
    } catch (error: unknown) {
      console.error('Error en updateContact:', error);

      if (error instanceof Error) {
        const errorMessage = error.message;

        if (errorMessage.includes('No puedes usar tu propio correo')) {
          return res.status(400).json({ message: 'No puedes usar tu propio correo como contacto' });
        }

        if (errorMessage.includes('Ya existe otro contacto con ese correo')) {
          return res.status(409).json({ message: 'Ya existe otro contacto con ese correo' });
        }
      }

      return res.status(500).json({ message: 'Error al actualizar contacto' });
    }
  };
  public deleteContact = async (req: Request, res: Response) => {
    const authReq = req as unknown as AuthenticatedRequest;
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ message: 'ID de contacto es requerido' });
      }

      await this.usuarioService.deleteContact(authReq.user.id, id);

      return res.status(200).json({ message: 'Contacto eliminado' });
    } catch (_) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public getHealthData = async (req: Request, res: Response) => {
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const userId = authReq.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      const datoDeSalud = await this.usuarioService.getHealthData(userId);

      return res.status(200).json({
        message: 'Datos de salud obtenidos correctamente',
        datoDeSalud: datoDeSalud,
      });
    } catch (error: unknown) {
      console.error('Error al obtener los datos de salud:', error);

      if (error instanceof Error) {
        const errorMessage = error.message;

        if (errorMessage.includes('Usuario no encontrado')) {
          return res.status(404).json({ message: error.message });
        }

        if (errorMessage.includes('No hay datos de salud registrados')) {
          return res.status(404).json({ message: error.message });
        }
      }
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public addHealthData = async (req: Request, res: Response) => {
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });

      const parsedData = createDatoSaludSchema.partial().parse(req.body); // Permite valores vacíos o parciales

      const result = await this.usuarioService.addHealthData(userId, parsedData);
      return res
        .status(201)
        .json({ message: 'Dato de salud agregado correctamente', data: result });
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message;

        if (msg.includes('El usuario ya posee datos de salud registrados')) {
          return res.status(409).json({ message: msg });
        }
        if (msg.includes('no puede tener más de 3 elementos')) {
          return res.status(400).json({ message: msg });
        }
      }
      return res.status(400).json({ message: 'Error al procesar los datos de salud' });
    }
  };
  public updateHealthData = async (req: Request, res: Response) => {
    try {
      const parsedData = updateDatoSaludSchema.parse(req.body);

      if (Object.keys(parsedData).length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
      }

      const authReq = req as unknown as AuthenticatedRequest;
      const userId = authReq.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      const updateHealthData = await this.usuarioService.updateHealthData(userId, parsedData);

      return res.status(200).json({
        message: 'Datos de salud actualizados correctamente',
        data: updateHealthData,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const msg = error.message;

        if (msg.includes('Usuario no encontrado') || msg.includes('No hay datos de salud')) {
          return res.status(404).json({ message: msg });
        }
        if (msg.includes('No puede tener más de 3 elementos')) {
          return res.status(400).json({ message: msg });
        }
        return res.status(400).json({ message: msg });
      }

      console.error('Error al actualizar los datos de salud:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
