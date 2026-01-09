import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import batchesService from './batches.service';
import { paginationSchema, dateRangeSchema } from '../../utils/validation';

const createBatchSchema = z.object({
  commodityId: z.string().uuid(),
  ownerCompanyId: z.string().uuid(),
  harvestDate: z.coerce.date().optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  currentLocation: z.string().optional(),
});

const updateBatchSchema = z.object({
  harvestDate: z.coerce.date().optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
  currentLocation: z.string().optional(),
  status: z.enum(['ACTIVE', 'SOLD', 'DOWNGRADED', 'SPOILED', 'IN_TRANSIT']).optional(),
});

export class BatchesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createBatchSchema.parse(req.body);
      const batch = await batchesService.create(data);
      res.status(201).json(batch);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const { startDate, endDate } = dateRangeSchema.parse(req.query);
      
      const filters = {
        companyId: req.query.companyId as string | undefined,
        commodityId: req.query.commodityId as string | undefined,
        status: req.query.status as string | undefined,
        startDate,
        endDate,
      };

      const result = await batchesService.findAll(page, limit, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const batch = await batchesService.findById(id);
      res.json(batch);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateBatchSchema.parse(req.body);
      const batch = await batchesService.update(id, data);
      res.json(batch);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await batchesService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const summary = await batchesService.getSummary(companyId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}

export default new BatchesController();

