'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../utils/types';
import { Field } from '../field';

/**
 * A native input element that automatically works with [Field](https://anchorui.com/react/components/field).
 * Renders an `<input>` element.
 *
 * Documentation: [Anchor UI Input](https://anchorui.com/react/components/input)
 */
const Input = React.forwardRef(function Input(
  props: Input.Props,
  forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
  const { render, className, ...otherProps } = props;
  return <Field.Control ref={forwardedRef} render={render} className={className} {...otherProps} />;
});

namespace Input {
  export interface Props extends BaseUIComponentProps<'input', State> {}

  export interface State {}
}

Input.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component’s state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { Input };
