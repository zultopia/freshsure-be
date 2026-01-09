import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import qualityService from './quality.service';

const createQualityScoreSchema = z.object({
  batchId: z.string().uuid(),
  qualityScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
});

const createShelfLifePredictionSchema = z.object({
  batchId: z.string().uuid(),
  remainingHours: z.number().positive(),
  minEstimate: z.number().positive(),
  maxEstimate: z.number().positive(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export class QualityController {
  async createQualityScore(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createQualityScoreSchema.parse(req.body);
      const score = await qualityService.createQualityScore(data);
      res.status(201).json(score);
    } catch (error) {
      next(error);
    }
  }

  async getLatestQualityScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId } = req.params;
      const score = await qualityService.getLatestQualityScore(batchId);
      res.json(score);
    } catch (error) {
      next(error);
    }
  }

  async getQualityHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const history = await qualityService.getQualityHistory(batchId, limit);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async createShelfLifePrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createShelfLifePredictionSchema.parse(req.body);
      const prediction = await qualityService.createShelfLifePrediction(data);
      res.status(201).json(prediction);
    } catch (error) {
      next(error);
    }
  }

  async getLatestShelfLifePrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId } = req.params;
      const prediction = await qualityService.getLatestShelfLifePrediction(batchId);
      res.json(prediction);
    } catch (error) {
      next(error);
    }
  }

  async getShelfLifeHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const history = await qualityService.getShelfLifeHistory(batchId, limit);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async getQualityPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const performance = await qualityService.getQualityPerformance(companyId, days);
      res.json(performance);
    } catch (error) {
      next(error);
    }
  }
}

export default new QualityController();

