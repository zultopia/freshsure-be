import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export class QualityService {
  async createQualityScore(data: {
    batchId: string;
    qualityScore: number;
    confidence: number;
  }) {
    if (data.qualityScore < 0 || data.qualityScore > 100) {
      throw new AppError('Quality score must be between 0 and 100', 400);
    }

    if (data.confidence < 0 || data.confidence > 1) {
      throw new AppError('Confidence must be between 0 and 1', 400);
    }

    return prisma.qualityScore.create({
      data: {
        batchId: data.batchId,
        qualityScore: data.qualityScore,
        confidence: data.confidence,
      },
      include: {
        batch: {
          select: {
            id: true,
            commodity: true,
          },
        },
      },
    });
  }

  async getLatestQualityScore(batchId: string) {
    const score = await prisma.qualityScore.findFirst({
      where: { batchId },
      orderBy: { calculatedAt: 'desc' },
    });

    if (!score) {
      throw new AppError('Quality score not found for this batch', 404);
    }

    return score;
  }

  async getQualityHistory(batchId: string, limit: number = 10) {
    return prisma.qualityScore.findMany({
      where: { batchId },
      orderBy: { calculatedAt: 'desc' },
      take: limit,
    });
  }

  async createShelfLifePrediction(data: {
    batchId: string;
    remainingHours: number;
    minEstimate: number;
    maxEstimate: number;
    riskLevel: string;
  }) {
    return prisma.shelfLifePrediction.create({
      data: {
        batchId: data.batchId,
        remainingHours: data.remainingHours,
        minEstimate: data.minEstimate,
        maxEstimate: data.maxEstimate,
        riskLevel: data.riskLevel as any,
      },
      include: {
        batch: {
          select: {
            id: true,
            commodity: true,
          },
        },
      },
    });
  }

  async getLatestShelfLifePrediction(batchId: string) {
    const prediction = await prisma.shelfLifePrediction.findFirst({
      where: { batchId },
      orderBy: { calculatedAt: 'desc' },
    });

    if (!prediction) {
      throw new AppError('Shelf life prediction not found for this batch', 404);
    }

    return prediction;
  }

  async getShelfLifeHistory(batchId: string, limit: number = 10) {
    return prisma.shelfLifePrediction.findMany({
      where: { batchId },
      orderBy: { calculatedAt: 'desc' },
      take: limit,
    });
  }

  async getQualityPerformance(companyId?: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      calculatedAt: {
        gte: startDate,
      },
    };

    if (companyId) {
      where.batch = {
        ownerCompanyId: companyId,
      };
    }

    const scores = await prisma.qualityScore.findMany({
      where,
      include: {
        batch: {
          select: {
            id: true,
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
      orderBy: { calculatedAt: 'asc' },
    });

    // Group by day
    const dailyScores = scores.reduce((acc, score) => {
      const date = score.calculatedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(score.qualityScore);
      return acc;
    }, {} as Record<string, number[]>);

    const averageScores = Object.entries(dailyScores).map(([date, scores]) => ({
      date,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      count: scores.length,
    }));

    return averageScores.sort((a, b) => a.date.localeCompare(b.date));
  }
}

export default new QualityService();

