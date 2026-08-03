import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tech Canvas Studio',
  description: 'Professional design, video editing, and AI-powered creative tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-darkest text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
