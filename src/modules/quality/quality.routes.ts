import { Router } from 'express';
import qualityController from './quality.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Quality scores
router.post('/scores', authenticate, qualityController.createQualityScore.bind(qualityController));
router.get('/batches/:batchId/scores/latest', authenticate, qualityController.getLatestQualityScore.bind(qualityController));
router.get('/batches/:batchId/scores/history', authenticate, qualityController.getQualityHistory.bind(qualityController));

// Shelf life predictions
router.post('/predictions', authenticate, qualityController.createShelfLifePrediction.bind(qualityController));
router.get('/batches/:batchId/predictions/latest', authenticate, qualityController.getLatestShelfLifePrediction.bind(qualityController));
router.get('/batches/:batchId/predictions/history', authenticate, qualityController.getShelfLifeHistory.bind(qualityController));

// Performance analytics
router.get('/performance', authenticate, qualityController.getQualityPerformance.bind(qualityController));

export default router;

