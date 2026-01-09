import { Router } from 'express';
import recommendationsController from './recommendations.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /recommendations:
 *   post:
 *     summary: Create a recommendation
 *     tags: [Recommendations]
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
 *               - recommendationType
 *               - explanation
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               recommendationType:
 *                 type: string
 *                 enum: [SELL_FAST, SELL_NORMAL, HOLD, DISCOUNT, DISPOSE]
 *                 example: SELL_FAST
 *               explanation:
 *                 type: string
 *                 example: Quality is good, recommend selling soon
 *               priority:
 *                 type: string
 *                 enum: [INFO, WARNING, CRITICAL]
 *                 example: WARNING
 *     responses:
 *       201:
 *         description: Recommendation created successfully
 */
router.post('/', authenticate, recommendationsController.create.bind(recommendationsController));

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Get all recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, CRITICAL]
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of recommendations
 */
router.get('/', authenticate, recommendationsController.findAll.bind(recommendationsController));

/**
 * @swagger
 * /recommendations/priority/{priority}:
 *   get:
 *     summary: Get recommendations by priority
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: priority
 *         required: true
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, CRITICAL]
 *     responses:
 *       200:
 *         description: List of recommendations filtered by priority
 */
router.get('/priority/:priority', authenticate, recommendationsController.getByPriority.bind(recommendationsController));

/**
 * @swagger
 * /recommendations/{id}:
 *   get:
 *     summary: Get recommendation by ID
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Recommendation details
 */
router.get('/:id', authenticate, recommendationsController.findById.bind(recommendationsController));

/**
 * @swagger
 * /recommendations/{id}:
 *   patch:
 *     summary: Update recommendation
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recommendationType:
 *                 type: string
 *                 enum: [SELL_FAST, SELL_NORMAL, HOLD, DISCOUNT, DISPOSE]
 *               explanation:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [INFO, WARNING, CRITICAL]
 *     responses:
 *       200:
 *         description: Recommendation updated successfully
 */
router.patch('/:id', authenticate, recommendationsController.update.bind(recommendationsController));

export default router;

