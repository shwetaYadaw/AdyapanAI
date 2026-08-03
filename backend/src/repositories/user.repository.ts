/**
 * User Repository
 * Handles all database operations for users
 */

import { prisma } from '../config/prisma';
import { User, CreateUserDTO, UpdateUserDTO, UserProfile } from '../models/user.model';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(filters?: {
    role?: string;
    isVerified?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        role: filters?.role,
        isVerified: filters?.isVerified,
      },
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateUserDTO & { password: string }): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || 'student',
      },
    });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findWithProfile(id: string): Promise<UserProfile | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: true,
      },
    });
  }

  async count(filters?: { role?: string }): Promise<number> {
    return await prisma.user.count({
      where: {
        role: filters?.role,
      },
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async verifyEmail(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  }
}

export const userRepository = new UserRepository();
