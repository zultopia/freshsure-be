import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import retailService from './retail.service';
import { paginationSchema } from '../../utils/validation';

const createStoreSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  companyId: z.string().uuid(),
});

const createInventorySchema = z.object({
  batchId: z.string().uuid(),
  storeId: z.string().uuid(),
  stockQty: z.number().positive(),
});

const createPricingRecommendationSchema = z.object({
  inventoryId: z.string().uuid(),
  originalPrice: z.number().positive(),
  recommendedPrice: z.number().positive(),
  discountPct: z.number().min(0).max(100),
  reason: z.string().optional(),
});

export class RetailController {
  async createStore(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createStoreSchema.parse(req.body);
      const store = await retailService.createStore(data);
      res.status(201).json(store);
    } catch (error) {
      next(error);
    }
  }

  async createInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createInventorySchema.parse(req.body);
      const inventory = await retailService.createInventory(data);
      res.status(201).json(inventory);
    } catch (error) {
      next(error);
    }
  }

  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const storeId = req.query.storeId as string | undefined;
      const result = await retailService.getInventory(storeId, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async createPricingRecommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPricingRecommendationSchema.parse(req.body);
      const recommendation = await retailService.createPricingRecommendation(data);
      res.status(201).json(recommendation);
    } catch (error) {
      next(error);
    }
  }

  async getPricingRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const inventoryId = req.query.inventoryId as string | undefined;
      const result = await retailService.getPricingRecommendations(inventoryId, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.query.storeId as string | undefined;
      const threshold = req.query.threshold ? parseFloat(req.query.threshold as string) : 10;
      const lowStock = await retailService.getLowStock(storeId, threshold);
      res.json(lowStock);
    } catch (error) {
      next(error);
    }
  }
}

export default new RetailController();

