import { Navbar } from '@shared/components/organisms/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} />
      <main>{children}</main>
    </div>
  );
}
