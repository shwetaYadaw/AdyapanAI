// @ts-nocheck
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler.middleware';
import { env } from '../config/env';
import { EmailService } from './email.service';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const emailService = new EmailService();

export class PaymentService {
  async createOrder(data: {
    userId: string;
    courseId?: string;
    mentorSessionId?: string;
    gateway: 'razorpay' | 'stripe';
    couponCode?: string;
  }) {
    let amount = 0;
    let courseName = '';

    if (data.courseId) {
      const course = await prisma.course.findUnique({ where: { id: data.courseId } });
      if (!course) throw new AppError('Course not found', 404);
      if (course.isFree) throw new AppError('This course is free', 400);

      const alreadyEnrolled = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: data.userId, courseId: data.courseId } },
      });
      if (alreadyEnrolled) throw new AppError('Already enrolled in this course', 400);

      amount = course.price;
      courseName = course.title;
    }

    if (amount <= 0) throw new AppError('Invalid payment amount', 400);

    const amountInPaise = Math.round(amount * 100);

    if (data.gateway === 'razorpay') {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        notes: { userId: data.userId, courseId: data.courseId ?? '', courseName },
      });

      await prisma.payment.create({
        data: {
          userId: data.userId,
          courseId: data.courseId,
          razorpayOrderId: order.id,
          amount,
          currency: 'INR',
          status: 'pending',
          paymentMethod: 'razorpay',
        },
      });

      return { orderId: order.id, amount, currency: 'INR', key: env.RAZORPAY_KEY_ID };
    }

    if (data.gateway === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: 'inr',
        metadata: { userId: data.userId, courseId: data.courseId ?? '' },
      });

      await prisma.payment.create({
        data: {
          userId: data.userId,
          courseId: data.courseId,
          stripePaymentId: paymentIntent.id,
          amount,
          currency: 'INR',
          status: 'pending',
          paymentMethod: 'stripe',
        },
      });

      return { orderId: paymentIntent.id, amount, currency: 'INR', clientSecret: paymentIntent.client_secret, key: '' };
    }

    throw new AppError('Invalid payment gateway', 400);
  }

  async verifyRazorpayPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    userId: string;
  }) {
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== data.razorpay_signature) {
      throw new AppError('Payment verification failed: invalid signature', 400);
    }

    const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: data.razorpay_order_id } });
    if (!payment) throw new AppError('Payment record not found', 404);

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: data.razorpay_payment_id,
        razorpaySignature: data.razorpay_signature,
        status: 'completed',
      },
    });

    await this.postPaymentSuccess(updated);
    return { success: true, paymentId: updated.id };
  }

  async handleRazorpayWebhook(body: unknown, signature: string) {
    const bodyStr = JSON.stringify(body);
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(bodyStr)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Webhook signature mismatch', 400);
    }

    const event = body as { event: string; payload: { payment: { entity: { order_id: string; id: string } } } };
    if (event.event === 'payment.captured') {
      const { order_id, id } = event.payload.payment.entity;
      const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: order_id } });
      if (payment && payment.status !== 'completed') {
        const updated = await prisma.payment.update({
          where: { id: payment.id },
          data: { razorpayPaymentId: id, status: 'completed' },
        });
        await this.postPaymentSuccess(updated);
      }
    }
  }

  private async postPaymentSuccess(payment: { id: string; userId: string; courseId: string | null }) {
    if (payment.courseId) {
      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      });

      if (!existing) {
        await prisma.enrollment.create({
          data: { userId: payment.userId, courseId: payment.courseId },
        });

        await prisma.course.update({
          where: { id: payment.courseId },
          data: { enrollmentCount: { increment: 1 } },
        });

        const [user, course] = await Promise.all([
          prisma.user.findUnique({ where: { id: payment.userId } }),
          prisma.course.findUnique({ where: { id: payment.courseId } }),
        ]);
        if (user && course) {
          await emailService.sendEnrollmentConfirmation(user.email, user.firstName, course.title);
        }
      }
    }
  }

  async getPaymentHistory(userId: string) {
    return prisma.payment.findMany({
      where: { userId, status: 'completed' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
