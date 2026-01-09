import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import companiesService from './companies.service';
import { paginationSchema } from '../../utils/validation';

const createCompanySchema = z.object({
  name: z.string().min(1),
  companyType: z.enum(['FARM', 'LOGISTICS', 'RETAIL', 'PROCESSOR']),
  country: z.string().optional(),
});

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  companyType: z.enum(['FARM', 'LOGISTICS', 'RETAIL', 'PROCESSOR']).optional(),
  country: z.string().optional(),
});

export class CompaniesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCompanySchema.parse(req.body);
      const company = await companiesService.create(data);
      res.status(201).json(company);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const result = await companiesService.findAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const company = await companiesService.findById(id);
      res.json(company);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateCompanySchema.parse(req.body);
      const company = await companiesService.update(id, data);
      res.json(company);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await companiesService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CompaniesController();

