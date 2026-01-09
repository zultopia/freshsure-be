import { Router } from 'express';
import batchesController from './batches.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /batches:
 *   post:
 *     summary: Create a new batch (Farmer/Admin only)
 *     tags: [Batches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commodityId
 *               - ownerCompanyId
 *               - quantity
 *               - unit
 *             properties:
 *               commodityId:
 *                 type: string
 *                 format: uuid
 *               ownerCompanyId:
 *                 type: string
 *                 format: uuid
 *               harvestDate:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: number
 *                 example: 100
 *               unit:
 *                 type: string
 *                 example: kg
 *               currentLocation:
 *                 type: string
 *                 example: Farm Warehouse
 *     responses:
 *       201:
 *         description: Batch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 */
router.post('/', authenticate, authorize('FARMER', 'ADMIN'), batchesController.create.bind(batchesController));

/**
 * @swagger
 * /batches:
 *   get:
 *     summary: Get all batches
 *     tags: [Batches]
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
 *         name: commodityId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, SOLD, DOWNGRADED, SPOILED, IN_TRANSIT]
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
 *         description: List of batches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Batch'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', authenticate, batchesController.findAll.bind(batchesController));

/**
 * @swagger
 * /batches/summary:
 *   get:
 *     summary: Get batch summary statistics
 *     tags: [Batches]
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
 *         description: Batch summary statistics
 */
router.get('/summary', authenticate, batchesController.getSummary.bind(batchesController));

/**
 * @swagger
 * /batches/{id}:
 *   get:
 *     summary: Get batch by ID
 *     tags: [Batches]
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
 *         description: Batch details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 */
router.get('/:id', authenticate, batchesController.findById.bind(batchesController));

/**
 * @swagger
 * /batches/{id}:
 *   patch:
 *     summary: Update batch (Farmer/Logistics/Admin only)
 *     tags: [Batches]
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
 *               harvestDate:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               currentLocation:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, SOLD, DOWNGRADED, SPOILED, IN_TRANSIT]
 *     responses:
 *       200:
 *         description: Batch updated successfully
 */
router.patch('/:id', authenticate, authorize('FARMER', 'LOGISTICS', 'ADMIN'), batchesController.update.bind(batchesController));

/**
 * @swagger
 * /batches/{id}:
 *   delete:
 *     summary: Delete batch (Admin only)
 *     tags: [Batches]
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
 *         description: Batch deleted successfully
 */
router.delete('/:id', authenticate, authorize('ADMIN'), batchesController.delete.bind(batchesController));

export default router;

