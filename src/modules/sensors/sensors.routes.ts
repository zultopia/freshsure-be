import { Router } from 'express';
import sensorsController from './sensors.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'FARMER'), sensorsController.create.bind(sensorsController));
router.get('/', authenticate, sensorsController.findAll.bind(sensorsController));
router.get('/:id', authenticate, sensorsController.findById.bind(sensorsController));
router.patch('/:id', authenticate, authorize('ADMIN', 'FARMER'), sensorsController.update.bind(sensorsController));

// Sensor readings
router.post('/readings', authenticate, sensorsController.createReading.bind(sensorsController));
router.get('/batches/:batchId/readings', authenticate, sensorsController.getReadings.bind(sensorsController));

export default router;

