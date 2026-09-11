import type { Metadata } from 'next';
import { assetUrl } from './asset-url';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:59061'),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: assetUrl('/'),
  },
  icons: {
    icon: assetUrl('/favicon.png'),
  },
  title: 'RIGOR: Rig-Informed Geometry for Omnidirectional Reconstruction',
  description: 'Long-sequence 3D reconstruction from omnidirectional video using a frozen perspective backbone and known virtual-rig geometry.',
  openGraph: {
    title: 'RIGOR: Rig-Informed Geometry for Omnidirectional Reconstruction',
    description: 'Long-sequence 3D reconstruction from omnidirectional video using known virtual-rig geometry.',
    images: [assetUrl('/og.png')],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RIGOR: Rig-Informed Geometry for Omnidirectional Reconstruction',
    description: 'Long-sequence 3D reconstruction from omnidirectional video using known virtual-rig geometry.',
    images: [assetUrl('/og.png')],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
