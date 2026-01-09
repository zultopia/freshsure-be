import { Router } from 'express';
import outcomesController from './outcomes.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /outcomes:
 *   post:
 *     summary: Create outcome record
 *     tags: [Outcomes]
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
 *               - outcomeType
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               outcomeType:
 *                 type: string
 *                 enum: [SOLD, SPOILED, DOWNGRADED, DONATED]
 *                 example: SOLD
 *               finalPrice:
 *                 type: number
 *                 example: 25000
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Outcome created successfully
 */
router.post('/', authenticate, outcomesController.create.bind(outcomesController));

/**
 * @swagger
 * /outcomes:
 *   get:
 *     summary: Get all outcomes
 *     tags: [Outcomes]
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
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: outcomeType
 *         schema:
 *           type: string
 *           enum: [SOLD, SPOILED, DOWNGRADED, DONATED]
 *     responses:
 *       200:
 *         description: List of outcomes
 */
router.get('/', authenticate, outcomesController.findAll.bind(outcomesController));

/**
 * @swagger
 * /outcomes/stats:
 *   get:
 *     summary: Get outcome statistics
 *     tags: [Outcomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Outcome statistics
 */
router.get('/stats', authenticate, outcomesController.getStats.bind(outcomesController));

/**
 * @swagger
 * /outcomes/{id}:
 *   get:
 *     summary: Get outcome by ID
 *     tags: [Outcomes]
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
 *         description: Outcome details
 */
router.get('/:id', authenticate, outcomesController.findById.bind(outcomesController));

export default router;

