import { Router } from 'express';
import recommendationsController from './recommendations.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, recommendationsController.create.bind(recommendationsController));
router.get('/', authenticate, recommendationsController.findAll.bind(recommendationsController));
router.get('/priority/:priority', authenticate, recommendationsController.getByPriority.bind(recommendationsController));
router.get('/:id', authenticate, recommendationsController.findById.bind(recommendationsController));
router.patch('/:id', authenticate, recommendationsController.update.bind(recommendationsController));

export default router;

