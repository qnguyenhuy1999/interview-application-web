/**
 * MONOLITH (Before): No shared response types across services
 * MICROSERVICES (After): Common response types for all services
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import type { ApiResponse, ApiError, PaginationParams, PaginatedResponse } from './index';

export type { ApiResponse, ApiError, PaginationParams, PaginatedResponse };

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  error: string,
  correlationId?: string,
  path?: string,
): ApiResponse<never> {
  return {
    error: { statusCode, message, error, correlationId, path },
    timestamp: new Date().toISOString(),
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
