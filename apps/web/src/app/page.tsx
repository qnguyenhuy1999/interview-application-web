import { Suspense } from 'react';
import { AuthForm } from '@features/auth/components';
import Link from 'next/link';
import { APP_NAME, APP_DESCRIPTION } from '@shared/constants';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {APP_NAME}
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {APP_DESCRIPTION}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/login"
          className="rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-input bg-background px-6 py-3 text-center text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}