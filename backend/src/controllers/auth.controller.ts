import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.utils';
import { env } from '../config/env';

const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/\d/, 'Must contain a number'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['student', 'admin']).optional().default('student'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const otpSendSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

const otpVerifySchema = z.object({
  phone: z.string(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/),
});

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const body = registerSchema.parse(req.body);
    const result = await authService.register(body);
    sendSuccess({
      res,
      statusCode: 201,
      message: env.isDevelopment()
        ? 'Registration successful. You can now sign in.'
        : 'Registration successful. Please check your email to verify your account.',
      data: result,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password, req.ip);
    sendSuccess({ res, data: result, message: 'Login successful' });
  }

  async loginWithGoogle(req: Request, res: Response): Promise<void> {
    const { idToken } = z.object({ idToken: z.string() }).parse(req.body);
    const result = await authService.loginWithGoogle(idToken);
    sendSuccess({ res, data: result, message: 'Google login successful' });
  }

  async sendOTP(req: Request, res: Response): Promise<void> {
    const { phone } = otpSendSchema.parse(req.body);
    const result = await authService.sendOTP(phone);
    sendSuccess({ res, data: result });
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    const { phone, otp } = otpVerifySchema.parse(req.body);
    const result = await authService.verifyOTPCode(phone, otp);
    sendSuccess({ res, data: result });
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = z.object({ token: z.string() }).parse(req.body);
    const result = await authService.verifyEmail(token);
    sendSuccess({ res, data: result });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = z
      .object({ refreshToken: z.string() })
      .parse(req.body);
    const result = await authService.refreshToken(refreshToken);
    sendSuccess({ res, data: result });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = forgotSchema.parse(req.body);
    const result = await authService.forgotPassword(email);
    sendSuccess({ res, data: result });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = resetSchema.parse(req.body);
    const result = await authService.resetPassword(token, newPassword);
    sendSuccess({ res, data: result });
  }

  async logout(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendError({ res, statusCode: 401, message: 'Not authenticated' });
      return;
    }
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    const result = await authService.logout(req.user.userId, token);
    sendSuccess({ res, data: result });
  }
}
