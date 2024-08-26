import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function rateLimit(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  const key = `ratelimit_${ip}`;
  const limit = 10;
  const window = 60; // 1 minute

  const current = (await redis.get(key)) as string | null;
  const currentCount = current ? parseInt(current, 10) : 0;

  if (currentCount >= limit) {
    return { success: false };
  }

  await redis.incr(key);
  await redis.expire(key, window);

  return { success: true };
}
