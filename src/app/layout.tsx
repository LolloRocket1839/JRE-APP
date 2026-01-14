import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Jungle Rent - Investimenti immobiliari per studenti universitari',
  description: 'Investimenti immobiliari innovativi per studenti universitari a Torino. Incubato da 2i3T - Università di Torino.',
  keywords: ['investimenti', 'immobiliare', 'studenti', 'universitari', 'torino', 'affitto', 'alloggi'],
  authors: [{ name: 'Jungle Rent' }],
  creator: 'Jungle Rent',
  publisher: 'Jungle Rent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    alternateLocale: 'en_US',
    url: 'https://junglerent.it',
    siteName: 'Jungle Rent',
    title: 'Jungle Rent - Investimenti immobiliari per studenti universitari',
    description: 'Investimenti immobiliari innovativi per studenti universitari a Torino.',
    images: [
      {
        url: '/brand/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jungle Rent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jungle Rent',
    description: 'Investimenti immobiliari innovativi per studenti universitari a Torino.',
    images: ['/brand/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F5F0E8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-warm antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
