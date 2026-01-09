import { Router } from 'express';
import qualityController from './quality.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /quality/scores:
 *   post:
 *     summary: Create quality score
 *     tags: [Quality]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchId
 *               - qualityScore
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               qualityScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 85
 *               confidence:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 example: 0.92
 *     responses:
 *       201:
 *         description: Quality score created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QualityScore'
 */
router.post('/scores', authenticate, qualityController.createQualityScore.bind(qualityController));

/**
 * @swagger
 * /quality/batches/{batchId}/scores/latest:
 *   get:
 *     summary: Get latest quality score for a batch
 *     tags: [Quality]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Latest quality score
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QualityScore'
 */
router.get('/batches/:batchId/scores/latest', authenticate, qualityController.getLatestQualityScore.bind(qualityController));

/**
 * @swagger
 * /quality/batches/{batchId}/scores/history:
 *   get:
 *     summary: Get quality score history for a batch
 *     tags: [Quality]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Quality score history
 */
router.get('/batches/:batchId/scores/history', authenticate, qualityController.getQualityHistory.bind(qualityController));

/**
 * @swagger
 * /quality/predictions:
 *   post:
 *     summary: Create shelf life prediction
 *     tags: [Quality]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batchId
 *               - predictedShelfLife
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               predictedShelfLife:
 *                 type: number
 *                 example: 7
 *               confidence:
 *                 type: number
 *                 example: 0.88
 *     responses:
 *       201:
 *         description: Shelf life prediction created successfully
 */
router.post('/predictions', authenticate, qualityController.createShelfLifePrediction.bind(qualityController));

/**
 * @swagger
 * /quality/batches/{batchId}/predictions/latest:
 *   get:
 *     summary: Get latest shelf life prediction for a batch
 *     tags: [Quality]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Latest shelf life prediction
 */
router.get('/batches/:batchId/predictions/latest', authenticate, qualityController.getLatestShelfLifePrediction.bind(qualityController));

/**
 * @swagger
 * /quality/batches/{batchId}/predictions/history:
 *   get:
 *     summary: Get shelf life prediction history for a batch
 *     tags: [Quality]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Shelf life prediction history
 */
router.get('/batches/:batchId/predictions/history', authenticate, qualityController.getShelfLifeHistory.bind(qualityController));

/**
 * @swagger
 * /quality/performance:
 *   get:
 *     summary: Get quality performance analytics
 *     tags: [Quality]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Quality performance metrics
 */
router.get('/performance', authenticate, qualityController.getQualityPerformance.bind(qualityController));

export default router;

