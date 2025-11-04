import request from 'supertest';
import app from '../../src/app';
import { clearDatabase, getAuthToken, Usuario } from './utils';
import { connection } from '../setup';

const REPORTS_ROUTE = '/reports';
const REPORTS_INVOLVED = '/reports/involved';

const validReporte = {
  tipoAccidente: 'caida',
  dni: '12345678',
  ubicacion: 'Planta 1',
  descripcion: 'El trabajador se cayó desde una escalera.',
};

describe('📌 Reportes API', () => {
  let usrToken: string;
  let usrData: Usuario;

  // Helper for authenticated requests
  const authPost = (url: string, token?: string) => {
    const req = request(app).post(url);
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    } else {
      req.set('Authorization', '  ');
    }
    return req;
  };

  const authGetReports = (url: string, token?: string) => {
    const req = request(app).get(url);
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    } else {
      req.set('Authorization', '  ');
    }
    return req;
  };
  const authGetInvolvedReports = (url: string, token?: string) => {
    const req = request(app).get(url);
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    } else {
      req.set('Authorization', '  ');
    }
    return req;
  };
  beforeEach(async () => {
    await clearDatabase(connection);
    const { usuario, token } = await getAuthToken(app);
    usrToken = token;
    usrData = usuario;
  });

  describe(`POST ${REPORTS_ROUTE}`, () => {
    it('✅ debería crear un reporte con datos válidos', async () => {
      const res = await authPost(REPORTS_ROUTE, usrToken)
        .field('tipoAccidente', validReporte.tipoAccidente)
        .field('dni', validReporte.dni)
        .field('ubicacion', validReporte.ubicacion)
        .field('descripcion', validReporte.descripcion)
        .attach('imagenes', Buffer.from('fake image content'), 'mock.jpg');

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        tipoAccidente: validReporte.tipoAccidente,
        dni: validReporte.dni,
        ubicacion: validReporte.ubicacion,
        descripcion: validReporte.descripcion,
      });

      // Verificar propiedades del usuario
      expect(res.body.usuario).toMatchObject({
        dni: usrData.dni,
        nombre: usrData.nombre,
        apellido: usrData.apellido,
        email: usrData.email,
      });

      // Verificar propiedades generadas automáticamente
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('imagenes');
      expect(Array.isArray(res.body.imagenes)).toBe(true);
      expect(res.body.imagenes.length).toBe(1);
      expect(res.body.usuario).toHaveProperty('id');
    });

    it('🚫 debería fallar sin token de autenticación', async () => {
      const res = await request(app).post(REPORTS_ROUTE).send(validReporte);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token requerido');
    });

    it('🚫 debería fallar con token inválido', async () => {
      const res = await authPost(REPORTS_ROUTE, 'invalidtoken').send(validReporte);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token no válido o expirado');
    });

    it('🚫 debería fallar con datos inválidos', async () => {
      const invalidData = {
        tipoAccidente: '',
        dni: 'short',
        ubicacion: '',
        descripcion: '',
      };

      const res = await authPost(REPORTS_ROUTE, usrToken).send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  it('Puedo crear hasta 3 imágenes en un reporte', async () => {
    const res = await authPost(REPORTS_ROUTE, usrToken)
      .field('tipoAccidente', validReporte.tipoAccidente)
      .field('dni', validReporte.dni)
      .field('ubicacion', validReporte.ubicacion)
      .field('descripcion', validReporte.descripcion)
      .attach('imagenes', Buffer.from('fake image content 1'), 'mock1.jpg')
      .attach('imagenes', Buffer.from('fake image content 2'), 'mock2.jpg')
      .attach('imagenes', Buffer.from('fake image content 3'), 'mock3.jpg');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('imagenes');
    expect(Array.isArray(res.body.imagenes)).toBe(true);
    expect(res.body.imagenes.length).toBe(3);
  });

  it('No puedo crear más de 3 imágenes en un reporte', async () => {
    const res = await authPost(REPORTS_ROUTE, usrToken)
      .field('tipoAccidente', validReporte.tipoAccidente)
      .field('dni', validReporte.dni)
      .field('ubicacion', validReporte.ubicacion)
      .field('descripcion', validReporte.descripcion)
      .attach('imagenes', Buffer.from('fake image content 1'), 'mock1.jpg')
      .attach('imagenes', Buffer.from('fake image content 2'), 'mock2.jpg')
      .attach('imagenes', Buffer.from('fake image content 3'), 'mock3.jpg')
      .attach('imagenes', Buffer.from('fake image content 4'), 'mock4.jpg');

    expect(res.status).toBe(500);
  });
  describe(`GET ${REPORTS_ROUTE}`, () => {
    it('✅ debería obtener todos los reportes', async () => {
      const reportes = [
        validReporte,
        { ...validReporte, tipoAccidente: 'golpe', ubicacion: 'Planta 2' },
        { ...validReporte, tipoAccidente: 'corte', ubicacion: 'Planta 3' },
      ];

      // Crear reportes
      for (const reporte of reportes) {
        const response = await authPost(REPORTS_ROUTE, usrToken)
          .field('tipoAccidente', reporte.tipoAccidente)
          .field('dni', reporte.dni)
          .field('ubicacion', reporte.ubicacion)
          .field('descripcion', reporte.descripcion);
        expect(response.status).toBe(201);
      }

      const res = await authGetReports(REPORTS_ROUTE, usrToken);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');

      const { items } = res.body;

      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBe(3);

      // Validar estructura del primer reporte
      const firstReport = items[0];
      expect(firstReport).toHaveProperty('id');
      expect(firstReport).toHaveProperty('dni');
      expect(firstReport).toHaveProperty('tipoAccidente');
      expect(firstReport).toHaveProperty('ubicacion');
      expect(firstReport).toHaveProperty('descripcion');
      expect(firstReport).toHaveProperty('createdAt');
    });

    it('🚫 debería fallar sin token de autenticación', async () => {
      const res = await authGetReports(REPORTS_ROUTE);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token requerido');
    });

    it('🚫 debería fallar con token inválido', async () => {
      const res = await authGetReports(REPORTS_ROUTE, 'invalidtoken');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token no válido o expirado');
    });

    it('✅ debería retornar array vacío cuando no hay reportes', async () => {
      const res = await authGetReports(REPORTS_ROUTE, usrToken);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');

      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(0);
    });
  });

  describe(`GET ${REPORTS_INVOLVED}`, () => {
    it('✅ debería obtener solo los reportes donde aparezco como accidentado', async () => {
      // Crear reportes: 2 con mi DNI, 1 con otro
      const propios = [
        { ...validReporte, dni: usrData.dni, tipoAccidente: 'caida' },
        { ...validReporte, dni: usrData.dni, tipoAccidente: 'golpe' },
      ];
      const ajeno = { ...validReporte, dni: '99999999', tipoAccidente: 'corte' };

      for (const r of [...propios, ajeno]) {
        const res = await authPost(REPORTS_ROUTE, usrToken)
          .field('tipoAccidente', r.tipoAccidente)
          .field('dni', r.dni)
          .field('ubicacion', r.ubicacion)
          .field('descripcion', r.descripcion);
        expect(res.status).toBe(201);
      }

      const res = await authGetInvolvedReports(REPORTS_INVOLVED, usrToken);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      const { items } = res.body;

      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBe(2);

      // todos deben tener mi dni
      for (const report of items) {
        expect(report.dni).toBe(usrData.dni);
      }
    });

    it('✅ debería retornar array vacío si no hay reportes involucrados', async () => {
      const res = await authGetInvolvedReports(REPORTS_INVOLVED, usrToken);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(0);
    });

    it('🚫 debería fallar sin token de autenticación', async () => {
      const res = await authGetInvolvedReports(REPORTS_INVOLVED);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token requerido');
    });

    it('🚫 debería fallar con token inválido', async () => {
      const res = await authGetInvolvedReports(REPORTS_INVOLVED, 'invalidtoken');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token no válido o expirado');
    });
  });

  describe(`POST ${REPORTS_ROUTE}/urgencia`, () => {
    it('✅ debería crear una urgencia con usuario autenticado', async () => {
      const data = { ubicacion: 'x' };

      const res = await authPost(`${REPORTS_ROUTE}/urgencia`, usrToken).send(data);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        tipoAccidente: 'urgencia',
        dni: usrData.dni,
        ubicacion: data.ubicacion,
        descripcion: 'Situacion de emergencia que necesita ayuda inmediata.',
      });

      expect(res.body.usuario).toMatchObject({
        dni: usrData.dni,
        nombre: usrData.nombre,
        apellido: usrData.apellido,
      });

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('createdAt');
    });

    it('🚫 debería fallar sin token de autenticación', async () => {
      const res = await request(app).post(`${REPORTS_ROUTE}/urgencia`).send({ ubicacion: 'x' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token requerido');
    });

    it('🚫 debería fallar con token inválido', async () => {
      const res = await authPost(`${REPORTS_ROUTE}/urgencia`, 'invalidtoken').send({
        ubicacion: 'x',
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token no válido o expirado');
    });

    it('🚫 debería fallar si falta ubicación', async () => {
      const res = await authPost(`${REPORTS_ROUTE}/urgencia`, usrToken).send({});

      const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(normalize(res.body.message.toLowerCase())).toContain('ubicacion');
    });
  });
});
