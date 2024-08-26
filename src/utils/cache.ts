import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const cache = {
  async get(key: string): Promise<string | null> {
    const value = await redis.get(key);
    return value as string | null;
  },
  async set(key: string, value: string, ttl = 3600): Promise<void> {
    await redis.set(key, value, { ex: ttl });
  },
};
