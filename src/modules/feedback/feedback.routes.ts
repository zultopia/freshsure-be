import { Router } from 'express';
import feedbackController from './feedback.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Create feedback
 *     tags: [Feedback]
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
 *               - feedbackType
 *               - message
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               feedbackType:
 *                 type: string
 *                 enum: [inventory_stock, quality_issue, logistics_delay, pricing_concern, other]
 *                 example: inventory_stock
 *               message:
 *                 type: string
 *                 example: Stock count is incorrect
 *     responses:
 *       201:
 *         description: Feedback created successfully
 */
router.post('/', authenticate, feedbackController.create.bind(feedbackController));

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedback
 *     tags: [Feedback]
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
 *         name: batchId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: feedbackType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of feedback
 */
router.get('/', authenticate, feedbackController.findAll.bind(feedbackController));

/**
 * @swagger
 * /feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
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
 *         description: Feedback details
 */
router.get('/:id', authenticate, feedbackController.findById.bind(feedbackController));

export default router;

