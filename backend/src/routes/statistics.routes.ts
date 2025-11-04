import { Router } from 'express';
import { StatisticsController } from '../controllers/StatisticsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const statisticsController = new StatisticsController();

router.get('/accident-type-top', authMiddleware, statisticsController.getTypeAccidentTop);
router.get('/total-accidents', authMiddleware, statisticsController.getTotalAccidentes);
router.get('/zone-top', authMiddleware, statisticsController.getZonaTop);

export default router;
