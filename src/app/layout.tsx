import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'FluentAI – Real-Time English Speaking Coach',
  description: 'Build English speaking confidence with AI-powered real-time coaching, grammar correction, and personalized feedback.',
  keywords: ['english speaking', 'AI coach', 'fluency', 'grammar correction', 'language learning'],
  openGraph: {
    title: 'FluentAI – Real-Time English Speaking Coach',
    description: 'Build English speaking confidence with AI-powered real-time coaching.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
