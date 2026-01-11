import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export class CompaniesService {
  async create(data: {
    name: string;
    companyType: string;
    country?: string;
  }) {
    return prisma.company.create({
      data: {
        name: data.name,
        companyType: data.companyType as any,
        country: data.country,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              batches: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.company.count(),
    ]);

    return {
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            batches: true,
          },
        },
      },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    return company;
  }

  async update(id: string, data: {
    name?: string;
    companyType?: string;
    country?: string;
  }) {
    return prisma.company.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.companyType && { companyType: data.companyType as any }),
        ...(data.country !== undefined && { country: data.country }),
      },
    });
  }

  async delete(id: string) {
    return prisma.company.delete({
      where: { id },
    });
  }
}

export default new CompaniesService();

