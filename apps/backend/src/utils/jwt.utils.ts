import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getRedisClient } from '../config/redis';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE as jwt.SignOptions['expiresIn'],
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE as jwt.SignOptions['expiresIn'],
  });
}

export function generateEmailToken(
  payload: { userId: string; email: string },
  expiresIn = '24h'
): string {
  return jwt.sign(payload, env.JWT_EMAIL_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}

export function verifyEmailToken(token: string): { userId: string; email: string } {
  return jwt.verify(token, env.JWT_EMAIL_SECRET) as { userId: string; email: string };
}

export async function blacklistToken(token: string, expiresInSeconds: number): Promise<void> {
  try {
    const client = getRedisClient();
    await client.setex(`blacklist:${token}`, expiresInSeconds, '1');
  } catch { /* Redis unavailable — token will expire naturally */ }
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const client = getRedisClient();
    const result = await client.get(`blacklist:${token}`);
    return result === '1';
  } catch { return false; }
}

export async function storeRefreshToken(
  userId: string,
  token: string,
  ttlSeconds = 7 * 24 * 60 * 60
): Promise<void> {
  try {
    const client = getRedisClient();
    await client.setex(`refresh:${userId}:${token.slice(-20)}`, ttlSeconds, token);
  } catch { /* ignore */ }
}

export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  try {
    const client = getRedisClient();
    const keys = await client.keys(`refresh:${userId}:*`);
    if (keys.length > 0) await client.del(...keys);
  } catch { /* ignore */ }
}
