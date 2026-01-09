import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class RecommendationsService {
  async create(data: {
    batchId: string;
    recommendationType: string;
    explanation?: string;
    priority: string;
  }) {
    return prisma.recommendation.create({
      data: {
        batchId: data.batchId,
        recommendationType: data.recommendationType as any,
        explanation: data.explanation,
        priority: data.priority as any,
      },
      include: {
        batch: {
          select: {
            id: true,
            commodity: true,
          },
        },
        actions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      batchId?: string;
      priority?: string;
      recommendationType?: string;
      companyId?: string;
    }
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.RecommendationWhereInput = {};

    if (filters?.batchId) {
      where.batchId = filters.batchId;
    }

    if (filters?.priority) {
      where.priority = filters.priority as any;
    }

    if (filters?.recommendationType) {
      where.recommendationType = filters.recommendationType as any;
    }

    if (filters?.companyId) {
      where.batch = {
        ownerCompanyId: filters.companyId,
      };
    }

    const [recommendations, total] = await Promise.all([
      prisma.recommendation.findMany({
        where,
        skip,
        take: limit,
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
          actions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.recommendation.count({ where }),
    ]);

    return {
      data: recommendations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            commodity: true,
            ownerCompany: true,
          },
        },
        actions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!recommendation) {
      throw new AppError('Recommendation not found', 404);
    }

    return recommendation;
  }

  async update(id: string, data: {
    explanation?: string;
    priority?: string;
  }) {
    return prisma.recommendation.update({
      where: { id },
      data: {
        explanation: data.explanation,
        priority: data.priority as any,
      },
    });
  }

  async getByPriority(priority: string, companyId?: string) {
    const where: Prisma.RecommendationWhereInput = {
      priority: priority as any,
    };

    if (companyId) {
      where.batch = {
        ownerCompanyId: companyId,
      };
    }

    return prisma.recommendation.findMany({
      where,
      include: {
        batch: {
          include: {
            commodity: true,
          },
        },
        actions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

export default new RecommendationsService();

