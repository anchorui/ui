'use client';
import * as React from 'react';
import type { CheckboxRoot } from './CheckboxRoot';

export type CheckboxRootContext = CheckboxRoot.State;

export const CheckboxRootContext = React.createContext<CheckboxRootContext | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CheckboxRootContext.displayName = 'CheckboxRootContext';
}

export function useCheckboxRootContext() {
  const context = React.useContext(CheckboxRootContext);
  if (context === undefined) {
    throw new Error(
      'Anchor UI: CheckboxRootContext is missing. Checkbox parts must be placed within <Checkbox.Root>.',
    );
  }

  return context;
}
