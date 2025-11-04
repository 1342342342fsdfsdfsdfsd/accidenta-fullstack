import request from 'supertest';
import { Application } from 'express';
import { DataSource } from 'typeorm';

export interface Usuario {
  id: string; // UUID v4
  dni: string; // 8 dígitos
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // formato YYYY-MM-DD
  telefono: string; // con prefijo internacional
  email: string;
  imagen: string; // ruta o nombre de archivo
}

interface AuthTokenResponse {
  usuario: Usuario;
  token: string;
}

export async function getAuthToken(app: Application): Promise<AuthTokenResponse> {
  const usuarioData = {
    dni: '12345678',
    nombre: 'Juan',
    apellido: 'Perez',
    fechaNacimiento: '1990-01-01',
    telefono: '1123456789',
    email: 'test@test.com',
    password: '12345678',
  };

  await request(app).post('/auth/register').send(usuarioData).expect(201);

  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email: usuarioData.email, password: usuarioData.password })
    .expect(200);

  const token = loginRes.body.token as string;

  const data = await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  return { usuario: data.body as Usuario, token: token as string };
}

export async function clearDatabase(connection: DataSource) {
  await connection.query('DELETE FROM contacto_confianza');
  await connection.query('DELETE FROM reporte');
  await connection.query('DELETE FROM usuario_civil');
}

export async function clearReports(connection: DataSource) {
  await connection.query('DELETE FROM reporte');
}

export async function clearContacts(connection: DataSource) {
  await connection.query('DELETE FROM contacto_confianza');
}
