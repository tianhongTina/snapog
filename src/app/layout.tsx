import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'SnapOG — Beautiful Open Graph Image Generator',
    template: '%s | SnapOG',
  },
  description:
    'Generate stunning Open Graph images for your website in seconds. 10 beautiful templates, simple API, edge-fast delivery.',
  keywords: ['og image', 'open graph', 'social share image', 'next.js', 'og generator'],
  authors: [{ name: 'SnapOG' }],
  creator: 'SnapOG',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'SnapOG',
    title: 'SnapOG — Beautiful Open Graph Image Generator',
    description: 'Generate stunning OG images for your website in seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapOG — Beautiful Open Graph Image Generator',
    description: 'Generate stunning OG images for your website in seconds.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
