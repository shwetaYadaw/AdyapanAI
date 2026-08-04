import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * @route   GET /api/v1/admin-setup/verify
 * @desc    Check if admin account exists
 * @access  Public (for setup only)
 */
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@adyapan.com' },
      select: { id: true, email: true, role: true, isActive: true, isEmailVerified: true, password: true },
    });

    if (!admin) {
      sendError({ res, statusCode: 404, message: 'Admin account not found' });
      return;
    }

    sendSuccess({
      res,
      data: {
        exists: true,
        id: admin.id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        isEmailVerified: admin.isEmailVerified,
        hasPassword: !!admin.password,
      },
    });
  } catch (err) {
    sendError({ res, statusCode: 500, message: 'Error checking admin account' });
  }
});

/**
 * @route   POST /api/v1/admin-setup/create
 * @desc    Create admin account (idempotent - won't create if exists)
 * @access  Public (for setup only - should be removed in production)
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { email = 'admin@adyapan.com', password = 'Admin@123' } = req.body;

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      sendSuccess({
        res,
        data: {
          created: false,
          message: 'Admin account already exists',
          email: existing.email,
          id: existing.id,
        },
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isVerified: true,
        isEmailVerified: true,
        isActive: true,
      },
    });

    sendSuccess(
      {
        res,
        statusCode: 201,
        data: {
          created: true,
          id: admin.id,
          email: admin.email,
          role: admin.role,
          message: 'Admin account created successfully',
        },
        message: 'Admin account created. You can now login with the provided credentials.',
      }
    );
  } catch (err: any) {
    console.error('Error creating admin:', err);
    sendError({ res, statusCode: 500, message: 'Error creating admin account' });
  }
});

/**
 * @route   POST /api/v1/admin-setup/reset-password
 * @desc    Reset admin password
 * @access  Public (for setup only - should be removed in production)
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email = 'admin@adyapan.com', newPassword = 'Admin@123' } = req.body;

    const admin = await prisma.user.findUnique({
      where: { email },
    });

    if (!admin) {
      sendError({ res, statusCode: 404, message: 'Admin account not found' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    sendSuccess({
      res,
      data: {
        email: admin.email,
        message: 'Password reset successfully',
      },
      message: 'Admin password has been reset',
    });
  } catch (err: any) {
    console.error('Error resetting password:', err);
    sendError({ res, statusCode: 500, message: 'Error resetting password' });
  }
});

export default router;
