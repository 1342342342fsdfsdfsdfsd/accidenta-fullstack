import { Repository } from 'typeorm';
import { DB } from '../config/db';
import { ContactoConfianza } from '../models/ContactoConfianza';
import { UsuarioCivil } from '../models/User';
import { DatoSalud } from '../models/DatoSalud';
import { UpdateDatoSaludInput } from '../middlewares/datosDeSalud.validate';
export class UsuarioService {
  private contactRepo = DB.getRepository(ContactoConfianza);
  private healthDataRepo = DB.getRepository(DatoSalud);
  private get userRepo(): Repository<UsuarioCivil> {
    if (!DB.isInitialized) throw new Error('DataSource no inicializado');
    return DB.getRepository(UsuarioCivil);
  }

  public getByDNI = async (dni: string): Promise<UsuarioCivil> => {
    const user: UsuarioCivil | null = await this.userRepo.findOneBy({ dni });
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  };

  public getAll = async (): Promise<UsuarioCivil[]> => {
    return await this.userRepo.find({
      relations: ['reportes'],
      order: { apellido: 'ASC' },
    });
  };

  public getAllContactsByUserID = async (userId: string): Promise<ContactoConfianza[]> => {
    return await this.contactRepo.find({
      where: { user: { id: userId } }, // filtramos por usuario
      order: { id: 'ASC' }, // ordenamos por el id del contacto
    });
  };
  public getAllContactsByDNI = async (dni: string): Promise<UsuarioCivil[]> => {
    return await this.userRepo.find({
      relations: ['contactosDeConfianza'],
      where: { dni },
      order: { apellido: 'ASC' },
    });
  };

  public addContact = async (
    userId: string,
    contactData: ContactData,
  ): Promise<ContactoConfianza> => {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['contactosDeConfianza'],
    });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.email.toLowerCase() === contactData.mail.toLowerCase()) {
      throw new Error('No puedes usar tu propio correo como contacto de confianza');
    }

    // Verificar si ya existe un contacto con ese mail para el usuario
    const exists = user.contactosDeConfianza.some(
      (c) => c.mail.toLowerCase() === contactData.mail.toLowerCase(),
    );
    if (exists) {
      throw new Error('El contacto ya existe con ese correo');
    }

    const newContact = this.contactRepo.create({
      nombre: contactData.nombre,
      mail: contactData.mail,
      user: user,
    });

    return await this.contactRepo.save(newContact);
  };

  public updateContact = async (
    userId: string,
    contactId: string,
    contactData: ContactData,
  ): Promise<ContactoConfianza> => {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['contactosDeConfianza'],
    });
    if (!user) throw new Error('Usuario no encontrado');

    if (user.email.toLowerCase() === contactData.mail.toLowerCase()) {
      throw new Error('No puedes usar tu propio correo como contacto de confianza');
    }

    const contact = user.contactosDeConfianza.find((c) => c.id === contactId);
    if (!contact) throw new Error('Contacto no encontrado');

    // Verificar que el mail no exista en otro contacto del mismo usuario
    const newMail = contactData.mail.toLowerCase();
    const exists = user.contactosDeConfianza.some(
      (c) => c.mail.toLowerCase() === newMail && c.id !== contactId,
    );
    if (exists) throw new Error('Ya existe otro contacto con ese correo');

    contact.mail = newMail;
    contact.nombre = contactData.nombre;

    return await this.contactRepo.save(contact);
  };

  public deleteContact = async (userId: string, contactId: string): Promise<void> => {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['contactosDeConfianza'],
    });
    if (!user) throw new Error('Usuario no encontrado');

    const contact = user.contactosDeConfianza.find((c) => c.id === contactId);
    if (!contact) throw new Error('Contacto no encontrado');

    await this.contactRepo.remove(contact);
  };

  public getHealthData = async (userId: string): Promise<DatoSalud> => {
    const usuario = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['datoDeSalud'],
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (!usuario.datoDeSalud) {
      throw new Error('No hay datos de salud registrados');
    }

    return usuario.datoDeSalud;
  };

  public async addHealthData(userId: string, data: UpdateDatoSaludInput) {
    const checkArrayLimit = (arr?: string[]) => {
      if (arr && arr.length > 3) {
        throw new Error('no puede tener más de 3 elementos');
      }
    };

    checkArrayLimit(data.patologias);
    checkArrayLimit(data.medicacion);
    checkArrayLimit(data.alergias);

    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['datoDeSalud'] });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    if (user.datoDeSalud) {
      throw new Error('El usuario ya posee datos de salud registrados');
    }

    const datoSalud = this.healthDataRepo.create({
      ...data,
      user,
    });
    return await this.healthDataRepo.save(datoSalud);
  }

  async updateHealthData(userId: string, updates: Partial<DatoSalud>) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['datoDeSalud'],
    });

    if (!user) throw new Error('Usuario no encontrado');

    if (!user.datoDeSalud) {
      // Si el usuario no tiene datos, los crea vacíos primero
      const newData = this.healthDataRepo.create({ user });
      user.datoDeSalud = await this.healthDataRepo.save(newData);
    }

    const updated = Object.assign(user.datoDeSalud, updates);
    return await this.healthDataRepo.save(updated);
  }
}

interface ContactData {
  nombre: string;
  mail: string;
}
