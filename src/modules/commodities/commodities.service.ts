import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export class CommoditiesService {
  async create(data: {
    name: string;
    category: string;
    baseShelfLifeDays: number;
  }) {
    return prisma.commodity.create({
      data: {
        name: data.name,
        category: data.category as any,
        baseShelfLifeDays: data.baseShelfLifeDays,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, category?: string) {
    const skip = (page - 1) * limit;

    const where = category ? { category: category as any } : {};

    const [commodities, total] = await Promise.all([
      prisma.commodity.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              batches: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.commodity.count({ where }),
    ]);

    return {
      data: commodities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const commodity = await prisma.commodity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            batches: true,
          },
        },
      },
    });

    if (!commodity) {
      throw new AppError('Commodity not found', 404);
    }

    return commodity;
  }

  async update(id: string, data: {
    name?: string;
    category?: string;
    baseShelfLifeDays?: number;
  }) {
    return prisma.commodity.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.category && { category: data.category as any }),
        ...(data.baseShelfLifeDays !== undefined && { baseShelfLifeDays: data.baseShelfLifeDays }),
      },
    });
  }

  async delete(id: string) {
    return prisma.commodity.delete({
      where: { id },
    });
  }
}

export default new CommoditiesService();

