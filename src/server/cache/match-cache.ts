import { createHash } from "node:crypto";

import Redis from "ioredis";

import type { RideMatch, RideRequest } from "@/src/domain/types";

export interface MatchCache {
  get(request: RideRequest): Promise<RideMatch[] | null>;
  set(request: RideRequest, matches: RideMatch[]): Promise<void>;
}

function cacheKey(request: RideRequest): string {
  const digest = createHash("sha256")
    .update(JSON.stringify(request))
    .digest("hex");
  return `zotpool:matches:${digest}`;
}

export class MemoryMatchCache implements MatchCache {
  private readonly values = new Map<string, RideMatch[]>();

  async get(request: RideRequest): Promise<RideMatch[] | null> {
    return this.values.get(cacheKey(request)) ?? null;
  }

  async set(request: RideRequest, matches: RideMatch[]): Promise<void> {
    this.values.set(cacheKey(request), matches);
  }
}

export class RedisMatchCache implements MatchCache {
  constructor(private readonly redis: Redis) {}

  async get(request: RideRequest): Promise<RideMatch[] | null> {
    const value = await this.redis.get(cacheKey(request));
    return value ? (JSON.parse(value) as RideMatch[]) : null;
  }

  async set(request: RideRequest, matches: RideMatch[]): Promise<void> {
    await this.redis.set(cacheKey(request), JSON.stringify(matches), "EX", 60);
  }
}

let cache: MatchCache | undefined;

export function getMatchCache(): MatchCache {
  if (cache) return cache;
  cache = process.env.REDIS_URL
    ? new RedisMatchCache(new Redis(process.env.REDIS_URL, { lazyConnect: true }))
    : new MemoryMatchCache();
  return cache;
}
