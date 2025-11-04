import request from 'supertest';
import app from '../../src/app';

interface UserPayload {
  email: string;
  dni: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNacimiento: string;
}

// --- Helper to create a unique user for each test run ---
const createUniqueUser = () => {
  const timestamp = Date.now();
  return {
    email: `test${timestamp}@test.com`,
    dni: `${timestamp}`.slice(-8), // Use last 8 digits of timestamp for a unique DNI
    password: '12345678',
    nombre: 'Juan',
    apellido: 'Perez',
    telefono: '+5491123456789',
    fechaNacimiento: '1990-01-01',
  };
};

describe('📌 Auth API', () => {
  describe('POST /auth/register', () => {
    it('✅ debería registrar un usuario válido (201)', async () => {
      const validUser = createUniqueUser(); // Generate a fresh user
      const res = await request(app).post('/auth/register').send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Usuario registrado' });
    });

    it('🚫 debería fallar si el email ya está registrado (409)', async () => {
      const user = createUniqueUser();
      // 1. Register the user successfully
      await request(app).post('/auth/register').send(user).expect(201);

      // 2. Try to register another user with the SAME email but different DNI
      const res = await request(app)
        .post('/auth/register')
        .send({ ...user, dni: '87654321' });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ message: 'El email ya esta registrado.' });
    });

    it('🚫 debería fallar si el DNI ya está registrado (409)', async () => {
      const user = createUniqueUser();
      // 1. Register the user successfully
      await request(app).post('/auth/register').send(user).expect(201);

      // 2. Try to register another user with the SAME DNI but different email
      const res = await request(app)
        .post('/auth/register')
        .send({ ...user, email: 'otroemail@gmail.com' });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ message: 'El DNI ya esta registrado.' });
    });

    it('🚫 debería fallar con datos inválidos (400)', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'not-an-email',
        dni: 'short',
        password: '123',
        nombre: '',
        apellido: '',
        telefono: 'invalid-phone',
        fechaNacimiento: 'not-a-date',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /auth/login', () => {
    let validUser: UserPayload;

    // Create a user before each login test
    beforeEach(async () => {
      validUser = createUniqueUser();
      await request(app).post('/auth/register').send(validUser);
    });

    it('✅ debería loguear un usuario válido (200)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('🚫 debería fallar con credenciales incorrectas (404)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Email o contraseña incorrectos.' });
    });

    it('🚫 debería fallar con datos inválidos (400)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'not-an-email', password: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });
});
