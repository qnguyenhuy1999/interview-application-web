'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema, loginSchema, type RegisterSchema, type LoginSchema } from '@interview-app/shared/schemas';
import { useAuthStore } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = mode === 'register' ? registerSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema | LoginSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterSchema | LoginSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json() as { message?: string; accessToken?: string; user?: { id: string; email: string } };

      if (!response.ok) {
        setError(result.message || 'An error occurred');
        return;
      }

      if (result.accessToken && result.user) {
        localStorage.setItem('token', result.accessToken);
        document.cookie = `accessToken=${result.accessToken}; path=/; SameSite=Lax`;
        setAuth(result.accessToken, result.user);
      }

      router.push('/notes');
    } catch {
      setError('Network error. Please try again.');
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
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              {...register('email')}
              type="email"
              className={cn(
                'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                errors.email && 'border-destructive'
              )}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{String(errors.email.message)}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              {...register('password')}
              type="password"
              className={cn(
                'mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                errors.password && 'border-destructive'
              )}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{String(errors.password.message)}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
