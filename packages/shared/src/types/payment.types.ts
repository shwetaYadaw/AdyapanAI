export type PaymentGateway = 'razorpay' | 'stripe';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentType = 'course' | 'subscription' | 'mentor_session';

export interface IPayment {
  _id: string;
  userId: string;
  courseId?: string;
  mentorSessionId?: string;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  invoice?: string;
  refundId?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  courseId?: string;
  mentorSessionId?: string;
  gateway: PaymentGateway;
  couponCode?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  paymentId?: string;
}

export interface RazorpayVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface StripeVerifyRequest {
  paymentIntentId: string;
}
