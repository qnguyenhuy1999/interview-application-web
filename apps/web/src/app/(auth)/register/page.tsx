import { AuthForm } from '@/components/auth/auth-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8">
      <AuthForm mode="register" />
      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
