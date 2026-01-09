import { Router } from 'express';
import commoditiesController from './commodities.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'FARMER'), commoditiesController.create.bind(commoditiesController));
router.get('/', authenticate, commoditiesController.findAll.bind(commoditiesController));
router.get('/:id', authenticate, commoditiesController.findById.bind(commoditiesController));
router.patch('/:id', authenticate, authorize('ADMIN', 'FARMER'), commoditiesController.update.bind(commoditiesController));
router.delete('/:id', authenticate, authorize('ADMIN'), commoditiesController.delete.bind(commoditiesController));

export default router;

