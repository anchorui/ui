import * as React from 'react';

export interface ScrollAreaScrollbarContext {
  orientation: 'horizontal' | 'vertical';
}

export const ScrollAreaScrollbarContext = React.createContext<
  ScrollAreaScrollbarContext | undefined
>(undefined);

if (process.env.NODE_ENV !== 'production') {
  ScrollAreaScrollbarContext.displayName = 'ScrollAreaScrollbarContext';
}

export function useScrollAreaScrollbarContext() {
  const context = React.useContext(ScrollAreaScrollbarContext);
  if (context === undefined) {
    throw new Error(
      'Anchor UI: ScrollAreaScrollbarContext is missing. ScrollAreaScrollbar parts must be placed within <ScrollArea.Scrollbar>.',
    );
  }
  return context;
}