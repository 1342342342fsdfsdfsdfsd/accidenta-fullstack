import * as dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Reporte } from '../models/reporte';
import { UsuarioCivil } from '../models/User';
import { ContactoConfianza } from '../models/ContactoConfianza';
import { DatoSalud } from '../models/DatoSalud';

export const DB = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // ⚠️ SOLO en desarrollo
  logging: false,
  entities: [Reporte, UsuarioCivil, ContactoConfianza, DatoSalud],
  subscribers: [],
  migrations: [],
});
