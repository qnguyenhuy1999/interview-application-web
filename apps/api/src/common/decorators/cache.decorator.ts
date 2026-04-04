import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata
} from "@nestjs/common";

export const CACHE_TTL_KEY = "cache_ttl";
export const CACHE_KEY_KEY = "cache_key";

export const Cacheable = (
  keyPrefix: string,
  ttlMs = 300_000,
): MethodDecorator => SetMetadata(CACHE_TTL_KEY, ttlMs);

export const CacheKey = (key: string): MethodDecorator =>
  SetMetadata(CACHE_KEY_KEY, key);

export const CorrelationId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.correlationId ?? "unknown";
  },
);
