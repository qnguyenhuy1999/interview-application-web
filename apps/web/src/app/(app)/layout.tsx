import { Navbar } from '@shared/components/organisms/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar isAuthenticated={true} />
      <main className="flex-1 container mx-auto px-6 py-12 md:px-12 md:py-16 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
