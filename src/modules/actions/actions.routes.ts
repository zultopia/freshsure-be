import { Router } from 'express';
import actionsController from './actions.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /actions:
 *   post:
 *     summary: Create an action
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recommendationId
 *               - actionTaken
 *             properties:
 *               recommendationId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               actionTaken:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED, PENDING]
 *                 example: ACCEPTED
 *               notes:
 *                 type: string
 *                 example: Will sell within 2 days
 *     responses:
 *       201:
 *         description: Action created successfully
 */
router.post('/', authenticate, actionsController.create.bind(actionsController));

/**
 * @swagger
 * /actions:
 *   get:
 *     summary: Get all actions
 *     tags: [Actions]
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
 *     responses:
 *       200:
 *         description: List of actions
 */
router.get('/', authenticate, actionsController.findAll.bind(actionsController));

/**
 * @swagger
 * /actions/stats:
 *   get:
 *     summary: Get action statistics
 *     tags: [Actions]
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
 *           default: 30
 *     responses:
 *       200:
 *         description: Action statistics
 */
router.get('/stats', authenticate, actionsController.getStats.bind(actionsController));

/**
 * @swagger
 * /actions/{id}:
 *   get:
 *     summary: Get action by ID
 *     tags: [Actions]
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
 *         description: Action details
 */
router.get('/:id', authenticate, actionsController.findById.bind(actionsController));

/**
 * @swagger
 * /actions/{id}:
 *   patch:
 *     summary: Update action
 *     tags: [Actions]
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
 *               actionTaken:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED, PENDING]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action updated successfully
 */
router.patch('/:id', authenticate, actionsController.update.bind(actionsController));

export default router;

