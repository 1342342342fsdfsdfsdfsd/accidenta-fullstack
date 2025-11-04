import nodemailer from 'nodemailer';
import { FindOptionsWhere, LessThan } from 'typeorm';
import { DB } from '../config/db';
import { ContactoConfianza } from '../models/ContactoConfianza';
import { Reporte } from '../models/reporte';
import { UsuarioCivil } from '../models/User';
import { EstadisticaTop } from '../types/estadisticaTop';

const EMAIL = 'accidentaapp@gmail.com';

export class ReporteService {
  private contactRepo = DB.getRepository(ContactoConfianza);
  private accidentReportRepo = DB.getRepository(Reporte);
  private userRepo = DB.getRepository(UsuarioCivil);
  private transporter =
    process.env.NODE_ENV === 'test'
      ? { sendMail: async () => ({ messageId: 'test-id' }) }
      : nodemailer.createTransport({
          service: 'gmail',
          auth: { user: EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
        });

  public create = async (
    data: Reporte,
    imagesPath: string[],
    reportanteID: string,
  ): Promise<Reporte> => {
    try {
      // Buscar usuario
      const user = await this.userRepo.findOneBy({ id: reportanteID });
      if (!user) throw new Error('Usuario no encontrado');

      // Crear reporte
      const nuevoFormulario: Reporte = this.accidentReportRepo.create({
        tipoAccidente: data.tipoAccidente,
        dni: data.dni,
        ubicacion: data.ubicacion,
        descripcion: data.descripcion,
        imagenes: imagesPath,
        usuario: user,
      });

      // Buscar contactos de emergencia
      const contactos = await this.contactRepo.find({
        where: { user: { dni: data.dni } },
      });

      // Enviar emails de notificación (no bloqueante)
      if (contactos.length > 0) {
        this.enviarNotificacionesEmergencia(contactos, nuevoFormulario).catch((error) => {
          console.error('Error enviando notificaciones:', error);
          // No re-lanzamos el error para no afectar la creación del reporte
        });
      }

      return await this.accidentReportRepo.save(nuevoFormulario);
    } catch (error) {
      console.error('Error creando reporte de accidente:', error);
      throw new Error('Error al crear el reporte de accidente');
    }
  };

  private enviarNotificacionesEmergencia = async (
    contactos: ContactoConfianza[],
    reporte: Reporte,
  ): Promise<void> => {
    try {
      const emailPromises = contactos.map((contacto) => {
        const htmlBody =
          reporte.tipoAccidente === 'urgencia'
            ? this.generarTemplateUrgencia(contacto, reporte)
            : this.generarTemplateEmergencia(contacto, reporte);

        return this.transporter
          .sendMail({
            from: `Sistema de Emergencias Accidenta <${EMAIL}>`,
            to: contacto.mail,
            subject: `🚨 Alerta de Emergencia - ${reporte.usuario.nombre} necesita tu ayuda`,
            html: htmlBody,
          })
          .catch((error) => {
            console.error(`Error enviando email a ${contacto.mail}:`, error);
            throw error; // Para que Promise.allSettled lo capture como rechazado
          });
      });

      const results = await Promise.allSettled(emailPromises);

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Error enviando email a ${contactos[index].mail}:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Error en envío de notificaciones:', error);
    }
  };

  private generarTemplateEmergencia = (contacto: ContactoConfianza, reporte: Reporte): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff4444; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .alert { color: #ff4444; font-weight: bold; }
          .info { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Tuve un accidente 🚨</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${contacto.nombre}</strong>,</p>
            
            <p class="alert">${reporte.usuario.nombre} ha reportado un accidente.</p>
            
            <div class="info">
              <strong>Tipo de accidente:</strong> ${reporte.tipoAccidente}<br>
              <strong>Ubicación:</strong> ${reporte.ubicacion}<br>
              <strong>Descripción:</strong> ${reporte.descripcion}<br>
              <strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-AR')}
            </div>

            <p>Por favor, contacta al usuario para que pueda comunicarte sobre la situación.</p>
            
            <p><strong>Información de contacto:</strong><br>
            Teléfono: ${reporte.usuario.telefono}<br>
            DNI: ${reporte.usuario.dni}</p>

            <hr>
            <p style="font-size: 12px; color: #666;">
              Este es un mensaje automático. Por favor, no responda a este email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  private generarTemplateUrgencia = (contacto: ContactoConfianza, reporte: Reporte): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff4444; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .alert { color: #ff4444; font-weight: bold; }
          .info { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Tengo una urgencia 🚨</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${contacto.nombre}</strong>,</p>
            
            <p class="alert">${reporte.usuario.nombre} ha reportado una urgencia y necesita de tu ayuda lo antes posible.</p>
            
            <div class="info">
              <strong>Ubicación:</strong> ${reporte.ubicacion}<br>
              <strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-AR')}
            </div>

            <p>Por favor, contacta al usuario inmediatamente para poder tomar las acciones necesarias.</p>
            <p>Se comparte la ubicación en tiempo real del usuario para que puedan llegar al lugar a la brevedad.</p>
            
            <p><strong>Información de contacto:</strong><br>
            Teléfono: ${reporte.usuario.telefono}<br>
            DNI: ${reporte.usuario.dni}</p>

            <hr>
            <p style="font-size: 12px; color: #666;">
              Este es un mensaje automático. Por favor, no responda a este email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  public getReportsByUser = async (
    userId: string,
    cursor?: string,
    limit: number = 10,
  ): Promise<{ items: Reporte[]; lastCursor?: string }> => {
    const where: FindOptionsWhere<Reporte> = {
      usuario: { id: userId },
      ...(cursor ? { createdAt: LessThan(new Date(cursor)) } : {}),
    };

    const reports = await this.accidentReportRepo.find({
      where,
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const lastCursor =
      reports.length === limit ? reports[reports.length - 1].createdAt.toISOString() : undefined;

    return { items: reports, lastCursor };
  };

  public getReportsInvolvingUser = async (
    id: string,
    cursor?: string,
    limit: number = 10,
  ): Promise<{ items: Reporte[]; lastCursor?: string }> => {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const where: FindOptionsWhere<Reporte> = {
      dni: user.dni,
      ...(cursor ? { createdAt: LessThan(new Date(cursor)) } : {}),
    };

    const reports = await this.accidentReportRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const lastCursor =
      reports.length === limit ? reports[reports.length - 1].createdAt.toISOString() : undefined;

    return { items: reports, lastCursor };
  };

  public getLastReportByUserID = async (userId: string): Promise<Reporte | null> =>
    await this.accidentReportRepo.findOne({
      where: { usuario: { id: userId } },
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
    });

  public getTipoAccidenteTop = async (range?: Range): Promise<EstadisticaTop | null> => {
    const query = this.accidentReportRepo
      .createQueryBuilder('reporte')
      .select('reporte.tipoAccidente', 'tipo')
      .addSelect('COUNT(reporte.tipoAccidente)', 'conteo')
      .groupBy('reporte.tipoAccidente')
      .orderBy('conteo', 'DESC')
      .limit(1);

    // Aplicar filtro de rango de fechas
    if (range === 'day') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 day'`);
    } else if (range === 'week') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '7 days'`);
    } else if (range === 'month') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 month'`);
    }

    const result = await query.getRawOne<{ tipo: string; conteo: string }>();

    return result ? { tipo: result.tipo, conteo: Number(result.conteo) } : null;
  };

  public getTotalAccidentes = async (range?: Range): Promise<number> => {
    const query = this.accidentReportRepo.createQueryBuilder('reporte').select('COUNT(*)', 'total');

    // Aplicar filtro de rango de fechas
    if (range === 'day') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 day'`);
    } else if (range === 'week') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '7 days'`);
    } else if (range === 'month') {
      query.andWhere(`reporte.createdAt >= NOW() - INTERVAL '1 month'`);
    }

    const result = await query.getRawOne<{ total: string }>();
    return result ? Number(result.total) : 0;
  };
}

type Range = 'day' | 'week' | 'month';
