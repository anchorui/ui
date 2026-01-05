/**
 * Guardrails system for Anchor UI code validation
 */

import type { GuardrailRule, ValidationResult, ValidationIssue } from './schema.js';

export const GUARDRAIL_RULES: GuardrailRule[] = [
  // Accessibility rules
  {
    id: 'no-inline-styles',
    severity: 'error',
    pattern: 'style=\\{(.*?)\\}',
    message: 'Do not use inline styles. Anchor UI components are unstyled - use className or CSS instead.',
    fix: 'Replace inline styles with className and external CSS',
    category: 'styling',
  },
  {
    id: 'preserve-aria',
    severity: 'error',
    pattern: 'aria-\\w+=\\{(.*?)\\}',
    message: 'Do not override ARIA attributes unless necessary. Anchor UI handles accessibility automatically.',
    fix: 'Remove custom ARIA attributes unless you have a specific accessibility requirement',
    category: 'accessibility',
  },
  {
    id: 'no-uncontrolled-state',
    severity: 'warning',
    pattern: 'useState.*open.*setOpen',
    message: 'Consider using controlled state (value/onValueChange or open/onOpenChange) instead of useState for better integration.',
    fix: 'Use value and onValueChange props for controlled components',
    category: 'state-management',
  },
  {
    id: 'preserve-composition',
    severity: 'error',
    pattern: '<\\w+\\.Root[^>]*>.*?</\\w+\\.Root>',
    message: 'Do not break component composition. Always use component parts (Root, Trigger, Panel, etc.)',
    fix: 'Ensure all component parts are properly nested',
    category: 'composition',
  },
  {
    id: 'no-direct-dom-manipulation',
    severity: 'error',
    pattern: 'document\\.(getElementById|querySelector|getElementsBy)',
    message: 'Do not manipulate DOM directly. Use React refs and component APIs instead.',
    fix: 'Use refs and component state management',
    category: 'react-patterns',
  },
  {
    id: 'use-render-prop',
    severity: 'info',
    pattern: 'render=\\{["\'](div|span|button)["\']\\}',
    message: 'Consider using render prop function for custom element types instead of string for better type safety.',
    fix: 'Use render prop function: render={(props) => <CustomElement {...props} />}',
    category: 'best-practices',
  },
  {
    id: 'preserve-keyboard-navigation',
    severity: 'error',
    pattern: 'onKeyDown.*preventDefault|stopPropagation',
    message: 'Do not prevent default keyboard behavior unless absolutely necessary. Anchor UI handles keyboard navigation.',
    fix: 'Remove preventDefault/stopPropagation unless handling custom keyboard shortcuts',
    category: 'accessibility',
  },
  {
    id: 'no-css-in-js-libraries',
    severity: 'warning',
    pattern: '(styled-components|emotion|@emotion|styled\\(|css\\(|makeStyles)',
    message: 'Anchor UI is unstyled. Consider using plain CSS, CSS Modules, or Tailwind instead.',
    fix: 'Use className with external CSS',
    category: 'styling',
  },
  {
    id: 'use-classname-function',
    severity: 'info',
    pattern: 'className=\\{["\']',
    message: 'Consider using className as a function to access component state for conditional styling.',
    fix: 'Use className={(state) => state.open ? "open" : "closed"}',
    category: 'best-practices',
  },
  {
    id: 'no-broken-composition',
    severity: 'error',
    pattern: '<(Dialog|Menu|Select|Popover|Tooltip)\\.(Trigger|Popup|Portal)[^>]*>',
    message: 'Ensure overlay components have proper Portal and Popup structure.',
    fix: 'Wrap Popup in Portal for overlay components',
    category: 'composition',
  },
  {
    id: 'preserve-data-attributes',
    severity: 'warning',
    pattern: 'data-\\w+=\\{["\']',
    message: 'Do not manually set data attributes. Anchor UI provides them automatically via state.',
    fix: 'Use className with state function to style based on data attributes',
    category: 'styling',
  },
  {
    id: 'no-missing-required-parts',
    severity: 'error',
    pattern: '<(Dialog|AlertDialog|Menu|Select)\\.Root[^>]*>',
    message: 'Ensure all required component parts are included (e.g., Dialog requires Trigger, Portal, Popup).',
    fix: 'Include all required parts as specified in component documentation',
    category: 'composition',
  },
];

/**
 * Validate code against Anchor UI guardrails
 */
export function validateCode(
  code: string,
  componentName?: string
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const suggestions: ValidationIssue[] = [];

  const lines = code.split('\n');

  GUARDRAIL_RULES.forEach((rule) => {
    // Skip component-specific rules if component name doesn't match
    if (rule.category === 'composition' && componentName) {
      const componentSpecificRules = [
        'Dialog',
        'AlertDialog',
        'Menu',
        'Select',
        'Popover',
        'Tooltip',
      ];
      if (
        rule.pattern.includes('(Dialog|Menu|Select|Popover|Tooltip)') &&
        !componentSpecificRules.includes(componentName)
      ) {
        return;
      }
    }

    const regex = new RegExp(rule.pattern, 'g');
    let match;
    while ((match = regex.exec(code)) !== null) {
      const lineNumber = code.substring(0, match.index).split('\n').length;
      const column = match.index - code.substring(0, match.index).lastIndexOf('\n') - 1;

      const issue: ValidationIssue = {
        rule: rule.id,
        message: rule.message,
        line: lineNumber,
        column: column > 0 ? column : undefined,
        ...(rule.fix && { fix: rule.fix }),
      };

      if (rule.severity === 'error') {
        errors.push(issue);
      } else if (rule.severity === 'warning') {
        warnings.push(issue);
      } else {
        suggestions.push(issue);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Get all guardrail rules
 */
export function getGuardrails(): GuardrailRule[] {
  return GUARDRAIL_RULES;
}

/**
 * Get guardrails by category
 */
export function getGuardrailsByCategory(category: string): GuardrailRule[] {
  return GUARDRAIL_RULES.filter((rule) => rule.category === category);
}

