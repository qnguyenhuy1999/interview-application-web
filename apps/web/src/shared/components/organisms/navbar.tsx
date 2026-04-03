import Link from 'next/link';
import { NavbarClient } from './navbar-client';

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 backdrop-blur px-4 py-3 sm:px-6 md:px-8">
      <Link href="/notes" className="text-base font-bold sm:text-lg">
        Interview Trainer
      </Link>

      <div className="hidden items-center gap-4 sm:flex">
        <Link
          href="/notes"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Notes
        </Link>
        {isAuthenticated && <NavbarClient />}
      </div>
    </nav>
  );
}
