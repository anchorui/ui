/// <reference types="gtag.js" />

declare module 'gtag.js';
declare module '@mui/monorepo/docs/nextConfigDocsInfra.js';

// Google Analytics gtag types
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}
