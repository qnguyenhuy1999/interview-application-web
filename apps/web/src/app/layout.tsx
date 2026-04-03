import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Interview Trainer',
  description: 'Personal AI-powered senior developer interview preparation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
