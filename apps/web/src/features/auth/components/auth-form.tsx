'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/molecules';
import { Button } from '@shared/components/atoms';
import { FormField } from '@shared/components/molecules';
import {
  registerSchema,
  loginSchema,
  type RegisterSchema,
  type LoginSchema,
} from '@interview-app/shared/schemas';
import { useAuthStore } from '../lib';
import { loginUser, registerUser } from '../api';
import { cn } from '@shared/utils';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema | LoginSchema>({
    resolver: zodResolver(mode === 'register' ? registerSchema : loginSchema),
  });

  const onSubmit = async (data: RegisterSchema | LoginSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const result =
        mode === 'register'
          ? await registerUser(data.email, data.password)
          : await loginUser(data.email, data.password);

      localStorage.setItem('token', result.accessToken);
      document.cookie = `accessToken=${result.accessToken}; path=/; SameSite=Lax`;
      setAuth(result.accessToken, result.user);
      router.push('/notes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{mode === 'register' ? 'Create Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>
          {mode === 'register'
            ? 'Enter your credentials to create your account'
            : 'Sign in to your account to continue'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email ? String(errors.email.message) : undefined}
            {...register('email')}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password ? String(errors.password.message) : undefined}
            {...register('password')}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
