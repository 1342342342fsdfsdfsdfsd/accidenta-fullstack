import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UsuarioCivil } from './User';

@Entity()
export class ContactoConfianza {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column()
  mail!: string;

  @ManyToOne(() => UsuarioCivil, (user) => user.contactosDeConfianza, {
    onDelete: 'CASCADE',
  })
  user!: UsuarioCivil;
}
