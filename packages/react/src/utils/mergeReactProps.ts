import type * as React from 'react';
import type { AnchorUIEvent, WithAnchorUIEvent } from './types';

/**
 * Merges multiple sets of React props such that their event handlers are called in sequence (the user's
 * before our internal ones), and allows the user to prevent the internal event handlers from being
 * executed by attaching a `preventAnchorUIHandler` method. It also merges the `style` prop, whereby
 * the user's styles overwrite the internal ones.
 * @important **`className` and `ref` are not merged.**
 * @param externalProps the user's external props.
 * @param internalProps our own internal props.
 * @returns the merged props.
 */
export function mergeReactProps<T extends React.ElementType>(
  externalProps: WithAnchorUIEvent<React.ComponentPropsWithRef<T>> | undefined,
  ...internalProps: React.ComponentPropsWithRef<T>[]
): WithAnchorUIEvent<React.ComponentPropsWithRef<T>> {
  let mergedInternalProps: WithAnchorUIEvent<React.ComponentPropsWithRef<T>> = internalProps[0];
  for (let i = 1; i < internalProps.length; i += 1) {
    mergedInternalProps = merge(mergedInternalProps, internalProps[i]);
  }

  return merge(externalProps, mergedInternalProps as React.ComponentPropsWithRef<T>);
}

function merge<T extends React.ElementType>(
  externalProps: WithAnchorUIEvent<React.ComponentPropsWithRef<T>> | undefined,
  internalProps: React.ComponentPropsWithRef<T>,
): WithAnchorUIEvent<React.ComponentPropsWithRef<T>> {
  if (!externalProps) {
    return internalProps;
  }

  return Object.entries(externalProps).reduce(
    (acc, [key, value]) => {
      if (
        // This approach is more efficient than using a regex.
        key[0] === 'o' &&
        key[1] === 'n' &&
        key.charCodeAt(2) >= 65 /* A */ &&
        key.charCodeAt(2) <= 90 /* Z */ &&
        typeof value === 'function'
      ) {
        acc[key] = (event: React.SyntheticEvent) => {
          let isPrevented = false;

          const theirHandler = value;
          const ourHandler = internalProps[key];

          const anchorUIEvent = event as AnchorUIEvent<typeof event>;

          anchorUIEvent.preventAnchorUIHandler = () => {
            isPrevented = true;
          };

          const result = theirHandler(anchorUIEvent);

          if (!isPrevented) {
            ourHandler?.(anchorUIEvent);
          }

          return result;
        };
      } else if (key === 'style') {
        if (value || internalProps.style) {
          acc[key] = { ...internalProps.style, ...(value || {}) };
        }
      } else if (key === 'className') {
        if (value) {
          if (internalProps.className) {
            // eslint-disable-next-line prefer-template
            acc[key] = value + ' ' + internalProps.className;
          } else {
            acc[key] = value;
          }
        } else {
          acc[key] = internalProps.className;
        }
      } else {
        acc[key] = value;
      }

      return acc;
    },
    { ...internalProps },
  );
}
