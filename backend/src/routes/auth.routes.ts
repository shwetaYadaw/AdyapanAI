import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter, otpRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
const controller = new AuthController();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', authRateLimiter, (req, res, next) => {
  controller.register(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login with email & password
 * @access  Public
 */
router.post('/login', authRateLimiter, (req, res, next) => {
  controller.login(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/google
 * @desc    Login with Google OAuth
 * @access  Public
 */
router.post('/google', authRateLimiter, (req, res, next) => {
  controller.loginWithGoogle(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/send-otp
 * @desc    Send OTP to phone number
 * @access  Public
 */
router.post('/send-otp', otpRateLimiter, (req, res, next) => {
  controller.sendOTP(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP
 * @access  Public
 */
router.post('/verify-otp', authRateLimiter, (req, res, next) => {
  controller.verifyOTP(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email token
 * @access  Public
 */
router.post('/verify-email', (req, res, next) => {
  controller.verifyEmail(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', (req, res, next) => {
  controller.refreshToken(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', authRateLimiter, (req, res, next) => {
  controller.forgotPassword(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', authRateLimiter, (req, res, next) => {
  controller.resetPassword(req, res).catch(next);
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate tokens
 * @access  Private
 */
router.post('/logout', authenticate, (req, res, next) => {
  controller.logout(req, res).catch(next);
});

export default router;
