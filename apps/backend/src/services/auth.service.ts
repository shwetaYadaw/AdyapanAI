import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import {
  generateAccessToken,
  generateEmailToken,
  generateRefreshToken,
  revokeAllRefreshTokens,
  storeRefreshToken,
  verifyEmailToken,
  verifyRefreshToken,
} from '../utils/jwt.utils';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp.utils';
import { EmailService } from './email.service';
import { AppError } from '../middleware/errorHandler.middleware';
import { env } from '../config/env';
import { AuditService } from './audit.service';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
const emailService = new EmailService();

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role ?? 'student',
      },
    });

    // Create student profile if role is student
    if (user.role === 'student') {
      await prisma.studentProfile.create({ data: { userId: user.id } });
    }

    // Notify admin about the new signup (non-blocking)
    emailService
      .sendNewUserSignupNotification(user.email, user.firstName, user.lastName, user.role)
      .catch(() => {}); // silently ignore admin notification failures

    // In development: auto-verify email so users can login immediately
    if (env.isDevelopment()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true, isVerified: true },
      });
      return { userId: user.id, message: 'Account created! You can now login.' };
    }

    // Production: send verification email
    const emailToken = generateEmailToken({ userId: user.id, email: user.email });
    await emailService.sendVerificationEmail(user.email, user.firstName, emailToken);

    return { userId: user.id };
  }

  async login(email: string, password: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true, email: true, password: true, firstName: true, lastName: true,
        avatar: true, role: true, isActive: true, isEmailVerified: true,
        preferences: true,
      },
    });

    if (!user) throw new AppError('Invalid email or password', 401);
    if (!user.isActive) throw new AppError('Account has been deactivated', 403);
    if (!user.password) throw new AppError('Please use Google login for this account', 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    // Update login stats
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), loginCount: { increment: 1 } },
    });

    const tokens = await this.generateTokenPair(user);
    await AuditService.log({ userId: user.id, action: 'user.login', resource: 'auth', ipAddress });

    return { ...tokens, user };
  }

  async loginWithGoogle(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new AppError('Invalid Google token', 400);

    let user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          firstName: payload.given_name ?? 'User',
          lastName: payload.family_name ?? '',
          avatar: payload.picture,
          googleId: payload.sub,
          isEmailVerified: true,
          isVerified: true,
          role: 'student',
        },
      });
      await prisma.studentProfile.create({ data: { userId: user.id } });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: payload.sub,
          isEmailVerified: true,
          avatar: user.avatar ?? payload.picture,
        },
      });
    }

    if (!user.isActive) throw new AppError('Account has been deactivated', 403);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), loginCount: { increment: 1 } },
    });

    const tokens = await this.generateTokenPair(user);
    return { ...tokens, user };
  }

  async sendOTP(phone: string) {
    const otp = generateOTP();
    await storeOTP(phone, otp);
    if (env.isDevelopment()) {
      console.info(`[DEV OTP] Phone: ${phone} OTP: ${otp}`);
    }
    return { message: 'OTP sent successfully' };
  }

  async verifyOTPCode(phone: string, otp: string) {
    const result = await verifyOTP(phone, otp);
    if (!result.valid) throw new AppError(result.reason ?? 'Invalid OTP', 400);

    const user = await prisma.user.findFirst({ where: { phone } });
    if (user) {
      await prisma.user.update({ where: { id: user.id }, data: { phoneVerified: true } });
    }

    return { verified: true };
  }

  async verifyEmail(token: string) {
    const payload = verifyEmailToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new AppError('User not found', 404);
    if (user.isEmailVerified) throw new AppError('Email already verified', 400);

    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, isVerified: true },
    });
    return { message: 'Email verified successfully' };
  }

  async refreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) throw new AppError('User not found or inactive', 401);

    const tokens = await this.generateTokenPair(user);
    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return { message: 'If this email is registered, a reset link has been sent' };

    const resetToken = generateEmailToken({ userId: user.id, email: user.email }, '1h');
    await emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);
    return { message: 'If this email is registered, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = verifyEmailToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new AppError('Invalid or expired reset link', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

    await revokeAllRefreshTokens(user.id);
    return { message: 'Password reset successfully' };
  }

  async logout(userId: string, accessToken: string) {
    await revokeAllRefreshTokens(userId);
    const { blacklistToken } = await import('../utils/jwt.utils');
    await blacklistToken(accessToken, 900);
    return { message: 'Logged out successfully' };
  }

  private async generateTokenPair(user: { id: string; email: string; role: string; [key: string]: any }) {
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    await storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user.id,
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
      },
    };
  }
}
