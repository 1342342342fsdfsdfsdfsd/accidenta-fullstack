import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UsuarioCivil } from './User';

@Entity()
export class DatoSalud {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  grupoSanguineo?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  altura?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  peso?: string;

  @Column('text', { array: true, default: '{}' })
  patologias!: string[];

  @Column('text', { array: true, default: '{}' })
  medicacion!: string[];

  @Column({ type: 'varchar', length: 20, nullable: true })
  sexo?: string;

  @Column('text', { array: true, default: '{}' })
  alergias!: string[];

  @OneToOne(() => UsuarioCivil, (user) => user.datoDeSalud, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: UsuarioCivil;
}
