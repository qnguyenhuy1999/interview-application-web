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
      <button
        onClick={handleLogout}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Logout
      </button>

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
    </>
  );
}
