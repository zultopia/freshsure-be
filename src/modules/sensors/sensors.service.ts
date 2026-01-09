import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export class SensorsService {
  async create(data: {
    sensorType: string;
    model?: string;
    installedAt?: string;
  }) {
    return prisma.sensor.create({
      data: {
        sensorType: data.sensorType as any,
        model: data.model,
        installedAt: data.installedAt,
        isActive: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, isActive?: boolean) {
    const skip = (page - 1) * limit;

    const where: Prisma.SensorWhereInput = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [sensors, total] = await Promise.all([
      prisma.sensor.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              readings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sensor.count({ where }),
    ]);

    return {
      data: sensors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const sensor = await prisma.sensor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            readings: true,
          },
        },
      },
    });

    if (!sensor) {
      throw new AppError('Sensor not found', 404);
    }

    return sensor;
  }

  async update(id: string, data: {
    model?: string;
    installedAt?: string;
    isActive?: boolean;
  }) {
    return prisma.sensor.update({
      where: { id },
      data,
    });
  }

  async createReading(data: {
    batchId: string;
    sensorId: string;
    temperature?: number;
    humidity?: number;
    ph?: number;
    gasLevel?: number;
    pressure?: number;
    imageUrl?: string;
    notes?: string;
  }) {
    return prisma.sensorReading.create({
      data: {
        batchId: data.batchId,
        sensorId: data.sensorId,
        temperature: data.temperature,
        humidity: data.humidity,
        ph: data.ph,
        gasLevel: data.gasLevel,
        pressure: data.pressure,
        imageUrl: data.imageUrl,
        notes: data.notes,
      },
      include: {
        batch: {
          select: {
            id: true,
            commodity: true,
          },
        },
        sensor: true,
      },
    });
  }

  async getReadings(
    batchId: string,
    page: number = 1,
    limit: number = 50,
    startDate?: Date,
    endDate?: Date
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.SensorReadingWhereInput = {
      batchId,
    };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [readings, total] = await Promise.all([
      prisma.sensorReading.findMany({
        where,
        skip,
        take: limit,
        include: {
          sensor: true,
        },
        orderBy: { timestamp: 'desc' },
      }),
      prisma.sensorReading.count({ where }),
    ]);

    return {
      data: readings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new SensorsService();

