import { Router } from 'express';
import analyticsController from './analytics.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /analytics/weekly-metrics:
 *   post:
 *     summary: Create weekly metric (usually automated)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - weekStartDate
 *             properties:
 *               companyId:
 *                 type: string
 *                 format: uuid
 *               weekStartDate:
 *                 type: string
 *                 format: date
 *               totalBatches:
 *                 type: integer
 *               averageQuality:
 *                 type: number
 *     responses:
 *       201:
 *         description: Weekly metric created successfully
 */
router.post('/weekly-metrics', authenticate, analyticsController.createWeeklyMetric.bind(analyticsController));

/**
 * @swagger
 * /analytics/weekly-metrics:
 *   get:
 *     summary: Get weekly metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: weeks
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: List of weekly metrics
 */
router.get('/weekly-metrics', authenticate, analyticsController.getWeeklyMetrics.bind(analyticsController));

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Dashboard statistics including total batches, quality scores, recommendations, etc.
 */
router.get('/dashboard', authenticate, analyticsController.getDashboardStats.bind(analyticsController));

export default router;

