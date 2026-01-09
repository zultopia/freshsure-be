import { Router } from 'express';
import commoditiesController from './commodities.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /commodities:
 *   post:
 *     summary: Create a new commodity (Admin/Farmer only)
 *     tags: [Commodities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tomatoes
 *               category:
 *                 type: string
 *                 example: Vegetables
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commodity created successfully
 */
router.post('/', authenticate, authorize('ADMIN', 'FARMER'), commoditiesController.create.bind(commoditiesController));

/**
 * @swagger
 * /commodities:
 *   get:
 *     summary: Get all commodities
 *     tags: [Commodities]
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
 *         description: List of commodities
 */
router.get('/', authenticate, commoditiesController.findAll.bind(commoditiesController));

/**
 * @swagger
 * /commodities/{id}:
 *   get:
 *     summary: Get commodity by ID
 *     tags: [Commodities]
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
 *         description: Commodity details
 */
router.get('/:id', authenticate, commoditiesController.findById.bind(commoditiesController));

/**
 * @swagger
 * /commodities/{id}:
 *   patch:
 *     summary: Update commodity (Admin/Farmer only)
 *     tags: [Commodities]
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
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commodity updated successfully
 */
router.patch('/:id', authenticate, authorize('ADMIN', 'FARMER'), commoditiesController.update.bind(commoditiesController));

/**
 * @swagger
 * /commodities/{id}:
 *   delete:
 *     summary: Delete commodity (Admin only)
 *     tags: [Commodities]
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
 *       204:
 *         description: Commodity deleted successfully
 */
router.delete('/:id', authenticate, authorize('ADMIN'), commoditiesController.delete.bind(commoditiesController));

export default router;

