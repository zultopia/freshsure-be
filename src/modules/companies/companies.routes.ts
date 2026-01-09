import { Router } from 'express';
import companiesController from './companies.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), companiesController.create.bind(companiesController));
router.get('/', authenticate, companiesController.findAll.bind(companiesController));
router.get('/:id', authenticate, companiesController.findById.bind(companiesController));
router.patch('/:id', authenticate, authorize('ADMIN'), companiesController.update.bind(companiesController));
router.delete('/:id', authenticate, authorize('ADMIN'), companiesController.delete.bind(companiesController));

export default router;

