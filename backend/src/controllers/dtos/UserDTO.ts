import { UsuarioCivil } from '../../models/User';
import { AccidenteReportWithoutUserDTO } from './AccidentReportWithoutUser';

export class UserDTO {
  dni!: string;
  apellido!: string;
  nombre!: string;
  fechaNacimiento!: string;
  telefono!: string;
  email!: string;
  imagen?: string;
  reportes?: AccidenteReportWithoutUserDTO[];

  static fromModel(user: UsuarioCivil): UserDTO {
    const dto = new UserDTO();
    dto.dni = user.dni;
    dto.apellido = user.apellido;
    dto.nombre = user.nombre;
    dto.fechaNacimiento = new Date(user.fechaNacimiento).toISOString();
    dto.telefono = user.telefono;
    dto.email = user.email;
    dto.imagen = user.imagen || '';
    dto.reportes = user.reportes.map((report) => AccidenteReportWithoutUserDTO.fromModel(report));
    return dto;
  }
}
