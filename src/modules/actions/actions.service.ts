import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class ActionsService {
  async create(data: {
    recommendationId: string;
    userId: string;
    actionTaken: string;
    notes?: string;
  }) {
    return prisma.action.create({
      data: {
        recommendationId: data.recommendationId,
        userId: data.userId,
        actionTaken: data.actionTaken as any,
        notes: data.notes,
        executedAt: new Date(),
      },
      include: {
        recommendation: {
          include: {
            batch: {
              select: {
                id: true,
                commodity: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      userId?: string;
      recommendationId?: string;
      actionTaken?: string;
      companyId?: string;
    }
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.ActionWhereInput = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.recommendationId) {
      where.recommendationId = filters.recommendationId;
    }

    if (filters?.actionTaken) {
      where.actionTaken = filters.actionTaken as any;
    }

    if (filters?.companyId) {
      where.user = {
        companyId: filters.companyId,
      };
    }

    const [actions, total] = await Promise.all([
      prisma.action.findMany({
        where,
        skip,
        take: limit,
        include: {
          recommendation: {
            include: {
              batch: {
                select: {
                  id: true,
                  commodity: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.action.count({ where }),
    ]);

    return {
      data: actions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const action = await prisma.action.findUnique({
      where: { id },
      include: {
        recommendation: {
          include: {
            batch: {
              include: {
                commodity: true,
                ownerCompany: true,
              },
            },
          },
        },
        user: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!action) {
      throw new AppError('Action not found', 404);
    }

    return action;
  }

  async update(id: string, data: {
    actionTaken?: string;
    notes?: string;
  }) {
    return prisma.action.update({
      where: { id },
      data: {
        actionTaken: data.actionTaken as any,
        notes: data.notes,
        executedAt: data.actionTaken ? new Date() : undefined,
      },
    });
  }

  async getActionStats(companyId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: Prisma.ActionWhereInput = {
      createdAt: {
        gte: startDate,
      },
    };

    if (companyId) {
      where.user = {
        companyId,
      };
    }

    const [total, byStatus, recent] = await Promise.all([
      prisma.action.count({ where }),
      prisma.action.groupBy({
        by: ['actionTaken'],
        where,
        _count: true,
      }),
      prisma.action.findMany({
        where,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          recommendation: {
            include: {
              batch: {
                select: {
                  commodity: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.actionTaken] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recent,
    };
  }
}

export default new ActionsService();

