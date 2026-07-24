import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`⚠️  Warning: Missing env var ${key} — using placeholder for dev`);
    return `dev_placeholder_${key.toLowerCase()}`;
  }
  return value;
}

function optionalEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env = {
  NODE_ENV:   optionalEnv('NODE_ENV', 'development'),
  PORT:       parseInt(optionalEnv('PORT', '5000'), 10),
  CLIENT_URL: optionalEnv('CLIENT_URL', 'http://localhost:3000'),
  MOBILE_URL: optionalEnv('MOBILE_URL', ''),

  // ── Database: PostgreSQL (Supabase) ─────────────────────────────────────
  DATABASE_URL: requireEnv('DATABASE_URL'),
  DIRECT_URL:   optionalEnv('DIRECT_URL', ''), // Optional: for migrations
  REDIS_URL:    optionalEnv('REDIS_URL', 'redis://localhost:6379'),

  JWT_ACCESS_SECRET:  optionalEnv('JWT_ACCESS_SECRET', 'adyapan_dev_access_secret_minimum_32_chars_here'),
  JWT_REFRESH_SECRET: optionalEnv('JWT_REFRESH_SECRET', 'adyapan_dev_refresh_secret_minimum_32_chars_here'),
  JWT_EMAIL_SECRET:   optionalEnv('JWT_EMAIL_SECRET',   'adyapan_dev_email_secret_2024'),
  JWT_ACCESS_EXPIRE:  optionalEnv('JWT_ACCESS_EXPIRE',  '15m'),
  JWT_REFRESH_EXPIRE: optionalEnv('JWT_REFRESH_EXPIRE', '7d'),

  GOOGLE_CLIENT_ID: optionalEnv('GOOGLE_CLIENT_ID', ''),

  SMTP_HOST:  optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT:  parseInt(optionalEnv('SMTP_PORT', '587'), 10),
  SMTP_USER:  optionalEnv('SMTP_USER', ''),
  SMTP_PASS:  optionalEnv('SMTP_PASS', ''),
  EMAIL_FROM: optionalEnv('EMAIL_FROM', 'ADYAPAN <noreply@adyapan.com>'),

  TWILIO_ACCOUNT_SID:  optionalEnv('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN:   optionalEnv('TWILIO_AUTH_TOKEN'),
  TWILIO_PHONE_NUMBER: optionalEnv('TWILIO_PHONE_NUMBER'),

  CLOUDINARY_CLOUD_NAME: optionalEnv('CLOUDINARY_CLOUD_NAME', 'dev_cloud'),
  CLOUDINARY_API_KEY:    optionalEnv('CLOUDINARY_API_KEY',    'dev_key'),
  CLOUDINARY_API_SECRET: optionalEnv('CLOUDINARY_API_SECRET', 'dev_secret'),

  AWS_ACCESS_KEY_ID:     optionalEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: optionalEnv('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION:            optionalEnv('AWS_REGION', 'ap-south-1'),
  AWS_S3_BUCKET:         optionalEnv('AWS_S3_BUCKET'),

  RAZORPAY_KEY_ID:         optionalEnv('RAZORPAY_KEY_ID',        'rzp_test_dev'),
  RAZORPAY_KEY_SECRET:     optionalEnv('RAZORPAY_KEY_SECRET',    'dev_secret'),
  RAZORPAY_WEBHOOK_SECRET: optionalEnv('RAZORPAY_WEBHOOK_SECRET','dev_webhook'),

  STRIPE_SECRET_KEY:    optionalEnv('STRIPE_SECRET_KEY',    'sk_test_dev'),
  STRIPE_WEBHOOK_SECRET: optionalEnv('STRIPE_WEBHOOK_SECRET', 'whsec_dev'),

  AI_SERVICE_URL:     optionalEnv('AI_SERVICE_URL',     'http://localhost:8000'),
  AI_SERVICE_API_KEY: optionalEnv('AI_SERVICE_API_KEY', 'adyapan_internal_ai_key_2024'),

  FRONTEND_URL:       optionalEnv('FRONTEND_URL',       'http://localhost:3000'),
  CERTIFICATE_SECRET: optionalEnv('CERTIFICATE_SECRET', 'adyapan_cert_secret_2024'),

  JUDGE0_API_URL:     optionalEnv('JUDGE0_API_URL',     'http://localhost:2358'),
  JUDGE0_API_KEY:     optionalEnv('JUDGE0_API_KEY',     ''),

  isProduction:  () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV !== 'production',
};
