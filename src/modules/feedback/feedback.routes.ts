import { Router } from 'express';
import feedbackController from './feedback.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, feedbackController.create.bind(feedbackController));
router.get('/', authenticate, feedbackController.findAll.bind(feedbackController));
router.get('/:id', authenticate, feedbackController.findById.bind(feedbackController));

export default router;

