import crypto from 'crypto';
import { getRedisClient } from '../config/redis';

const OTP_TTL = 5 * 60; // 5 minutes in seconds
const OTP_LENGTH = 6;
const MAX_ATTEMPTS = 3;

export function generateOTP(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[crypto.randomInt(digits.length)];
  }
  return otp;
}

export async function storeOTP(identifier: string, otp: string): Promise<void> {
  try {
    const client = getRedisClient();
    const key = `otp:${identifier}`;
    const data = JSON.stringify({ otp, attempts: 0, createdAt: Date.now() });
    await client.setex(key, OTP_TTL, data);
  } catch {
    // In dev without Redis, log OTP to console
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[DEV OTP] ${identifier}: ${otp}`);
    }
  }
}

export async function verifyOTP(
  identifier: string,
  inputOtp: string
): Promise<{ valid: boolean; reason?: string }> {
  try {
    const client = getRedisClient();
    const key = `otp:${identifier}`;
    const raw = await client.get(key);

    if (!raw) return { valid: false, reason: 'OTP expired or not found' };

    const data = JSON.parse(raw) as { otp: string; attempts: number; createdAt: number };

    if (data.attempts >= MAX_ATTEMPTS) {
      await client.del(key);
      return { valid: false, reason: 'Max attempts exceeded. Please request a new OTP.' };
    }

    if (data.otp !== inputOtp) {
      data.attempts += 1;
      await client.setex(key, OTP_TTL, JSON.stringify(data));
      return { valid: false, reason: 'Invalid OTP' };
    }

    await client.del(key);
    return { valid: true };
  } catch {
    return { valid: false, reason: 'OTP service unavailable' };
  }
}

export async function hasActiveOTP(identifier: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    const exists = await client.exists(`otp:${identifier}`);
    return exists === 1;
  } catch { return false; }
}
