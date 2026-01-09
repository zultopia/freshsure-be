import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import feedbackService from './feedback.service';
import { paginationSchema } from '../../utils/validation';
import { AppError } from '../../middleware/errorHandler';

const createFeedbackSchema = z.object({
  userId: z.string().uuid(),
  batchId: z.string().uuid().optional(),
  feedbackType: z.string().min(1),
  message: z.string().min(1),
});

export class FeedbackController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const data = createFeedbackSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const feedback = await feedbackService.create(data);
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const filters = {
        userId: req.query.userId as string | undefined,
        batchId: req.query.batchId as string | undefined,
        feedbackType: req.query.feedbackType as string | undefined,
      };
      const result = await feedbackService.findAll(page, limit, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const feedback = await feedbackService.findById(id);
      res.json(feedback);
    } catch (error) {
      next(error);
    }
  }
}

export default new FeedbackController();

