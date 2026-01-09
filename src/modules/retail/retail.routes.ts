import { Router } from 'express';
import retailController from './retail.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /retail/stores:
 *   post:
 *     summary: Create a retail store (Retail/Admin only)
 *     tags: [Retail]
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
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: Supermarket A
 *               location:
 *                 type: string
 *                 example: Jakarta
 *     responses:
 *       201:
 *         description: Store created successfully
 */
router.post('/stores', authenticate, authorize('RETAIL', 'ADMIN'), retailController.createStore.bind(retailController));

/**
 * @swagger
 * /retail/inventory:
 *   post:
 *     summary: Create inventory entry (Retail/Admin only)
 *     tags: [Retail]
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
 *               - storeId
 *               - quantity
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               storeId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Inventory entry created successfully
 */
router.post('/inventory', authenticate, authorize('RETAIL', 'ADMIN'), retailController.createInventory.bind(retailController));

/**
 * @swagger
 * /retail/inventory:
 *   get:
 *     summary: Get inventory
 *     tags: [Retail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
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
 *         description: List of inventory items
 */
router.get('/inventory', authenticate, retailController.getInventory.bind(retailController));

/**
 * @swagger
 * /retail/inventory/low-stock:
 *   get:
 *     summary: Get low stock inventory items
 *     tags: [Retail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of low stock items
 */
router.get('/inventory/low-stock', authenticate, retailController.getLowStock.bind(retailController));

/**
 * @swagger
 * /retail/pricing/recommendations:
 *   post:
 *     summary: Create pricing recommendation (Retail/Admin only)
 *     tags: [Retail]
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
 *               - recommendedPrice
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               recommendedPrice:
 *                 type: number
 *                 example: 25000
 *               reason:
 *                 type: string
 *                 example: Quality is excellent
 *     responses:
 *       201:
 *         description: Pricing recommendation created successfully
 */
router.post('/pricing/recommendations', authenticate, authorize('RETAIL', 'ADMIN'), retailController.createPricingRecommendation.bind(retailController));

/**
 * @swagger
 * /retail/pricing/recommendations:
 *   get:
 *     summary: Get pricing recommendations
 *     tags: [Retail]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: batchId
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
 *         description: List of pricing recommendations
 */
router.get('/pricing/recommendations', authenticate, retailController.getPricingRecommendations.bind(retailController));

export default router;

