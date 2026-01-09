import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logisticsService from './logistics.service';
import { paginationSchema } from '../../utils/validation';

const createRouteSchema = z.object({
  fromLocation: z.string().min(1),
  toLocation: z.string().min(1),
  distanceKm: z.number().positive(),
  estimatedTimeHr: z.number().positive(),
  companyId: z.string().uuid().optional(),
});

const createBatchRouteSchema = z.object({
  batchId: z.string().uuid(),
  routeId: z.string().uuid(),
});

const updateBatchRouteStatusSchema = z.object({
  status: z.enum(['PLANNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
});

export class LogisticsController {
  async createRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRouteSchema.parse(req.body);
      const route = await logisticsService.createRoute(data);
      res.status(201).json(route);
    } catch (error) {
      next(error);
    }
  }

  async findAllRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const companyId = req.query.companyId as string | undefined;
      const result = await logisticsService.findAllRoutes(page, limit, companyId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findRouteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const route = await logisticsService.findRouteById(id);
      res.json(route);
    } catch (error) {
      next(error);
    }
  }

  async createBatchRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createBatchRouteSchema.parse(req.body);
      const batchRoute = await logisticsService.createBatchRoute(data);
      res.status(201).json(batchRoute);
    } catch (error) {
      next(error);
    }
  }

  async updateBatchRouteStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateBatchRouteStatusSchema.parse(req.body);
      const batchRoute = await logisticsService.updateBatchRouteStatus(
        id,
        data.status,
        data.startedAt,
        data.endedAt
      );
      res.json(batchRoute);
    } catch (error) {
      next(error);
    }
  }

  async getBatchRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const { batchId } = req.params;
      const status = req.query.status as string | undefined;
      const routes = await logisticsService.getBatchRoutes(batchId, status);
      res.json(routes);
    } catch (error) {
      next(error);
    }
  }

  async getActiveRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const routes = await logisticsService.getActiveRoutes(companyId);
      res.json(routes);
    } catch (error) {
      next(error);
    }
  }
}

export default new LogisticsController();

