import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import outcomesService from './outcomes.service';
import { paginationSchema, dateRangeSchema } from '../../utils/validation';

const createOutcomeSchema = z.object({
  batchId: z.string().uuid(),
  soldQty: z.number().nonnegative().optional(),
  wastedQty: z.number().nonnegative().optional(),
  avgSellPrice: z.number().nonnegative().optional(),
  spoilageReason: z.string().optional(),
});

export class OutcomesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createOutcomeSchema.parse(req.body);
      const outcome = await outcomesService.create(data);
      res.status(201).json(outcome);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const { startDate, endDate } = dateRangeSchema.parse(req.query);
      const filters = {
        batchId: req.query.batchId as string | undefined,
        companyId: req.query.companyId as string | undefined,
        startDate,
        endDate,
      };
      const result = await outcomesService.findAll(page, limit, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const outcome = await outcomesService.findById(id);
      res.json(outcome);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const stats = await outcomesService.getStats(companyId, days);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new OutcomesController();

