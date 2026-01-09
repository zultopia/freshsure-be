import { Router } from 'express';
import logisticsController from './logistics.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /logistics/routes:
 *   post:
 *     summary: Create a logistics route (Logistics/Admin only)
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *             properties:
 *               origin:
 *                 type: string
 *                 example: Farm Warehouse A
 *               destination:
 *                 type: string
 *                 example: Retail Store B
 *               estimatedDuration:
 *                 type: number
 *                 example: 120
 *     responses:
 *       201:
 *         description: Route created successfully
 */
router.post('/routes', authenticate, authorize('LOGISTICS', 'ADMIN'), logisticsController.createRoute.bind(logisticsController));

/**
 * @swagger
 * /logistics/routes:
 *   get:
 *     summary: Get all logistics routes
 *     tags: [Logistics]
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
 *     responses:
 *       200:
 *         description: List of logistics routes
 */
router.get('/routes', authenticate, logisticsController.findAllRoutes.bind(logisticsController));

/**
 * @swagger
 * /logistics/routes/{id}:
 *   get:
 *     summary: Get logistics route by ID
 *     tags: [Logistics]
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
 *         description: Route details
 */
router.get('/routes/:id', authenticate, logisticsController.findRouteById.bind(logisticsController));

/**
 * @swagger
 * /logistics/batch-routes:
 *   post:
 *     summary: Create batch route assignment (Logistics/Admin only)
 *     tags: [Logistics]
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
 *               - routeId
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               routeId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Batch route created successfully
 */
router.post('/batch-routes', authenticate, authorize('LOGISTICS', 'ADMIN'), logisticsController.createBatchRoute.bind(logisticsController));

/**
 * @swagger
 * /logistics/batch-routes/{id}/status:
 *   patch:
 *     summary: Update batch route status (Logistics/Admin only)
 *     tags: [Logistics]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_TRANSIT, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Batch route status updated successfully
 */
router.patch('/batch-routes/:id/status', authenticate, authorize('LOGISTICS', 'ADMIN'), logisticsController.updateBatchRouteStatus.bind(logisticsController));

/**
 * @swagger
 * /logistics/batches/{batchId}/routes:
 *   get:
 *     summary: Get routes for a batch
 *     tags: [Logistics]
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
 *         description: List of routes for the batch
 */
router.get('/batches/:batchId/routes', authenticate, logisticsController.getBatchRoutes.bind(logisticsController));

/**
 * @swagger
 * /logistics/active:
 *   get:
 *     summary: Get active logistics routes
 *     tags: [Logistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active routes
 */
router.get('/active', authenticate, logisticsController.getActiveRoutes.bind(logisticsController));

export default router;

