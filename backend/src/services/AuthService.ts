import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { DB } from '../config/db';
import { UsuarioCivil } from '../models/User';

export class AuthService {
  private get userRepo(): Repository<UsuarioCivil> {
    if (!DB.isInitialized) throw new Error('DataSource no inicializado');
    return DB.getRepository(UsuarioCivil);
  }

  public register = async (data: Partial<UsuarioCivil>): Promise<UsuarioCivil> => {
    const usuarioCivilEmail: UsuarioCivil | null = await this.userRepo.findOneBy({
      email: data.email,
    });
    const usuarioCivilDni: UsuarioCivil | null = await this.userRepo.findOneBy({ dni: data.dni });

    if (usuarioCivilEmail) throw new Error('El email ya esta registrado.');
    if (usuarioCivilDni) throw new Error('El DNI ya esta registrado.');

    const usuarioCivil: UsuarioCivil = this.userRepo.create({
      dni: data.dni,
      apellido: data.apellido,
      nombre: data.nombre,
      fechaNacimiento: data.fechaNacimiento,
      telefono: data.telefono,
      email: data.email,
      password: data.password,
      imagen: data.imagen,
    });

    return await this.userRepo.save(usuarioCivil);
  };

  public login = async (email: string, password: string): Promise<string> => {
    const user = await this.userRepo.findOneBy({ email });

    if (!user) throw new Error('NOT_FOUND');

    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) throw new Error('NOT_FOUND');

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET! || 'secreto', {
      expiresIn: '1h',
    });

    return token;
  };
}
