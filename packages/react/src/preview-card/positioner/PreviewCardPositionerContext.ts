'use client';
import * as React from 'react';
import type { Side, Align } from '../../utils/useAnchorPositioning';

export interface PreviewCardPositionerContext {
  side: Side;
  align: Align;
  arrowRef: React.MutableRefObject<Element | null>;
  arrowUncentered: boolean;
  arrowStyles: React.CSSProperties;
}

export const PreviewCardPositionerContext = React.createContext<
  PreviewCardPositionerContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  PreviewCardPositionerContext.displayName = 'PreviewCardPositionerContext';
}

export function usePreviewCardPositionerContext() {
  const context = React.useContext(PreviewCardPositionerContext);
  if (context === undefined) {
    throw new Error(
      'Anchor UI: <PreviewCard.Popup> and <PreviewCard.Arrow> must be used within the <PreviewCard.Positioner> component',
    );
  }

  return context;
}