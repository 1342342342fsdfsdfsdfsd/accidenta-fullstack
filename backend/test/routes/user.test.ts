import request from 'supertest';
import app from '../../src/app';
import { getAuthToken, Usuario, clearDatabase } from './utils';
import { connection } from '../setup';

const USER_ROUTE = '/users/me';
const CONTACTS_ROUTE = '/users/contactos';
const HEALTH_DATA_ROUTE = '/users/datosSalud'; 

describe('📌 Usuario API', () => {
  let usrToken: string;
  let usrData: Usuario;

  const authGet = (url: string, token?: string) => {
    const req = request(app).get(url);
    if (token) req.set('Authorization', `Bearer ${token}`);
    return req;
  };

  const authPost = (url: string, token?: string) => {
    const req = request(app).post(url);
    if (token) req.set('Authorization', `Bearer ${token}`);
    return req;
  };

  const authPut = (url: string, token?: string) => {
    const req = request(app).put(url);
    if (token) req.set('Authorization', `Bearer ${token}`);
    return req;
  };

  const authDelete = (url: string, token?: string) => {
    const req = request(app).delete(url);
    if (token) req.set('Authorization', `Bearer ${token}`);
    return req;
  };

  beforeEach(async () => {
    await clearDatabase(connection);
    const { usuario, token } = await getAuthToken(app);
    usrToken = token;
    usrData = usuario;
  });

  // 🧪 GET /users/me
  describe(`GET ${USER_ROUTE}`, () => {
    it('✅ debería devolver la información del usuario logueado', async () => {
      const res = await authGet(USER_ROUTE, usrToken);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: usrData.id,
        email: usrData.email,
        nombre: usrData.nombre,
        apellido: usrData.apellido,
      });
      expect(res.body).not.toHaveProperty('password');
    });

    it('🚫 debería fallar sin token', async () => {
      const res = await authGet(USER_ROUTE);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token requerido');
    });

    it('🚫 debería fallar con token inválido', async () => {
      const res = await authGet(USER_ROUTE, 'invalidtoken');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token no válido o expirado');
    });
  });

  // 🧪 GET /users/contactos
  describe(`GET ${CONTACTS_ROUTE}`, () => {
    it('✅ debería devolver lista vacía si no hay contactos', async () => {
      const res = await authGet(CONTACTS_ROUTE, usrToken);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('🚫 debería fallar sin token', async () => {
      const res = await authGet(CONTACTS_ROUTE);
      expect(res.status).toBe(401);
    });
  });

  // 🧪 POST /users/contactos
  describe(`POST ${CONTACTS_ROUTE}`, () => {
    it('✅ debería crear un contacto correctamente', async () => {
      const newContact = { nombre: 'Juan Perez', mail: 'juan@mail.com' };
      const res = await authPost(CONTACTS_ROUTE, usrToken).send(newContact);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(newContact);
      expect(res.body).toHaveProperty('id');
    });

    it('🚫 debería fallar si intenta agregar su propio correo', async () => {
      const res = await authPost(CONTACTS_ROUTE, usrToken).send({
        nombre: 'Self',
        mail: usrData.email,
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No puedes agregar tu propio correo como contacto');
    });

    it('🚫 debería fallar si intenta agregar un contacto duplicado', async () => {
      const contact = { nombre: 'Juan', mail: 'juan@mail.com' };
      await authPost(CONTACTS_ROUTE, usrToken).send(contact);
      const res = await authPost(CONTACTS_ROUTE, usrToken).send(contact);
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Ya existe un contacto con ese correo');
    });

    it('🚫 debería fallar si el email es inválido (validación Zod)', async () => {
      const res = await authPost(CONTACTS_ROUTE, usrToken).send({
        nombre: 'Test',
        mail: 'no-es-email',
      });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toBe('Email inválido');
    });
  });

  // 🧪 PUT /users/contactos/:id
  describe(`PUT ${CONTACTS_ROUTE}/:id`, () => {
    it('✅ debería actualizar un contacto existente', async () => {
      const contact = await authPost(CONTACTS_ROUTE, usrToken).send({
        nombre: 'Juan',
        mail: 'juan@mail.com',
      });

      const res = await authPut(`${CONTACTS_ROUTE}/${contact.body.id}`, usrToken).send({
        nombre: 'Juan Actualizado',
        mail: 'nuevo@mail.com',
      });
      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('Juan Actualizado');
    });

    it('🚫 debería fallar si el ID no existe', async () => {
      const res = await authPut(`${CONTACTS_ROUTE}/Fake22`, usrToken).send({
        nombre: 'XXX',
        mail: 'x@mail.com',
      });
      expect(res.status).toBe(500); // porque no encuentra el contacto en la DB
      expect(res.body.message).toBe('Error al actualizar contacto');
    });

    it('🚫 debería fallar si el nombre es demasiado corto (Zod)', async () => {
      const contact = await authPost(CONTACTS_ROUTE, usrToken).send({
        nombre: 'Juan',
        mail: 'juan@mail.com',
      });

      const res = await authPut(`${CONTACTS_ROUTE}/${contact.body.id}`, usrToken).send({
        nombre: 'J',
        mail: 'nuevo@mail.com',
      });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toBe('Nombre debe tener al menos 2 caracteres');
    });
  });

  // 🧪 DELETE /users/contactos/:id
  describe(`DELETE ${CONTACTS_ROUTE}/:id`, () => {
    it('✅ debería eliminar un contacto existente', async () => {
      const contact = await authPost(CONTACTS_ROUTE, usrToken).send({
        nombre: 'Juan',
        mail: 'juan@mail.com',
      });
      const res = await authDelete(`${CONTACTS_ROUTE}/${contact.body.id}`, usrToken);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Contacto eliminado');
    });

    it('🚫 debería fallar si el ID no existe', async () => {
      const res = await authDelete(`${CONTACTS_ROUTE}/fake-id`, usrToken);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error interno del servidor');
    });
  });
  // 🧪 Tests para Datos de Salud --- NUEVOS TESTS ---
     const healthDataPayload = {
      grupoSanguineo: 'A+',
      altura: '175',
      peso: '72.5',
      patologias: ['Hipertensión arterial'],
      medicacion: ['Losartán 50mg'],
      sexo: 'Masculino',
      alergias: ['Penicilina'],
    };
  
    describe(`PATCH ${HEALTH_DATA_ROUTE} (Lógica de Creación)`, () => {
  it('✅ debería CREAR un registro de salud si no existe al llamar a PATCH', async () => {
    const updatePayload = { altura: '180' };

    const res = await request(app)
      .patch(HEALTH_DATA_ROUTE)
      .set('Authorization', `Bearer ${usrToken}`)
      .send(updatePayload);

    // El controlador devuelve 200 OK
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Datos de salud actualizados correctamente');
    
    // Verificamos que el dato se creó correctamente
    expect(res.body.data.altura).toBe('180');
    // Los otros campos deben ser null o default, no "undefined"
    expect(res.body.data.peso).toBeNull();
    expect(res.body.data.patologias).toEqual([]); // Los arrays default son []
  });

  it('✅ debería crear y luego actualizar el registro con llamadas PATCH separadas', async () => {
    // 1. Primera llamada: Crea el registro con la altura
    const createRes = await request(app)
      .patch(HEALTH_DATA_ROUTE)
      .set('Authorization', `Bearer ${usrToken}`)
      .send({ altura: '175' });
    
    expect(createRes.status).toBe(200);
    const createdData = createRes.body.data;
    expect(createdData.altura).toBe('175');
    expect(createdData.peso).toBeNull();

    // 2. Segunda llamada: Actualiza el peso en el MISMO registro
    const updateRes = await request(app)
      .patch(HEALTH_DATA_ROUTE)
      .set('Authorization', `Bearer ${usrToken}`)
      .send({ peso: '82.5' });
    
    expect(updateRes.status).toBe(200);
    const updatedData = updateRes.body.data;
    expect(updatedData.altura).toBe('175'); // El dato anterior persiste
    expect(updatedData.peso).toBe('82.5'); // El dato nuevo se agregó
    expect(updatedData.id).toBe(createdData.id); // Confirma que es el mismo registro
  });

  it('🚫 debería devolver 400 si se envía un body vacío en PATCH', async () => {
    // Este test prueba la validación del
    // UserController (if (Object.keys(parsedData).length === 0))
    const res = await request(app)
      .patch(HEALTH_DATA_ROUTE)
      .set('Authorization', `Bearer ${usrToken}`)
      .send({}); // Body vacío
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('No se proporcionaron datos para actualizar');
  });

  it('🚫 debería fallar al llamar a GET si no se ha creado nada (ni POST ni PATCH)', async () => {
    // Test de sanidad: confirma que GET sigue fallando si no hay datos
    const res = await authGet(HEALTH_DATA_ROUTE, usrToken);
    expect(res.status).toBe(404); // Sigue siendo 404
    expect(res.body.message).toBe('No hay datos de salud registrados');
  });

});
    // 🧪 POST /users/datosSalud
  describe(`POST ${HEALTH_DATA_ROUTE}`, () => {
    it('✅ debería agregar los datos de salud para un usuario autenticado', async () => {
      const res = await authPost(HEALTH_DATA_ROUTE, usrToken).send(
        healthDataPayload
      );
      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        'Dato de salud agregado correctamente'
      );
    });

    it('🚫 debería devolver 409 si el usuario ya tiene datos de salud registrados', async () => {
      await authPost(HEALTH_DATA_ROUTE, usrToken).send(healthDataPayload);

      const res = await authPost(HEALTH_DATA_ROUTE, usrToken).send(
        healthDataPayload
      );

      expect(res.status).toBe(409);
      expect(res.body.message).toBe(
        'El usuario ya posee datos de salud registrados'
      );
    });

    it('🚫 debería devolver 400 si faltan campos requeridos (validación Zod)', async () => {
      const { grupoSanguineo: _grupoSanguineo, ...incompleteData } = healthDataPayload;

      const res = await authPost(HEALTH_DATA_ROUTE, usrToken).send(
        incompleteData
      );

      expect(res.status).toBe(400);

      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toBeInstanceOf(Array);
      expect(res.body.errors.length).toBeGreaterThan(0);

      const firstError = res.body.errors[0];
  
      expect(firstError.field).toBe('grupoSanguineo');
  
      expect(typeof firstError.message).toBe('string');
    });

    it('🚫 debería devolver 401 si no hay token de autenticación', async () => {
      const res = await authPost(HEALTH_DATA_ROUTE).send(healthDataPayload);
      expect(res.status).toBe(401);
    });
  });

    // 🧪 GET /users/health-data
    describe(`GET ${HEALTH_DATA_ROUTE}`, () => {
      it('✅ debería obtener los datos de salud de un usuario que ya los ha registrado', async () => {
        await authPost(HEALTH_DATA_ROUTE, usrToken).send(healthDataPayload);

        const res = await authGet(HEALTH_DATA_ROUTE, usrToken);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Datos de salud obtenidos correctamente');
        expect(res.body.datoDeSalud).toMatchObject(healthDataPayload);
      });

      it('🚫 debería devolver 404 si el usuario no tiene datos de salud registrados', async () => {
        const res = await authGet(HEALTH_DATA_ROUTE, usrToken);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('No hay datos de salud registrados');
      });

      it('🚫 debería devolver 401 si no se provee un token', async () => {
        const res = await authGet(HEALTH_DATA_ROUTE);
        expect(res.status).toBe(401);
      });

      it('🚫 debería fallar con token inválido', async () => {
        const res = await authGet(HEALTH_DATA_ROUTE, 'invalidtoken');
        expect(res.status).toBe(401);
      });
    });
  });  
