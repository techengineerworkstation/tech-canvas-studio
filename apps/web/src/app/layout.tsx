import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Adobe Creative Suite',
  description: 'Professional design, video editing, and AI-powered creative tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-darkest antialiased">
        {children}
      </body>
    </html>
  );
}
