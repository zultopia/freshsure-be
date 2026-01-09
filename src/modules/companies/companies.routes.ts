import { Router } from 'express';
import companiesController from './companies.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company (Admin only)
 *     tags: [Companies]
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
 *               - companyType
 *             properties:
 *               name:
 *                 type: string
 *                 example: Green Farm
 *               companyType:
 *                 type: string
 *                 enum: [FARM, LOGISTICS, RETAIL, PROCESSOR]
 *                 example: FARM
 *               country:
 *                 type: string
 *                 example: Indonesia
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', authenticate, authorize('ADMIN'), companiesController.create.bind(companiesController));

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', authenticate, companiesController.findAll.bind(companiesController));

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
router.get('/:id', authenticate, companiesController.findById.bind(companiesController));

/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     summary: Update company (Admin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               companyType:
 *                 type: string
 *                 enum: [FARM, LOGISTICS, RETAIL, PROCESSOR]
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       403:
 *         description: Forbidden - Admin access required
 */
router.patch('/:id', authenticate, authorize('ADMIN'), companiesController.update.bind(companiesController));

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete company (Admin only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Company ID
 *     responses:
 *       204:
 *         description: Company deleted successfully
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/:id', authenticate, authorize('ADMIN'), companiesController.delete.bind(companiesController));

export default router;

