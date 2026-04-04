import { config } from "../config";
import type { ApiError } from "../types/errors";
import { ApiRequestError } from "../types/errors";

export { ApiRequestError } from "../types/errors";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  skipCache?: boolean;
  timeout?: number;
};

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

// LRU Cache for GET requests
const MAX_CACHE_SIZE = 100;
const cache = new Map<string, CacheEntry<unknown>>();
const accessOrder: string[] = [];

function getCacheKey(endpoint: string, options?: RequestOptions): string {
  return options?.token ? `${endpoint}:${options.token.slice(0, 8)}` : endpoint;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  const idx = accessOrder.indexOf(key);
  if (idx > -1) accessOrder.splice(idx, 1);
  accessOrder.push(key);
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const lruKey = accessOrder.shift();
    if (lruKey) cache.delete(lruKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
  accessOrder.push(key);
}

function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiRequestError(
        0,
        `Request timed out after ${timeoutMs}ms`,
        "TIMEOUT",
      );
    }
    throw error;
  }
}

async function fetchWithRetry<T>(
  url: string,
  init: RequestInit,
  retries: number,
  timeoutMs: number,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, init, timeoutMs);

      if (response.status === 401 || response.status === 403) {
        const errorData = (await response.json().catch(() => ({}))) as ApiError;
        throw new ApiRequestError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          "AUTH_ERROR",
        );
      }

      if (!response.ok && attempt < retries) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await sleep(backoffMs);
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as ApiError;
        throw new ApiRequestError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          "REQUEST_ERROR",
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof ApiRequestError) throw error;
      if (attempt < retries) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await sleep(backoffMs);
        lastError = error instanceof Error ? error : new Error(String(error));
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  throw lastError || new Error("Request failed after retries");
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
    skipCache = false,
    timeout = 10000,
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  headers["X-Correlation-ID"] = generateCorrelationId();

  const cacheKey = getCacheKey(endpoint, options);

  if (method === "GET" && !skipCache) {
    const cached = getFromCache<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  const url = `${config.apiUrl}${endpoint}`;
  const init: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const result = await fetchWithRetry<T>(url, init, 3, timeout);

  if (method === "GET" && !skipCache) {
    setCache(cacheKey, result);
  }

  return result;
}

export const cacheUtils = {
  clear: () => {
    cache.clear();
    accessOrder.length = 0;
  },
  invalidate: (endpoint: string) => {
    const key = getCacheKey(endpoint);
    cache.delete(key);
    const idx = accessOrder.indexOf(key);
    if (idx > -1) accessOrder.splice(idx, 1);
  },
  invalidateAll: () => {
    cache.clear();
    accessOrder.length = 0;
  },
};
