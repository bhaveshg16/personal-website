import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  /** Seconds until the caller may retry (only meaningful when !success). */
  retryAfterSeconds: number;
}

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

const burstLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "5 m"),
      prefix: "chat:burst",
    })
  : null;

const dailyLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 d"),
      prefix: "chat:daily",
    })
  : null;

/** Dev fallback when Upstash env vars are absent (per-process, best effort). */
const memoryHits = new Map<string, number[]>();

function memoryLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const hits = (memoryHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= 10) {
    return {
      success: false,
      retryAfterSeconds: Math.ceil((hits[0] + windowMs - now) / 1000),
    };
  }
  hits.push(now);
  memoryHits.set(ip, hits);
  return { success: true, retryAfterSeconds: 0 };
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (!burstLimiter || !dailyLimiter) {
    return memoryLimit(ip);
  }
  const burst = await burstLimiter.limit(ip);
  if (!burst.success) {
    return {
      success: false,
      retryAfterSeconds: Math.max(1, Math.ceil((burst.reset - Date.now()) / 1000)),
    };
  }
  const daily = await dailyLimiter.limit(ip);
  if (!daily.success) {
    return {
      success: false,
      retryAfterSeconds: Math.max(1, Math.ceil((daily.reset - Date.now()) / 1000)),
    };
  }
  return { success: true, retryAfterSeconds: 0 };
}
