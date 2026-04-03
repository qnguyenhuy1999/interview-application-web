'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/hooks/use-auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 backdrop-blur px-4 py-3 sm:px-6 md:px-8">
        {/* Logo */}
        <Link href="/notes" className="text-base font-bold sm:text-lg">
          Interview Trainer
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Notes
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex size-9 items-center justify-center rounded-md border sm:hidden"
          aria-label="Toggle menu"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-b px-4 py-3 sm:hidden">
          <Link
            href="/notes"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Notes
          </Link>
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="mt-2 block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Logout
          </button>
        </div>
      )}

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
