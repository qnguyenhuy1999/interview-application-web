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
    <div className="flex w-full items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-md border-border/40 bg-card/60 p-2 shadow-2xl backdrop-blur-xl transition-all sm:p-4">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mode === 'register' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              )}
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-base">
            {mode === 'register'
              ? 'Enter your credentials to create your account'
              : 'Sign in to your account to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-base font-semibold shadow-md transition-transform hover:-translate-y-0.5" disabled={isLoading}>
              {isLoading ? 'Processing...' : mode === 'register' ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
