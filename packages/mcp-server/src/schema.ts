/**
 * Type definitions for Anchor UI MCP Server
 */

export interface ComponentInfo {
  name: string;
  displayName: string;
  description: string;
  category: ComponentCategory;
  parts: ComponentPart[];
  documentationUrl: string;
  accessibility: AccessibilityInfo;
  composition: CompositionInfo;
}

export type ComponentCategory =
  | 'layout'
  | 'form'
  | 'overlay'
  | 'navigation'
  | 'feedback'
  | 'utility';

export interface ComponentPart {
  name: string;
  displayName: string;
  description: string;
  elementType: string;
  props: PropInfo[];
  required: boolean;
  dataAttributes?: Record<string, DataAttributeInfo>;
  cssVariables?: Record<string, string>;
}

export interface PropInfo {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: string | number | boolean;
  examples?: string[];
}

export interface DataAttributeInfo {
  description: string;
  type?: string;
}

export interface AccessibilityInfo {
  ariaAttributes: string[];
  keyboardNavigation: string[];
  screenReaderSupport: string[];
  requirements: string[];
  warnings: string[];
}

export interface CompositionInfo {
  requiredParts: string[];
  optionalParts: string[];
  examples: UsageExample[];
  donts: string[];
}

export interface UsageExample {
  title: string;
  code: string;
  description: string;
  variant?: 'basic' | 'controlled' | 'custom' | 'composition';
  language?: 'tsx' | 'jsx';
}

export interface GuardrailRule {
  id: string;
  severity: 'error' | 'warning' | 'info';
  pattern: string;
  message: string;
  fix?: string;
  category?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: ValidationIssue[];
}

export interface ValidationIssue {
  rule: string;
  message: string;
  line?: number;
  column?: number;
  fix?: string;
}

export interface ComponentMetadata {
  category: ComponentCategory;
  documentationUrl: string;
  requiredParts: string[];
  optionalParts: string[];
  keyboardNavigation?: string[];
  ariaAttributes?: string[];
}

