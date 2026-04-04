/**
 * MONOLITH (Before): No shared contracts between services
 * MICROSERVICES (After): Type-safe API contracts for auth service
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserResponse,
} from './index';

export type { RegisterRequest, LoginRequest, AuthResponse, UserResponse };

// Route definitions for type-safe HTTP calls
export const AuthRoutes = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
} as const;
