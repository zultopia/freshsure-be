import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import analyticsService from './analytics.service';

const createWeeklyMetricSchema = z.object({
  companyId: z.string().uuid(),
  weekStart: z.coerce.date(),
  wasteReductionPct: z.number().optional(),
  revenueUpliftPct: z.number().optional(),
  avgShelfLifeGainHr: z.number().optional(),
});

export class AnalyticsController {
  async createWeeklyMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createWeeklyMetricSchema.parse(req.body);
      const metric = await analyticsService.createWeeklyMetric(data);
      res.status(201).json(metric);
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const weeks = req.query.weeks ? parseInt(req.query.weeks as string, 10) : 12;
      const metrics = await analyticsService.getWeeklyMetrics(companyId, weeks);
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const stats = await analyticsService.getDashboardStats(companyId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();

