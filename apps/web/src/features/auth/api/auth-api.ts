import { apiClient } from '@shared/lib/api-client';
import type { AuthResponse } from '@shared/types';

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function registerUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: { email, password },
  });
}
