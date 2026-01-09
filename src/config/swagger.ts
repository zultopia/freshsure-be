import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FreshSure API Documentation',
      version: '1.0.0',
      description: 'API Documentation for FreshSure - Food Quality & Supply Chain Management System',
      contact: {
        name: 'FreshSure API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            total: {
              type: 'integer',
            },
            totalPages: {
              type: 'integer',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            role: {
              type: 'string',
              enum: ['FARMER', 'LOGISTICS', 'RETAIL', 'ADMIN'],
            },
            companyId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            companyType: {
              type: 'string',
              enum: ['FARM', 'LOGISTICS', 'RETAIL', 'PROCESSOR'],
            },
            country: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Batch: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            commodityId: {
              type: 'string',
              format: 'uuid',
            },
            ownerCompanyId: {
              type: 'string',
              format: 'uuid',
            },
            harvestDate: {
              type: 'string',
              format: 'date',
            },
            quantity: {
              type: 'number',
            },
            unit: {
              type: 'string',
            },
            currentLocation: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'SOLD', 'DOWNGRADED', 'SPOILED', 'IN_TRANSIT'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        QualityScore: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            batchId: {
              type: 'string',
              format: 'uuid',
            },
            qualityScore: {
              type: 'number',
              minimum: 0,
              maximum: 100,
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SensorReading: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            batchId: {
              type: 'string',
              format: 'uuid',
            },
            sensorId: {
              type: 'string',
              format: 'uuid',
            },
            temperature: {
              type: 'number',
            },
            humidity: {
              type: 'number',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

