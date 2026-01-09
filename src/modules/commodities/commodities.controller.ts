import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import commoditiesService from './commodities.service';
import { paginationSchema } from '../../utils/validation';

const createCommoditySchema = z.object({
  name: z.string().min(1),
  category: z.enum(['FRUIT', 'VEGETABLE', 'MEAT', 'DAIRY', 'GRAIN', 'OTHER']),
  baseShelfLifeDays: z.number().int().positive(),
});

const updateCommoditySchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['FRUIT', 'VEGETABLE', 'MEAT', 'DAIRY', 'GRAIN', 'OTHER']).optional(),
  baseShelfLifeDays: z.number().int().positive().optional(),
});

export class CommoditiesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCommoditySchema.parse(req.body);
      const commodity = await commoditiesService.create(data);
      res.status(201).json(commodity);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const category = req.query.category as string | undefined;
      const result = await commoditiesService.findAll(page, limit, category);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const commodity = await commoditiesService.findById(id);
      res.json(commodity);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateCommoditySchema.parse(req.body);
      const commodity = await commoditiesService.update(id, data);
      res.json(commodity);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await commoditiesService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CommoditiesController();

