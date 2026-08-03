import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;
let redisAvailable = false;

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableReadyCheck: false,
      connectTimeout: 3000,
    });

    redisClient.on('connect', () => {
      redisAvailable = true;
      logger.info('✅ Redis connected');
    });
    redisClient.on('error', () => {
      // Silence Redis errors in dev — app works without cache
      redisAvailable = false;
    });
  }
  return redisClient;
}

export async function connectRedis(): Promise<void> {
  try {
    const client = getRedisClient();
    await client.connect();
    redisAvailable = true;
  } catch {
    redisAvailable = false;
    logger.warn('⚠️  Redis not available — caching disabled. App will work without cache.');
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  if (!redisAvailable) return;
  try {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);
    if (ttlSeconds) await client.setex(key, ttlSeconds, serialized);
    else await client.set(key, serialized);
  } catch { /* ignore cache errors */ }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redisAvailable) return null;
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch { return null; }
}

export async function deleteCache(key: string): Promise<void> {
  if (!redisAvailable) return;
  try { await getRedisClient().del(key); } catch { /* ignore */ }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!redisAvailable) return;
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) await client.del(...keys);
  } catch { /* ignore */ }
}
