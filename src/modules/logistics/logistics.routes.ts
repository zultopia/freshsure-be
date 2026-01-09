import { Router } from 'express';
import logisticsController from './logistics.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Routes
router.post('/routes', authenticate, authorize('LOGISTICS', 'ADMIN'), logisticsController.createRoute.bind(logisticsController));
router.get('/routes', authenticate, logisticsController.findAllRoutes.bind(logisticsController));
router.get('/routes/:id', authenticate, logisticsController.findRouteById.bind(logisticsController));

// Batch routes
router.post('/batch-routes', authenticate, authorize('LOGISTICS', 'ADMIN'), logisticsController.createBatchRoute.bind(logisticsController));
router.patch('/batch-routes/:id/status', authenticate, authorize('LOGISTICS', 'ADMIN'), logisticsController.updateBatchRouteStatus.bind(logisticsController));
router.get('/batches/:batchId/routes', authenticate, logisticsController.getBatchRoutes.bind(logisticsController));
router.get('/active', authenticate, logisticsController.getActiveRoutes.bind(logisticsController));

export default router;

