import { Router } from 'express';
import outcomesController from './outcomes.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, outcomesController.create.bind(outcomesController));
router.get('/', authenticate, outcomesController.findAll.bind(outcomesController));
router.get('/stats', authenticate, outcomesController.getStats.bind(outcomesController));
router.get('/:id', authenticate, outcomesController.findById.bind(outcomesController));

export default router;

