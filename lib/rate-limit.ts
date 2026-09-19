/**
 * Shared rate limiter. Uses Vercel Redis (MACH1_REDIS_URL) so limits hold
 * across instances; falls back to process memory in local dev without Redis.
 */

import { getRedis } from "@/lib/redis";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

async function checkRedisLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const redis = await getRedis();
  if (!redis) return null;

  const key = `rl:${identifier}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.pExpire(key, windowMs);
  }

  const ttl = await redis.pTTL(key);
  return {
    allowed: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetTime: Date.now() + Math.max(ttl, 0),
  };
}

function checkMemoryLimit(identifier: string, maxRequests: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    const next = { count: 1, resetTime: now + windowMs };
    memoryStore.set(identifier, next);
    return { allowed: true, remaining: maxRequests - 1, resetTime: next.resetTime };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 60 * 1000
): Promise<RateLimitResult> {
  try {
    const remote = await checkRedisLimit(identifier, maxRequests, windowMs);
    if (remote) return remote;
  } catch (error) {
    console.error("Redis rate limit error, using memory fallback:", error);
  }

  return checkMemoryLimit(identifier, maxRequests, windowMs);
}

export function getClientIdentifier(headers: Headers | Record<string, string | null>): string {
  const getHeader = (key: string): string | null => {
    if (headers instanceof Headers) {
      return headers.get(key) || headers.get(key.toLowerCase());
    }
    const record = headers as Record<string, string | null>;
    return record[key] || record[key.toLowerCase()] || null;
  };

  const forwardedFor = getHeader("x-forwarded-for") || getHeader("X-Forwarded-For");
  const realIp = getHeader("x-real-ip") || getHeader("X-Real-IP");

  if (forwardedFor) {
    return String(forwardedFor).split(",")[0].trim();
  }

  if (realIp) {
    return String(realIp).trim();
  }

  return "unknown";
}
