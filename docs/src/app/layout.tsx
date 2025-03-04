import * as React from 'react';
import { Metadata } from 'next';
import { Favicons } from './Favicons';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <Favicons />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s · Anchor UI',
    default: 'Anchor UI',
  },
  twitter: {
    site: '@anchor_ui',
    card: 'summary_large_image',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: {
      template: '%s · Anchor UI',
      default: 'Anchor UI',
    },
    ttl: 604800,
  },
};
