import { Injectable, Scope } from "@nestjs/common";

export interface ICachingService {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlMs?: number): void;
  del(key: string): void;
  flush(): void;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable({ scope: Scope.REQUEST })
export class CacheService implements ICachingService {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set<T>(key: string, value: T, ttlMs = 300_000): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  flush(): void {
    this.cache.clear();
  }
}
