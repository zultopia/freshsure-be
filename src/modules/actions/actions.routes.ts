import { Router } from 'express';
import actionsController from './actions.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, actionsController.create.bind(actionsController));
router.get('/', authenticate, actionsController.findAll.bind(actionsController));
router.get('/stats', authenticate, actionsController.getStats.bind(actionsController));
router.get('/:id', authenticate, actionsController.findById.bind(actionsController));
router.patch('/:id', authenticate, actionsController.update.bind(actionsController));

export default router;

