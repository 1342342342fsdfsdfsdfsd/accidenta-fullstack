import { Reporte } from '../../models/reporte';
import { UsuarioCivil } from '../../models/User';

// DTO de request (lo que envía el cliente)
export interface AccidentReportBodyDTO {
  tipoAccidente: string;
  dni: string;
  descripcion: string;
  ubicacion: string;
}

// DTO de respuesta (lo que devuelves al cliente)
export class AccidenteReportDTO {
  id!: string;
  tipoAccidente!: string;
  dni!: string;
  descripcion!: string;
  ubicacion!: string;
  createdAt!: Date;
  usuario!: {
    dni: string;
    nombre: string;
    apellido: string;
  };

  // 🔹 "Desde modelo": convierte entidad → DTO
  static fromModel(reporte: Reporte): AccidenteReportDTO {
    const dto = new AccidenteReportDTO();
    dto.id = reporte.id;
    dto.tipoAccidente = reporte.tipoAccidente;
    dto.dni = reporte.dni;
    dto.descripcion = reporte.descripcion;
    dto.ubicacion = reporte.ubicacion;
    dto.createdAt = reporte.createdAt;
    dto.usuario = {
      dni: reporte.usuario.dni,
      nombre: reporte.usuario.nombre,
      apellido: reporte.usuario.apellido,
    };
    return dto;
  }

  // 🔹 "A modelo": convierte DTO → entidad
  static toModel(dto: AccidentReportBodyDTO, usuario: UsuarioCivil): Reporte {
    const reporte = new Reporte();
    reporte.tipoAccidente = dto.tipoAccidente;
    reporte.dni = dto.dni;
    reporte.descripcion = dto.descripcion;
    reporte.ubicacion = dto.ubicacion;
    reporte.usuario = usuario;
    return reporte;
  }
}
