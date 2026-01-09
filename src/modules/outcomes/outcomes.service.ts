import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class OutcomesService {
  async create(data: {
    batchId: string;
    soldQty?: number;
    wastedQty?: number;
    avgSellPrice?: number;
    spoilageReason?: string;
  }) {
    return prisma.outcome.create({
      data: {
        batchId: data.batchId,
        soldQty: data.soldQty ? new Prisma.Decimal(data.soldQty) : null,
        wastedQty: data.wastedQty ? new Prisma.Decimal(data.wastedQty) : null,
        avgSellPrice: data.avgSellPrice ? new Prisma.Decimal(data.avgSellPrice) : null,
        spoilageReason: data.spoilageReason,
      },
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
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      batchId?: string;
      companyId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.OutcomeWhereInput = {};

    if (filters?.batchId) {
      where.batchId = filters.batchId;
    }

    if (filters?.companyId) {
      where.batch = {
        ownerCompanyId: filters.companyId,
      };
    }

    if (filters?.startDate || filters?.endDate) {
      where.recordedAt = {};
      if (filters.startDate) {
        where.recordedAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.recordedAt.lte = filters.endDate;
      }
    }

    const [outcomes, total] = await Promise.all([
      prisma.outcome.findMany({
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
        },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.outcome.count({ where }),
    ]);

    return {
      data: outcomes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const outcome = await prisma.outcome.findUnique({
      where: { id },
      include: {
        batch: {
          include: {
            commodity: true,
            ownerCompany: true,
          },
        },
      },
    });

    if (!outcome) {
      throw new AppError('Outcome not found', 404);
    }

    return outcome;
  }

  async getStats(companyId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: Prisma.OutcomeWhereInput = {
      recordedAt: {
        gte: startDate,
      },
    };

    if (companyId) {
      where.batch = {
        ownerCompanyId: companyId,
      };
    }

    const outcomes = await prisma.outcome.findMany({
      where,
      include: {
        batch: {
          select: {
            commodity: true,
          },
        },
      },
    });

    const totalSold = outcomes.reduce((sum, o) => sum + (o.soldQty ? Number(o.soldQty) : 0), 0);
    const totalWasted = outcomes.reduce((sum, o) => sum + (o.wastedQty ? Number(o.wastedQty) : 0), 0);
    const totalRevenue = outcomes.reduce((sum, o) => {
      const sold = o.soldQty ? Number(o.soldQty) : 0;
      const price = o.avgSellPrice ? Number(o.avgSellPrice) : 0;
      return sum + (sold * price);
    }, 0);

    return {
      totalSold,
      totalWasted,
      totalRevenue,
      wasteRate: totalSold + totalWasted > 0 ? (totalWasted / (totalSold + totalWasted)) * 100 : 0,
      count: outcomes.length,
    };
  }
}

export default new OutcomesService();

