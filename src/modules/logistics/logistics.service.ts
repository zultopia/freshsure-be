import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class LogisticsService {
  async createRoute(data: {
    fromLocation: string;
    toLocation: string;
    distanceKm: number;
    estimatedTimeHr: number;
    companyId?: string;
  }) {
    return prisma.route.create({
      data: {
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        distanceKm: data.distanceKm,
        estimatedTimeHr: data.estimatedTimeHr,
        companyId: data.companyId,
      },
    });
  }

  async findAllRoutes(page: number = 1, limit: number = 10, companyId?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.RouteWhereInput = {};
    if (companyId) {
      where.companyId = companyId;
    }

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              batchRoutes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.route.count({ where }),
    ]);

    return {
      data: routes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findRouteById(id: string) {
    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        batchRoutes: {
          include: {
            batch: {
              include: {
                commodity: true,
              },
            },
          },
        },
      },
    });

    if (!route) {
      throw new AppError('Route not found', 404);
    }

    return route;
  }

  async createBatchRoute(data: {
    batchId: string;
    routeId: string;
  }) {
    return prisma.batchRoute.create({
      data: {
        batchId: data.batchId,
        routeId: data.routeId,
        status: 'PLANNED',
      },
      include: {
        batch: {
          include: {
            commodity: true,
          },
        },
        route: true,
      },
    });
  }

  async updateBatchRouteStatus(
    id: string,
    status: string,
    startedAt?: Date,
    endedAt?: Date
  ) {
    return prisma.batchRoute.update({
      where: { id },
      data: {
        status: status as any,
        startedAt,
        endedAt,
      },
      include: {
        batch: {
          include: {
            commodity: true,
          },
        },
        route: true,
      },
    });
  }

  async getBatchRoutes(
    batchId: string,
    status?: string
  ) {
    const where: Prisma.BatchRouteWhereInput = {
      batchId,
    };

    if (status) {
      where.status = status as any;
    }

    return prisma.batchRoute.findMany({
      where,
      include: {
        route: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveRoutes(companyId?: string) {
    const where: Prisma.BatchRouteWhereInput = {
      status: {
        in: ['PLANNED', 'IN_TRANSIT'],
      },
    };

    if (companyId) {
      where.batch = {
        ownerCompanyId: companyId,
      };
    }

    return prisma.batchRoute.findMany({
      where,
      include: {
        batch: {
          include: {
            commodity: true,
            ownerCompany: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        route: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new LogisticsService();

