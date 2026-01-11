import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError | Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientInitializationError,
  _req: Request,
  res: Response): void => {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma initialization errors (database connection issues)
  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      error: 'Database connection error',
      message: 'Cannot connect to database. Please check if the database server is running.',
    });
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'Duplicate entry',
        message: 'A record with this value already exists',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'Not found',
        message: 'The requested record was not found',
      });
      return;
    }
    if (err.code === 'P1001') {
      res.status(503).json({
        error: 'Database connection error',
        message: 'Cannot reach database server. Please check your database configuration.',
      });
      return;
    }
  }

  // App errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  // Check for database connection errors in error message
  if (err.message && (
    err.message.includes('Can\'t reach database server') ||
    err.message.includes('P1001') ||
    err.message.includes('connect ECONNREFUSED')
  )) {
    res.status(503).json({
      error: 'Database connection error',
      message: 'Cannot connect to database server. Please ensure PostgreSQL is running and DATABASE_URL is correct.',
    });
    return;
  }

  // Unknown errors
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

