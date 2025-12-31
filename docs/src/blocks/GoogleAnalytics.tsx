'use client';
import * as React from 'react';
import { useMediaQuery } from '@anchor-ui/react/unstable-use-media-query';
import { useEnhancedEffect } from '@anchor-ui/react/utils';

let boundDataGaListener = false;

/**
 * basically just a `useAnalytics` hook.
 * However, it needs the redux store which is created
 * in the same component this "hook" is used.
 */
const GoogleAnalytics = React.memo(function GoogleAnalytics(props: GoogleAnalytics.Props) {
  const {
    measurementId,
    productId,
    productCategoryId,
    codeLanguage,
    codeStylingVariant,
    currentRoute,
    userLanguage,
  } = props;

  useEnhancedEffect(() => {
    // Ensure dataLayer exists (should already be initialized by GoogleTagManager)
    // @ts-expect-error
    window.dataLayer = window.dataLayer || [];

    // Ensure gtag function exists (should already be initialized by GoogleTagManager)
    if (typeof window.gtag === 'undefined') {
      function gtag(...args: unknown[]) {
        // @ts-expect-error
        window.dataLayer.push(...args);
      }
      window.gtag = gtag;
      gtag('js', new Date());
    }

    // Configure GA4 with measurement ID and disable automatic page views
    // (we'll send page views manually in useEffect)
    if (measurementId && window.gtag) {
      window.gtag('config', measurementId, {
        send_page_view: false,
      });
    }
  }, [measurementId]);

  React.useEffect(() => {
    if (!boundDataGaListener) {
      boundDataGaListener = true;
      document.addEventListener('click', handleDocumentClick);
    }
  }, []);

  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    // Wait for the title to be updated and ensure gtag is available.
    // React fires useEffect twice in dev mode
    if (typeof window.gtag === 'undefined') {
      return;
    }

    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      // Remove hash as it's never sent to the server
      // https://github.com/vercel/next.js/issues/25202
      const canonicalAsServer = window.location.pathname.replace(/#(.*)$/, '');

      // https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: canonicalAsServer,
        productId,
        productCategoryId,
      });
    }, 100);
  }, [currentRoute, productCategoryId, productId]);

  React.useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('set', 'user_properties', {
        codeVariant: codeLanguage,
      });
    }
  }, [codeLanguage]);

  React.useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('set', 'user_properties', {
        codeStylingVariant,
      });
    }
  }, [codeStylingVariant]);

  React.useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('set', 'user_properties', {
        userLanguage,
      });
    }
  }, [userLanguage]);

  React.useEffect(() => {
    /**
     * Based on https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#Monitoring_screen_resolution_or_zoom_level_changes
     * Adjusted to track 3 or more different ratios
     */
    function trackDevicePixelRatio() {
      if (typeof window.gtag !== 'undefined') {
        const devicePixelRatio = Math.round(window.devicePixelRatio * 10) / 10;
        window.gtag('set', 'user_properties', {
          devicePixelRatio,
        });
      }
    }

    trackDevicePixelRatio();

    const matchMedia: MediaQueryList = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );

    matchMedia.addEventListener('change', trackDevicePixelRatio);
    return () => {
      matchMedia.removeEventListener('change', trackDevicePixelRatio);
    };
  }, []);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const preferredColorScheme = prefersDarkMode ? 'dark' : 'light';

  React.useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('set', 'user_properties', {
        colorSchemeOS: preferredColorScheme,
      });
    }
  }, [preferredColorScheme]);

  return null;
});

namespace GoogleAnalytics {
  export interface Props {
    measurementId: string;
    productId: string;
    productCategoryId: string;
    codeStylingVariant: string;
    codeLanguage: string;
    currentRoute: string;
    packageManager: string;
    userLanguage: string;
  }
}

// So we can write code like:
//
// <Button
//   data-ga-event-category="demo"
//   data-ga-event-action="expand"
// >
//   Foo
// </Button>
function handleDocumentClick(event: MouseEvent) {
  let node = event.target as Node | null;

  while (node && node !== document) {
    const element: Element | null = node as Element;
    const category = (element as Element).getAttribute('data-ga-event-category');

    // We reach a tracking element, no need to look higher in the dom tree.
    if (category) {
      const split = parseFloat(element.getAttribute('data-ga-event-split') ?? '0');

      if (split && split < Math.random()) {
        return;
      }

      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', category, {
          eventAction: element.getAttribute('data-ga-event-action'),
          eventLabel: element.getAttribute('data-ga-event-label'),
        });
      }
      break;
    }

    node = element.parentElement;
  }
}

export { GoogleAnalytics };
