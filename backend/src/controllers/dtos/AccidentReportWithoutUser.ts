import { Reporte } from '../../models/reporte';

export class AccidenteReportWithoutUserDTO {
  tipoAccidente!: string;
  dni!: string;
  descripcion!: string;
  ubicacion!: string;
  createdAt!: Date;

  static fromModel(reporte: Reporte): AccidenteReportWithoutUserDTO {
    return {
      tipoAccidente: reporte.tipoAccidente,
      dni: reporte.dni,
      descripcion: reporte.descripcion,
      ubicacion: reporte.ubicacion,
      createdAt: reporte.createdAt,
    };
  }
}
