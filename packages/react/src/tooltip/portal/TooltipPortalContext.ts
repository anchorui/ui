import * as React from 'react';

export const TooltipPortalContext = React.createContext<boolean | undefined>(undefined);

export function useTooltipPortalContext() {
  const value = React.useContext(TooltipPortalContext);
  if (value === undefined) {
    throw new Error('Anchor UI: <Tooltip.Portal> is missing.');
  }
  return value;
}
