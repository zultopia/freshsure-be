import { Router } from 'express';
import analyticsController from './analytics.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/weekly-metrics', authenticate, analyticsController.createWeeklyMetric.bind(analyticsController));
router.get('/weekly-metrics', authenticate, analyticsController.getWeeklyMetrics.bind(analyticsController));
router.get('/dashboard', authenticate, analyticsController.getDashboardStats.bind(analyticsController));

export default router;

