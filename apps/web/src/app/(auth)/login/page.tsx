import { Suspense } from 'react';
import { AuthForm } from '@features/auth/components';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}