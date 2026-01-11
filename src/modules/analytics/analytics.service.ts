import prisma from '../../config/database';

export class AnalyticsService {
  async createWeeklyMetric(data: {
    companyId: string;
    weekStart: Date;
    wasteReductionPct?: number;
    revenueUpliftPct?: number;
    avgShelfLifeGainHr?: number;
  }) {
    return prisma.weeklyMetric.create({
      data: {
        companyId: data.companyId,
        weekStart: data.weekStart,
        wasteReductionPct: data.wasteReductionPct,
        revenueUpliftPct: data.revenueUpliftPct,
        avgShelfLifeGainHr: data.avgShelfLifeGainHr,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getWeeklyMetrics(companyId?: string, weeks: number = 12) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    const where: any = {
      weekStart: {
        gte: startDate,
      },
    };

    if (companyId) {
      where.companyId = companyId;
    }

    return prisma.weeklyMetric.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { weekStart: 'desc' },
    });
  }

  async getDashboardStats(companyId?: string) {
    const where: any = {};
    if (companyId) {
      where.ownerCompanyId = companyId;
    }

    const [
      totalBatches,
      activeBatches,
      batchesByStatus,
      recentQualityScores,
      criticalRecommendations,
    ] = await Promise.all([
      prisma.batch.count({ where }),
      prisma.batch.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.batch.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.qualityScore.findMany({
        where: companyId ? {
          batch: {
            ownerCompanyId: companyId,
          },
        } : {},
        orderBy: { calculatedAt: 'desc' },
        take: 7,
        include: {
          batch: {
            select: {
              commodity: true,
            },
          },
        },
      }),
      prisma.recommendation.findMany({
        where: {
          priority: 'CRITICAL',
          ...(companyId ? {
            batch: {
              ownerCompanyId: companyId,
            },
          } : {}),
        },
        take: 10,
        include: {
          batch: {
            include: {
              commodity: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      batches: {
        total: totalBatches,
        active: activeBatches,
        byStatus: batchesByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
      },
      recentQualityScores: recentQualityScores.map(score => ({
        date: score.calculatedAt,
        score: score.qualityScore,
        commodity: score.batch.commodity.name,
      })),
      criticalRecommendations: criticalRecommendations.length,
    };
  }
}

export default new AnalyticsService();

