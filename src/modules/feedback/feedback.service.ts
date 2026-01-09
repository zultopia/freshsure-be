import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class FeedbackService {
  async create(data: {
    userId: string;
    batchId?: string;
    feedbackType: string;
    message: string;
  }) {
    return prisma.feedback.create({
      data: {
        userId: data.userId,
        batchId: data.batchId,
        feedbackType: data.feedbackType,
        message: data.message,
      },
      include: {
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
      batchId?: string;
      feedbackType?: string;
    }
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.FeedbackWhereInput = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.batchId) {
      where.batchId = filters.batchId;
    }

    if (filters?.feedbackType) {
      where.feedbackType = filters.feedbackType;
    }

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
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
      }),
      prisma.feedback.count({ where }),
    ]);

    return {
      data: feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!feedback) {
      throw new AppError('Feedback not found', 404);
    }

    return feedback;
  }
}

export default new FeedbackService();

