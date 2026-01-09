import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import sensorsService from './sensors.service';
import { paginationSchema, dateRangeSchema } from '../../utils/validation';

const createSensorSchema = z.object({
  sensorType: z.enum(['TEMPERATURE', 'HUMIDITY', 'PH', 'IMAGING', 'MANUAL', 'GAS', 'PRESSURE']),
  model: z.string().optional(),
  installedAt: z.string().optional(),
});

const createReadingSchema = z.object({
  batchId: z.string().uuid(),
  sensorId: z.string().uuid(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  ph: z.number().optional(),
  gasLevel: z.number().optional(),
  pressure: z.number().optional(),
  imageUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export class SensorsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSensorSchema.parse(req.body);
      const sensor = await sensorsService.create(data);
      res.status(201).json(sensor);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const result = await sensorsService.findAll(page, limit, isActive);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sensor = await sensorsService.findById(id);
      res.json(sensor);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = z.object({
        model: z.string().optional(),
        installedAt: z.string().optional(),
        isActive: z.boolean().optional(),
      }).parse(req.body);
      const sensor = await sensorsService.update(id, data);
      res.json(sensor);
    } catch (error) {
      next(error);
    }
  }

  async createReading(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createReadingSchema.parse(req.body);
      const reading = await sensorsService.createReading(data);
      res.status(201).json(reading);
    } catch (error) {
      next(error);
    }
  }

  async getReadings(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId } = req.params;
      const { page, limit } = paginationSchema.parse(req.query);
      const { startDate, endDate } = dateRangeSchema.parse(req.query);
      const result = await sensorsService.getReadings(batchId, page, limit, startDate, endDate);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new SensorsController();

