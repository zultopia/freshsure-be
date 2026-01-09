import { Router } from 'express';
import batchesController from './batches.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('FARMER', 'ADMIN'), batchesController.create.bind(batchesController));
router.get('/', authenticate, batchesController.findAll.bind(batchesController));
router.get('/summary', authenticate, batchesController.getSummary.bind(batchesController));
router.get('/:id', authenticate, batchesController.findById.bind(batchesController));
router.patch('/:id', authenticate, authorize('FARMER', 'LOGISTICS', 'ADMIN'), batchesController.update.bind(batchesController));
router.delete('/:id', authenticate, authorize('ADMIN'), batchesController.delete.bind(batchesController));

export default router;

