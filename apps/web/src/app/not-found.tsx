import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">404</h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Page not found
        </p>
      </div>
      <Link
        href="/"
        className="rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
