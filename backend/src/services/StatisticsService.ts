import { DB } from '../config/db';
import { Reporte } from '../models/reporte';

export class StatisticsService {
  private accidentReportRepo = DB.getRepository(Reporte);

  public getTipoAccidenteTop = async (
    range?: Range,
  ): Promise<{ type: string; amount: number } | null> => {
    const query = this.accidentReportRepo
      .createQueryBuilder('reporte')
      .select('reporte.tipoAccidente', 'type')
      .addSelect('COUNT(reporte.tipoAccidente)', 'amount')
      .groupBy('reporte.tipoAccidente')
      .orderBy('amount', 'DESC')
      .limit(1);

    // Aplicar filtro de rango de fechas
    if (range === 'day') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 day'`);
    } else if (range === 'week') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '7 days'`);
    } else if (range === 'month') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 month'`);
    }

    const result = await query.getRawOne<{ type: string; amount: string }>();

    return result ? { type: result.type, amount: Number(result.amount) } : null;
  };

  public getTotalAccidentes = async (range?: Range): Promise<number> => {
    const query = this.accidentReportRepo
      .createQueryBuilder('reporte')
      .select('COUNT(*)', 'amount');

    // Aplicar filtro de rango de fechas
    if (range === 'day') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 day'`);
    } else if (range === 'week') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '7 days'`);
    } else if (range === 'month') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 month'`);
    }

    const result = await query.getRawOne<{ amount: string }>();

    return result ? Number(result.amount) : 0;
  };

  public getZonaTop = async (range?: Range): Promise<{ zone: string; amount: number } | null> => {
    const query = this.accidentReportRepo
      .createQueryBuilder('reporte')
      .select("TRIM(SPLIT_PART(reporte.ubicacion, ',', 2))", 'zone')
      .addSelect('COUNT(*)', 'amount')
      .groupBy("TRIM(SPLIT_PART(reporte.ubicacion, ',', 2))")
      .orderBy('amount', 'DESC')
      .limit(1);

    // Filtro por rango de fechas
    if (range === 'day') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 day'`);
    } else if (range === 'week') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '7 days'`);
    } else if (range === 'month') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 month'`);
    }

    const result = await query.getRawOne<{ zone: string; amount: string }>();
    return result ? { zone: result.zone, amount: Number(result.amount) } : null;
  };
}

type Range = 'day' | 'week' | 'month';
