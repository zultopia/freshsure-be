import { Router } from 'express';
import sensorsController from './sensors.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /sensors:
 *   post:
 *     summary: Create a new sensor (Admin/Farmer only)
 *     tags: [Sensors]
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
 *               - sensorType
 *             properties:
 *               name:
 *                 type: string
 *                 example: Temperature Sensor 1
 *               sensorType:
 *                 type: string
 *                 example: TEMPERATURE
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sensor created successfully
 */
router.post('/', authenticate, authorize('ADMIN', 'FARMER'), sensorsController.create.bind(sensorsController));

/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Get all sensors
 *     tags: [Sensors]
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
 *         description: List of sensors
 */
router.get('/', authenticate, sensorsController.findAll.bind(sensorsController));

/**
 * @swagger
 * /sensors/{id}:
 *   get:
 *     summary: Get sensor by ID
 *     tags: [Sensors]
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
 *         description: Sensor details
 */
router.get('/:id', authenticate, sensorsController.findById.bind(sensorsController));

/**
 * @swagger
 * /sensors/{id}:
 *   patch:
 *     summary: Update sensor (Admin/Farmer only)
 *     tags: [Sensors]
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
 *               sensorType:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sensor updated successfully
 */
router.patch('/:id', authenticate, authorize('ADMIN', 'FARMER'), sensorsController.update.bind(sensorsController));

/**
 * @swagger
 * /sensors/readings:
 *   post:
 *     summary: Create sensor reading
 *     tags: [Sensors]
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
 *               - sensorId
 *             properties:
 *               batchId:
 *                 type: string
 *                 format: uuid
 *               sensorId:
 *                 type: string
 *                 format: uuid
 *               temperature:
 *                 type: number
 *                 example: 4.5
 *               humidity:
 *                 type: number
 *                 example: 85.2
 *     responses:
 *       201:
 *         description: Sensor reading created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorReading'
 */
router.post('/readings', authenticate, sensorsController.createReading.bind(sensorsController));

/**
 * @swagger
 * /sensors/batches/{batchId}/readings:
 *   get:
 *     summary: Get sensor readings for a batch
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
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
 *           default: 50
 *     responses:
 *       200:
 *         description: List of sensor readings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorReading'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/batches/:batchId/readings', authenticate, sensorsController.getReadings.bind(sensorsController));

export default router;

