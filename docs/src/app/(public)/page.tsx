import * as React from 'react';
import type { Metadata, Viewport } from 'next';
import { Link } from 'docs/src/components/Link';
import { ArrowRightIcon } from 'docs/src/icons/ArrowRightIcon';
import { Logo } from 'docs/src/components/Logo';
import './page.css';

export default function Homepage() {
  return (
    <div className="HomepageRoot">
      <div className="HomepageContent">
        <Logo className="mb-8 ml-px" aria-label="Anchor UI" />
        <h1 className="HomepageHeading">
          Build with Stability, Craft with Confidence
        </h1>
        <p className="HomepageCaption">
          Built on top of Base UI, Anchor UI gives you full control over design while ensuring flexibility and accessibility.
        </p>
        <Link
          className="-m-1 inline-flex items-center gap-1 p-1"
          href="/react/overview/quick-start"
        >
          Documentation <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}

const description =
  'Anchor UI provides unstyled, customizable, and accessible React components for building scalable UI systems.';


export const metadata: Metadata = {
  description,
  twitter: {
    description,
  },
  openGraph: {
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    // Desktop Safari page background
    {
      media: '(prefers-color-scheme: light) and (min-width: 1024px)',
      color: 'oklch(95% 0.25% 264)',
    },
    {
      media: '(prefers-color-scheme: dark) and (min-width: 1024px)',
      color: 'oklch(25% 1% 264)',
    },

    // Mobile Safari header background (match the page)
    {
      media: '(prefers-color-scheme: light)',
      color: '#FFF',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#000',
    },
  ],
};
