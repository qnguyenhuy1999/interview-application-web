import { Suspense } from 'react';
import { AuthForm } from '@features/auth/components';
import Link from 'next/link';

export const metadata = {
  title: 'Sign Up',
  description: 'Create your account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}