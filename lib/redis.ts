import { createClient, type RedisClientType } from "redis";

const globalForRedis = globalThis as unknown as {
  mach1Redis?: RedisClientType;
};

function redisUrl() {
  return process.env.MACH1_REDIS_URL || process.env.REDIS_URL;
}

export function isRedisConfigured() {
  return Boolean(redisUrl());
}

export async function getRedis(): Promise<RedisClientType | null> {
  const url = redisUrl();
  if (!url) return null;

  if (!globalForRedis.mach1Redis) {
    globalForRedis.mach1Redis = createClient({ url });
    globalForRedis.mach1Redis.on("error", (error) => {
      console.error("Redis error:", error);
    });
  }

  if (!globalForRedis.mach1Redis.isOpen) {
    await globalForRedis.mach1Redis.connect();
  }

  return globalForRedis.mach1Redis;
}
