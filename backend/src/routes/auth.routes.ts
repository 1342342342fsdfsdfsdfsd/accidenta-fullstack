import { Router } from 'express';
import upload from '../config/multer';
import { AuthController } from '../controllers/AuthController';
import { validateRegister } from '../middlewares/register.validate';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../middlewares/login.schema';

const router = Router();
const authController = new AuthController();

router.post('/register', upload.single('imagen'), validateRegister, (req, res) =>
  authController.registerUser(req, res),
);
router.post('/login', validate(loginSchema), authController.loginUser);

export default router;
