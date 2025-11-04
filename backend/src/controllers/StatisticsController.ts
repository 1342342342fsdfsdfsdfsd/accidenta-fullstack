import { Request, Response } from 'express';
import { StatisticsService } from '../services/StatisticsService';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }
  public getTotalAccidentes = async (req: Request, res: Response) => {
    try {
      const rangeValue = this.parseRange(req.query.range as string);

      const amount = await this.statisticsService.getTotalAccidentes(rangeValue);

      res.status(200).json({
        amount: amount,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Error interno del servidor al obtener el total de accidentes.',
      });
    }
  };

  public getTypeAccidentTop = async (req: Request, res: Response) => {
    try {
      const rangeValue = this.parseRange(req.query.range as string);
      const mostFrequentType = await this.statisticsService.getTipoAccidenteTop(rangeValue);

      if (mostFrequentType) {
        res.status(200).json({
          type: mostFrequentType.type,
          amount: mostFrequentType.amount,
        });
      } else {
        res.status(200).json({
          type: null,
          amount: 0,
          message: 'No hay reportes de accidentes registrados.',
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Error interno del servidor al obtener estadísticas.',
      });
    }
  };

  public getZonaTop = async (req: Request, res: Response) => {
    try {
      const rangeValue = this.parseRange(req.query.range as string);

      const topZona = await this.statisticsService.getZonaTop(rangeValue);

      if (topZona) {
        res.status(200).json({
          zone: topZona.zone,
          amount: topZona.amount,
        });
      } else {
        res.status(200).json({
          zone: null,
          amount: 0,
          message: 'No hay reportes de accidentes registrados en este período.',
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Error interno del servidor al obtener la zona con más reportes.',
      });
    }
  };

  // Función privada para validar y parsear el rango
  private parseRange(range?: string | string[]): 'day' | 'week' | 'month' | undefined {
    const allowedRanges = ['day', 'week', 'month'] as const;
    if (typeof range === 'string' && allowedRanges.includes(range as 'week' | 'day' | 'month')) {
      return range as 'day' | 'week' | 'month';
    }
    return undefined;
  }
}
