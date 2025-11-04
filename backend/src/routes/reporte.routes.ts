import { Router } from 'express';
import upload from '../config/multer';
import { ReporteController } from '../controllers/ReportAccidentController';
import { authMiddleware } from '../middlewares/auth';
import { validateReporteForm } from '../middlewares/reporte.validate';

const router = Router();
const reporteController = new ReporteController();

router.post(
  '/',
  authMiddleware,
  upload.array('imagenes', 3),
  validateReporteForm,
  reporteController.createAccidentReport,
);
router.get('/', authMiddleware, reporteController.getAllAccidentReportsCreatedByUser);
router.get('/involved', authMiddleware, reporteController.getAllAccidentReportsInvolvedUser);
router.post('/urgencia', authMiddleware, reporteController.createUrgencia);

export default router;
