import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { PaymentService } from '../services/payment.service';
import { sendSuccess } from '../utils/response.utils';

const router = Router();
const paymentService = new PaymentService();

// POST /payments/create-order
router.post('/create-order', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.createOrder({
      userId: req.user!.userId,
      ...req.body,
    });
    sendSuccess({ res, statusCode: 201, data: result });
  } catch (err) { next(err); }
});

// POST /payments/verify — verify razorpay payment
router.post('/verify', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.verifyRazorpayPayment({
      ...req.body,
      userId: req.user!.userId,
    });
    sendSuccess({ res, data: result, message: 'Payment verified successfully' });
  } catch (err) { next(err); }
});

// POST /payments/webhook/razorpay — Razorpay webhook (public)
router.post('/webhook/razorpay', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    await paymentService.handleRazorpayWebhook(req.body, signature);
    res.status(200).json({ received: true });
  } catch (err) { next(err); }
});

// GET /payments/history
router.get('/history', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await paymentService.getPaymentHistory(req.user!.userId);
    sendSuccess({ res, data: history });
  } catch (err) { next(err); }
});

export default router;
