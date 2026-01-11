import prisma from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { deleteFileFromSupabase } from '../../utils/supabase';
import { config } from '../../config/env';

export class AuthService {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    companyId: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as any,
        companyId: data.companyId,
      },
      include: { company: true },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: (user as any).profilePicture,
      company: user.company,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      profilePicture?: string;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete old profile picture from Supabase Storage if exists
    if (data.profilePicture && (user as any).profilePicture) {
      try {
        await deleteFileFromSupabase(config.supabase.storageBucket, (user as any).profilePicture);
      } catch (error) {
        // Log error but don't fail the update if deletion fails
        console.error('Failed to delete old profile picture from Supabase:', error);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.profilePicture && { profilePicture: data.profilePicture }),
      },
      include: { company: true },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: (updatedUser as any).profilePicture,
      company: updatedUser.company,
      updatedAt: updatedUser.updatedAt,
    };
  }
}

export default new AuthService();

