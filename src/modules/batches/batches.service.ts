import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class BatchesService {
  async create(data: {
    commodityId: string;
    ownerCompanyId: string;
    harvestDate?: Date;
    quantity: number;
    unit: string;
    currentLocation?: string;
  }) {
    return prisma.batch.create({
      data: {
        commodityId: data.commodityId,
        ownerCompanyId: data.ownerCompanyId,
        harvestDate: data.harvestDate,
        quantity: new Prisma.Decimal(data.quantity),
        unit: data.unit,
        currentLocation: data.currentLocation,
        status: 'ACTIVE',
      },
      include: {
        commodity: true,
        ownerCompany: true,
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      companyId?: string;
      commodityId?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.BatchWhereInput = {};

    if (filters?.companyId) {
      where.ownerCompanyId = filters.companyId;
    }

    if (filters?.commodityId) {
      where.commodityId = filters.commodityId;
    }

    if (filters?.status) {
      where.status = filters.status as any;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        skip,
        take: limit,
        include: {
          commodity: true,
          ownerCompany: {
            select: {
              id: true,
              name: true,
              companyType: true,
            },
          },
          qualityScores: {
            orderBy: { calculatedAt: 'desc' },
            take: 1,
          },
          shelfLifePredictions: {
            orderBy: { calculatedAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.batch.count({ where }),
    ]);

    return {
      data: batches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        commodity: true,
        ownerCompany: true,
        qualityScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 10,
        },
        shelfLifePredictions: {
          orderBy: { calculatedAt: 'desc' },
          take: 10,
        },
        recommendations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
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
        },
        sensorReadings: {
          orderBy: { timestamp: 'desc' },
          take: 50,
          include: {
            sensor: true,
          },
        },
      },
    });

    if (!batch) {
      throw new AppError('Batch not found', 404);
    }

    return batch;
  }

  async update(id: string, data: {
    harvestDate?: Date;
    quantity?: number;
    unit?: string;
    currentLocation?: string;
    status?: string;
  }) {
    const updateData: Prisma.BatchUpdateInput = {};

    if (data.harvestDate !== undefined) updateData.harvestDate = data.harvestDate;
    if (data.quantity !== undefined) updateData.quantity = new Prisma.Decimal(data.quantity);
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.currentLocation !== undefined) updateData.currentLocation = data.currentLocation;
    if (data.status !== undefined) updateData.status = data.status as any;

    return prisma.batch.update({
      where: { id },
      data: updateData,
      include: {
        commodity: true,
        ownerCompany: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.batch.delete({
      where: { id },
    });
  }

  async getSummary(companyId?: string) {
    const where: Prisma.BatchWhereInput = companyId ? { ownerCompanyId: companyId } : {};

    const [total, byStatus, byCommodity] = await Promise.all([
      prisma.batch.count({ where }),
      prisma.batch.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.batch.groupBy({
        by: ['commodityId'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byCommodity: byCommodity.length,
    };
  }
}

export default new BatchesService();

