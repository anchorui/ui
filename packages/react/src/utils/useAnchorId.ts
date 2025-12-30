'use client';
import { useId } from './useId';

/**
 * Wraps `useId` and prefixes generated `id`s with `anchor-ui-`
 * @param {string | undefined} idOverride overrides the generated id when provided
 * @returns {string | undefined}
 * @ignore - internal hook.
 */
export function useAnchorId(idOverride?: string): string | undefined {
  return useId(idOverride, 'anchor-ui');
}
