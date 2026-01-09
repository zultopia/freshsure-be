import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import companiesRoutes from '../modules/companies/companies.routes';
import commoditiesRoutes from '../modules/commodities/commodities.routes';
import batchesRoutes from '../modules/batches/batches.routes';
import sensorsRoutes from '../modules/sensors/sensors.routes';
import qualityRoutes from '../modules/quality/quality.routes';
import recommendationsRoutes from '../modules/recommendations/recommendations.routes';
import actionsRoutes from '../modules/actions/actions.routes';
import logisticsRoutes from '../modules/logistics/logistics.routes';
import retailRoutes from '../modules/retail/retail.routes';
import feedbackRoutes from '../modules/feedback/feedback.routes';
import outcomesRoutes from '../modules/outcomes/outcomes.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/companies', companiesRoutes);
router.use('/commodities', commoditiesRoutes);
router.use('/batches', batchesRoutes);
router.use('/sensors', sensorsRoutes);
router.use('/quality', qualityRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/actions', actionsRoutes);
router.use('/logistics', logisticsRoutes);
router.use('/retail', retailRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/outcomes', outcomesRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

