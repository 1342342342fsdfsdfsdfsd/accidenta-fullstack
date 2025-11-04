import { IsNotEmpty, Length, Matches, validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioCivil } from './User';

@Entity()
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsNotEmpty({ message: 'Tipo de accidente es obligatorio' })
  tipoAccidente!: string;

  @Column()
  @Matches(/^\d{8}$/, { message: 'DNI debe tener 8 dígitos' })
  dni!: string;

  @Column('text')
  @Length(10, 500, { message: 'Descripción mínima 10 caracteres' })
  descripcion!: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column()
  @IsNotEmpty({ message: 'Ubicación es obligatoria' })
  ubicacion!: string;

  @Column('text', { array: true, default: [] })
  imagenes!: string[]; // ✅ Array de nombres o rutas de archivos

  @ManyToOne(() => UsuarioCivil, (usuario) => usuario.reportes)
  usuario!: UsuarioCivil;

  // Hooks para validar automáticamente antes de insertar o actualizar
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { validationError: { target: false } });
  }
}
