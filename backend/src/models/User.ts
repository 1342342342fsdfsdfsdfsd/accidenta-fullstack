import bcrypt from 'bcrypt';
import { IsEmail, IsNotEmpty, Length, Matches, validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Reporte } from './reporte';
import { ContactoConfianza } from './ContactoConfianza';
import { DatoSalud } from './DatoSalud';

@Entity()
@Unique('UQ_usuario_dni', ['dni'])
@Unique('UQ_usuario_email', ['email'])
export class UsuarioCivil {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Matches(/^\d{8}$/, { message: 'El DNI debe tener 8 dígitos.' })
  dni!: string;

  @Column()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @Column()
  @IsNotEmpty({ message: 'El apellido debe ser obligatorio.' })
  apellido!: string;

  @Column({ type: 'date' })
  fechaNacimiento!: Date;

  @Column()
  @Matches(/^\+?\d{7,15}$/, { message: 'El teléfono debe ser válido' })
  telefono!: string;

  @Column()
  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string;

  @Column()
  @Length(8, 20, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password!: string;

  @OneToMany(() => Reporte, (reporte) => reporte.usuario, { cascade: true })
  reportes!: Reporte[];

  @OneToMany(() => ContactoConfianza, (contact) => contact.user, {
    cascade: true,
  })
  contactosDeConfianza!: ContactoConfianza[];

  @OneToOne(() => DatoSalud, (datoSalud) => datoSalud.user)
  datoDeSalud!: DatoSalud;

  @Column({ nullable: true })
  imagen!: string;

  @BeforeInsert()
  @BeforeUpdate()
  async validateAndHash(): Promise<void> {
    return validateOrReject(this, { validationError: { target: false } }).then(() => {
      // Hashea la contraseña solo si no está hasheada
      if (this.password && !this.password.startsWith('$2b$')) {
        return bcrypt.hash(this.password, 10).then((hash) => {
          this.password = hash; // asignamos la contraseña hasheada
        });
      }
    });
  }
}
