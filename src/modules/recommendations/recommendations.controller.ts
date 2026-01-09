import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import recommendationsService from './recommendations.service';
import { paginationSchema } from '../../utils/validation';

const createRecommendationSchema = z.object({
  batchId: z.string().uuid(),
  recommendationType: z.enum(['SELL_FAST', 'STORE', 'REROUTE', 'DOWNGRADE', 'DISCOUNT', 'PRIORITY_SHIP']),
  explanation: z.string().optional(),
  priority: z.enum(['INFO', 'WARNING', 'CRITICAL']),
});

const updateRecommendationSchema = z.object({
  explanation: z.string().optional(),
  priority: z.enum(['INFO', 'WARNING', 'CRITICAL']).optional(),
});

export class RecommendationsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRecommendationSchema.parse(req.body);
      const recommendation = await recommendationsService.create(data);
      res.status(201).json(recommendation);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const filters = {
        batchId: req.query.batchId as string | undefined,
        priority: req.query.priority as string | undefined,
        recommendationType: req.query.recommendationType as string | undefined,
        companyId: req.query.companyId as string | undefined,
      };
      const result = await recommendationsService.findAll(page, limit, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const recommendation = await recommendationsService.findById(id);
      res.json(recommendation);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateRecommendationSchema.parse(req.body);
      const recommendation = await recommendationsService.update(id, data);
      res.json(recommendation);
    } catch (error) {
      next(error);
    }
  }

  async getByPriority(req: Request, res: Response, next: NextFunction) {
    try {
      const { priority } = req.params;
      const companyId = req.query.companyId as string | undefined;
      const recommendations = await recommendationsService.getByPriority(priority, companyId);
      res.json(recommendations);
    } catch (error) {
      next(error);
    }
  }
}

export default new RecommendationsController();

