import { Router } from 'express';
import { UsuarioController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createContactoSchema, updateContactoSchema } from '../middlewares/datosDeConfianza.schema';
import { createDatoSaludSchema, updateDatoSaludSchema } from '../middlewares/datosDeSalud.validate';
const router = Router();
const usuarioController = new UsuarioController();

router.get('/', (req, res) => usuarioController.getAllUsers(req, res));
router.get('/me', authMiddleware, (req, res) => usuarioController.getUser(req, res));
router.get('/contactos', authMiddleware, usuarioController.getContacts);
router.post(
  '/contactos',
  validate(createContactoSchema),
  authMiddleware,
  usuarioController.addContact,
);
router.put(
  '/contactos/:id',
  validate(updateContactoSchema),
  authMiddleware,
  usuarioController.updateContact,
);
router.delete('/contactos/:id', authMiddleware, usuarioController.deleteContact);
router.get('/datosSalud', authMiddleware, usuarioController.getHealthData);
router.post(
  '/datosSalud',
  validate(createDatoSaludSchema),
  authMiddleware,
  usuarioController.addHealthData,
);

router.patch(
  '/datosSalud',
  validate(updateDatoSaludSchema),
  authMiddleware,
  usuarioController.updateHealthData,
);

export default router;
