import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import actionsService from './actions.service';
import { paginationSchema } from '../../utils/validation';

const createActionSchema = z.object({
  recommendationId: z.string().uuid(),
  userId: z.string().uuid(),
  actionTaken: z.enum(['ACCEPTED', 'MODIFIED', 'IGNORED', 'PENDING']),
  notes: z.string().optional(),
});

const updateActionSchema = z.object({
  actionTaken: z.enum(['ACCEPTED', 'MODIFIED', 'IGNORED', 'PENDING']).optional(),
  notes: z.string().optional(),
});

export class ActionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createActionSchema.parse(req.body);
      const action = await actionsService.create(data);
      res.status(201).json(action);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const filters = {
        userId: req.query.userId as string | undefined,
        recommendationId: req.query.recommendationId as string | undefined,
        actionTaken: req.query.actionTaken as string | undefined,
        companyId: req.query.companyId as string | undefined,
      };
      const result = await actionsService.findAll(page, limit, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const action = await actionsService.findById(id);
      res.json(action);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateActionSchema.parse(req.body);
      const action = await actionsService.update(id, data);
      res.json(action);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const stats = await actionsService.getActionStats(companyId, days);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new ActionsController();

