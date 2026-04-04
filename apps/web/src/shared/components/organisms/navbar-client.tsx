'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@features/auth';

export function NavbarClient() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Desktop specific buttons */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
        >
          Log Out
        </button>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex size-10 items-center justify-center rounded-xl bg-muted/50 hover:bg-muted transition-colors md:hidden text-foreground ml-auto"
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full border-b bg-background/95 backdrop-blur-xl px-6 py-4 shadow-xl md:hidden animate-fade-in z-50">
          <div className="flex flex-col gap-4">
            <Link
              href="/notes"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="block w-full text-left rounded-lg px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
