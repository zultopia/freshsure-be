import { User, Company } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User & { company?: Company };
    }
  }
}

