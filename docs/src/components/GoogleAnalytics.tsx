'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useDemoVariantSelectorContext } from './Demo/DemoVariantSelectorProvider';
import { usePackageManagerSnippetContext } from '../blocks/PackageManagerSnippet/PackageManagerSnippetProvider';
import { GoogleAnalytics as BaseGoogleAnalytics } from '../blocks/GoogleAnalytics';
import { GoogleTagManager } from '../blocks/GoogleTagManager';

const PRODUCTION_GA =
  process.env.DEPLOY_ENV === 'production' || process.env.DEPLOY_ENV === 'staging';
const GOOGLE_ANALYTICS_ID_V4 = PRODUCTION_GA ? 'G-F47JHCYZ3Y' : 'G-F47JHCYZ3Y';

export function GoogleAnalytics() {
  const currentRoute = usePathname();
  const demoVariantSelectorContext = useDemoVariantSelectorContext();
  const packageManagerSnippetContext = usePackageManagerSnippetContext();

  return (
    <React.Fragment>
      <GoogleTagManager id={GOOGLE_ANALYTICS_ID_V4} />
      <BaseGoogleAnalytics
        measurementId={GOOGLE_ANALYTICS_ID_V4}
        productId="anchor-ui"
        productCategoryId="core"
        currentRoute={currentRoute}
        codeLanguage={demoVariantSelectorContext.selectedLanguage}
        codeStylingVariant={demoVariantSelectorContext.selectedVariant}
        packageManager={packageManagerSnippetContext.packageManager}
        userLanguage="en"
      />
    </React.Fragment>
  );
}
