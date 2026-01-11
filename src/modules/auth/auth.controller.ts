import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import authService from './auth.service';
import { AppError } from '../../middleware/errorHandler';
import { uploadFileToSupabase } from '../../utils/supabase';
import { config } from '../../config/env';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['FARMER', 'LOGISTICS', 'RETAIL', 'ADMIN']),
  companyId: z.string().uuid(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data.email, data.password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const profile = await authService.getProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const updateSchema = z.object({
        name: z.string().min(1).optional(),
      });

      const bodyData = updateSchema.parse(req.body);
      
      let profilePicture: string | undefined;
      if (req.file) {
        // Upload file to Supabase Storage
        const { publicUrl } = await uploadFileToSupabase({
          file: req.file,
          bucket: config.supabase.storageBucket,
          folder: 'profiles',
        });
        profilePicture = publicUrl;
      }

      const updatedProfile = await authService.updateProfile(req.user.id, {
        ...bodyData,
        ...(profilePicture && { profilePicture }),
      });

      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();

