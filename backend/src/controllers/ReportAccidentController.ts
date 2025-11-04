import { Request, Response } from 'express';
import { DB } from '../config/db';
import { UsuarioCivil } from '../models/User';
import { ReporteService } from '../services/ReporteService';
import { AuthenticatedRequest } from '../types/authenticatedRequest';
import { AccidentReportBodyDTO, AccidenteReportDTO } from './dtos/AccidentReportDTO';

export class ReporteController {
  private accidentReportService: ReporteService;

  constructor() {
    this.accidentReportService = new ReporteService();
  }

  public createAccidentReport = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as unknown as AuthenticatedRequest;
    const files = req.files as Express.Multer.File[];
    const imagePaths = files.map((f) => f.filename);
    try {
      const formularioCreado = await this.accidentReportService.create(
        req.body,
        imagePaths,
        authReq.user.id,
      );

      res.status(201).json(formularioCreado);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public createUrgencia = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as unknown as AuthenticatedRequest;

    try {
      const userRepository = DB.getRepository(UsuarioCivil);
      const usuario = await userRepository.findOneBy({ id: authReq.user.id });

      if (!usuario) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      if (!req.body.ubicacion) {
        res.status(400).json({ message: 'La ubicación es obligatoria' });
        return;
      }

      const data: AccidentReportBodyDTO = {
        tipoAccidente: 'urgencia',
        dni: usuario.dni,
        ubicacion: req.body.ubicacion,
        descripcion: 'Situacion de emergencia que necesita ayuda inmediata.',
      };

      const reporteEntidad = AccidenteReportDTO.toModel(data, usuario);
      const urgenciaCreada = await this.accidentReportService.create(
        reporteEntidad,
        [],
        usuario.id,
      );

      res.status(201).json(AccidenteReportDTO.fromModel(urgenciaCreada));
    } catch (err) {
      if (!res.headersSent) {
        if (err instanceof Error) res.status(400).json({ message: err.message });
        else res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  };

  public getAllAccidentReportsCreatedByUser = async (req: Request, res: Response) => {
    const authReq = req as unknown as AuthenticatedRequest;
    const lastId = req.query.lastId as string | undefined;
    try {
      const { items, lastCursor } = await this.accidentReportService.getReportsByUser(
        authReq.user.id,
        lastId,
        10,
      );
      res.status(200).json({ items, lastCursor });
      console.log(JSON.stringify(items[0], null, 2), 'ITEM FIRST');
      // console.log(items, 'ITEMS');
      // console.log(lastCursor, 'LAST CURSOR');
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  public getAllAccidentReportsInvolvedUser = async (req: Request, res: Response) => {
    const authReq = req as unknown as AuthenticatedRequest;
    const lastId = req.query.lastId as string | undefined;
    try {
      const { items, lastCursor } = await this.accidentReportService.getReportsInvolvingUser(
        authReq.user.id,
        lastId,
        10,
      );

      res.status(200).json({ items, lastCursor });
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
}
