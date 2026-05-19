import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'Feed System',
  description: 'A scalable News Feed System similar to Twitter/X',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
        <ReactQueryProvider>
          <ToastProvider />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
