import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class RetailService {
  async createStore(data: {
    name: string;
    location?: string;
    companyId: string;
  }) {
    return prisma.store.create({
      data: {
        name: data.name,
        location: data.location,
        companyId: data.companyId,
      },
    });
  }

  async createInventory(data: {
    batchId: string;
    storeId: string;
    stockQty: number;
  }) {
    return prisma.retailInventory.create({
      data: {
        batchId: data.batchId,
        storeId: data.storeId,
        stockQty: new Prisma.Decimal(data.stockQty),
      },
      include: {
        batch: {
          include: {
            commodity: true,
          },
        },
        store: true,
      },
    });
  }

  async getInventory(storeId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where: Prisma.RetailInventoryWhereInput = {};
    if (storeId) {
      where.storeId = storeId;
    }

    const [inventories, total] = await Promise.all([
      prisma.retailInventory.findMany({
        where,
        skip,
        take: limit,
        include: {
          batch: {
            include: {
              commodity: true,
              qualityScores: {
                orderBy: { calculatedAt: 'desc' },
                take: 1,
              },
              shelfLifePredictions: {
                orderBy: { calculatedAt: 'desc' },
                take: 1,
              },
            },
          },
          store: true,
          pricingRecommendations: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.retailInventory.count({ where }),
    ]);

    return {
      data: inventories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPricingRecommendation(data: {
    inventoryId: string;
    originalPrice: number;
    recommendedPrice: number;
    discountPct: number;
    reason?: string;
  }) {
    return prisma.pricingRecommendation.create({
      data: {
        inventoryId: data.inventoryId,
        originalPrice: new Prisma.Decimal(data.originalPrice),
        recommendedPrice: new Prisma.Decimal(data.recommendedPrice),
        discountPct: data.discountPct,
        reason: data.reason,
      },
      include: {
        inventory: {
          include: {
            batch: {
              include: {
                commodity: true,
              },
            },
            store: true,
          },
        },
      },
    });
  }

  async getPricingRecommendations(inventoryId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where: Prisma.PricingRecommendationWhereInput = {};
    if (inventoryId) {
      where.inventoryId = inventoryId;
    }

    const [recommendations, total] = await Promise.all([
      prisma.pricingRecommendation.findMany({
        where,
        skip,
        take: limit,
        include: {
          inventory: {
            include: {
              batch: {
                include: {
                  commodity: true,
                },
              },
              store: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pricingRecommendation.count({ where }),
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

  async getLowStock(storeId?: string, threshold: number = 10) {
    const where: Prisma.RetailInventoryWhereInput = {
      stockQty: {
        lte: new Prisma.Decimal(threshold),
      },
    };

    if (storeId) {
      where.storeId = storeId;
    }

    return prisma.retailInventory.findMany({
      where,
      include: {
        batch: {
          include: {
            commodity: true,
          },
        },
        store: true,
      },
      orderBy: { stockQty: 'asc' },
    });
  }
}

export default new RetailService();

