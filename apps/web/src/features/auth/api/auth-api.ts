import { apiClient } from '@shared/lib/api-client';
import type { AuthResponse, ApiError } from '@shared/types';

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json() as AuthResponse | ApiError;

  if (!response.ok) {
    throw new Error((data as ApiError).message || 'Login failed');
  }

  return data as AuthResponse;
}

export async function registerUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json() as AuthResponse | ApiError;

  if (!response.ok) {
    throw new Error((data as ApiError).message || 'Registration failed');
  }

  return data as AuthResponse;
}
