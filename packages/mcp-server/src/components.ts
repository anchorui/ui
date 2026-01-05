/**
 * Component discovery and parsing from reference JSON files
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type {
  ComponentInfo,
  ComponentPart,
  PropInfo,
  AccessibilityInfo,
  CompositionInfo,
  UsageExample,
  ComponentCategory,
  ComponentMetadata,
} from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WORKSPACE_ROOT = join(__dirname, '../../../');
const REFERENCE_PATH = join(WORKSPACE_ROOT, 'docs/reference/generated');
const OVERRIDES_PATH = join(WORKSPACE_ROOT, 'docs/reference/overrides');
const DEMOS_PATH = join(WORKSPACE_ROOT, 'docs/src/app/(public)/(content)/react/components');

// Component metadata mapping
const COMPONENT_METADATA: Record<string, ComponentMetadata> = {
  Accordion: {
    category: 'layout',
    documentationUrl: 'https://anchorui.com/react/components/accordion',
    requiredParts: ['Root', 'Item', 'Header', 'Trigger', 'Panel'],
    optionalParts: [],
    keyboardNavigation: ['Arrow keys for navigation', 'Enter/Space to toggle'],
    ariaAttributes: ['aria-controls', 'aria-expanded', 'aria-labelledby'],
  },
  AlertDialog: {
    category: 'overlay',
    documentationUrl: 'https://anchorui.com/react/components/alert-dialog',
    requiredParts: ['Root', 'Trigger', 'Portal', 'Popup', 'Title', 'Description'],
    optionalParts: ['Backdrop', 'Close'],
    keyboardNavigation: ['Escape to close', 'Tab to navigate', 'Focus trap'],
    ariaAttributes: ['role="alertdialog"', 'aria-labelledby', 'aria-describedby'],
  },
  Checkbox: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/checkbox',
    requiredParts: ['Root', 'Indicator'],
    optionalParts: [],
    keyboardNavigation: ['Space to toggle'],
    ariaAttributes: ['aria-checked', 'aria-disabled'],
  },
  CheckboxGroup: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/checkbox-group',
    requiredParts: ['Root'],
    optionalParts: [],
    keyboardNavigation: ['Arrow keys for navigation', 'Space to toggle'],
    ariaAttributes: ['role="group"', 'aria-labelledby'],
  },
  Collapsible: {
    category: 'layout',
    documentationUrl: 'https://anchorui.com/react/components/collapsible',
    requiredParts: ['Root', 'Trigger', 'Panel'],
    optionalParts: [],
    keyboardNavigation: ['Enter/Space to toggle'],
    ariaAttributes: ['aria-controls', 'aria-expanded'],
  },
  Dialog: {
    category: 'overlay',
    documentationUrl: 'https://anchorui.com/react/components/dialog',
    requiredParts: ['Root', 'Trigger', 'Portal', 'Popup'],
    optionalParts: ['Backdrop', 'Title', 'Description', 'Close'],
    keyboardNavigation: ['Escape to close', 'Tab to navigate', 'Focus trap'],
    ariaAttributes: ['role="dialog"', 'aria-labelledby', 'aria-describedby'],
  },
  Field: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/field',
    requiredParts: ['Root', 'Control'],
    optionalParts: ['Label', 'Description', 'Error', 'Validity'],
    keyboardNavigation: [],
    ariaAttributes: ['aria-labelledby', 'aria-describedby', 'aria-invalid'],
  },
  Fieldset: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/fieldset',
    requiredParts: ['Root', 'Legend'],
    optionalParts: [],
    keyboardNavigation: [],
    ariaAttributes: [],
  },
  Form: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/form',
    requiredParts: ['Root'],
    optionalParts: [],
    keyboardNavigation: [],
    ariaAttributes: [],
  },
  Input: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/input',
    requiredParts: ['Root'],
    optionalParts: [],
    keyboardNavigation: [],
    ariaAttributes: [],
  },
  Menu: {
    category: 'overlay',
    documentationUrl: 'https://anchorui.com/react/components/menu',
    requiredParts: ['Root', 'Trigger', 'Portal', 'Popup', 'Item'],
    optionalParts: ['Backdrop', 'Positioner', 'Group', 'GroupLabel', 'CheckboxItem', 'RadioGroup', 'RadioItem', 'SubmenuTrigger', 'Arrow'],
    keyboardNavigation: ['Arrow keys for navigation', 'Enter to select', 'Escape to close'],
    ariaAttributes: ['role="menu"', 'aria-labelledby'],
  },
  NumberField: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/number-field',
    requiredParts: ['Root', 'Input'],
    optionalParts: ['Group', 'Increment', 'Decrement', 'ScrubArea', 'ScrubAreaCursor'],
    keyboardNavigation: ['Arrow keys to increment/decrement', 'Page Up/Down for large steps'],
    ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  },
  Popover: {
    category: 'overlay',
    documentationUrl: 'https://anchorui.com/react/components/popover',
    requiredParts: ['Root', 'Trigger', 'Portal', 'Popup'],
    optionalParts: ['Backdrop', 'Positioner', 'Title', 'Description', 'Close', 'Arrow'],
    keyboardNavigation: ['Escape to close'],
    ariaAttributes: ['aria-labelledby', 'aria-describedby'],
  },
  PreviewCard: {
    category: 'overlay',
    documentationUrl: 'https://anchorui.com/react/components/preview-card',
    requiredParts: ['Root', 'Trigger', 'Portal', 'Popup'],
    optionalParts: ['Backdrop', 'Positioner', 'Arrow'],
    keyboardNavigation: ['Escape to close'],
    ariaAttributes: [],
  },
  Progress: {
    category: 'feedback',
    documentationUrl: 'https://anchorui.com/react/components/progress',
    requiredParts: ['Root', 'Track', 'Indicator'],
    optionalParts: [],
    keyboardNavigation: [],
    ariaAttributes: ['role="progressbar"', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  },
  Radio: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/radio',
    requiredParts: ['Root', 'Indicator'],
    optionalParts: [],
    keyboardNavigation: ['Arrow keys to navigate', 'Space to select'],
    ariaAttributes: ['aria-checked', 'aria-disabled'],
  },
  RadioGroup: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/radio-group',
    requiredParts: ['Root'],
    optionalParts: [],
    keyboardNavigation: ['Arrow keys to navigate', 'Space to select'],
    ariaAttributes: ['role="radiogroup"', 'aria-labelledby'],
  },
  ScrollArea: {
    category: 'utility',
    documentationUrl: 'https://anchorui.com/react/components/scroll-area',
    requiredParts: ['Root', 'Viewport'],
    optionalParts: ['Scrollbar', 'Thumb', 'Corner'],
    keyboardNavigation: [],
    ariaAttributes: [],
  },
  Select: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/select',
    requiredParts: ['Root', 'Trigger', 'Portal', 'Popup', 'Item'],
    optionalParts: ['Backdrop', 'Positioner', 'Value', 'Icon', 'ItemIndicator', 'ItemText', 'Group', 'GroupLabel', 'Arrow', 'ScrollUpArrow', 'ScrollDownArrow'],
    keyboardNavigation: ['Arrow keys for navigation', 'Enter to select', 'Escape to close'],
    ariaAttributes: ['role="combobox"', 'aria-expanded', 'aria-labelledby'],
  },
  Separator: {
    category: 'utility',
    documentationUrl: 'https://anchorui.com/react/components/separator',
    requiredParts: ['Root'],
    optionalParts: [],
    keyboardNavigation: [],
    ariaAttributes: ['role="separator"'],
  },
  Slider: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/slider',
    requiredParts: ['Root', 'Control', 'Track', 'Thumb'],
    optionalParts: ['Indicator', 'Value'],
    keyboardNavigation: ['Arrow keys to adjust', 'Page Up/Down for large steps'],
    ariaAttributes: ['role="slider"', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-orientation'],
  },
  Switch: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/switch',
    requiredParts: ['Root', 'Thumb'],
    optionalParts: [],
    keyboardNavigation: ['Space to toggle'],
    ariaAttributes: ['role="switch"', 'aria-checked', 'aria-disabled'],
  },
  Tabs: {
    category: 'navigation',
    documentationUrl: 'https://anchorui.com/react/components/tabs',
    requiredParts: ['Root', 'List', 'Tab', 'Panel'],
    optionalParts: ['Indicator'],
    keyboardNavigation: ['Arrow keys for navigation', 'Enter/Space to activate'],
    ariaAttributes: ['role="tablist"', 'role="tab"', 'role="tabpanel"', 'aria-selected'],
  },
  Toggle: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/toggle',
    requiredParts: ['Root'],
    optionalParts: [],
    keyboardNavigation: ['Space to toggle'],
    ariaAttributes: ['aria-pressed'],
  },
  ToggleGroup: {
    category: 'form',
    documentationUrl: 'https://anchorui.com/react/components/toggle-group',
    requiredParts: ['Root'],
    optionalParts: [],
    keyboardNavigation: ['Arrow keys for navigation', 'Space to toggle'],
    ariaAttributes: ['role="group"'],
  },
  Tooltip: {
    category: 'overlay',
    documentationUrl: 'https://anchorui.com/react/components/tooltip',
    requiredParts: ['Root', 'Trigger', 'Portal', 'Popup'],
    optionalParts: ['Positioner', 'Arrow', 'Provider'],
    keyboardNavigation: [],
    ariaAttributes: ['role="tooltip"', 'aria-describedby'],
  },
};

/**
 * Get list of all available components
 */
export async function getComponentList(category?: ComponentCategory | 'all'): Promise<ComponentInfo[]> {
  if (!existsSync(REFERENCE_PATH)) {
    throw new Error(`Reference path not found: ${REFERENCE_PATH}`);
  }

  const files = readdirSync(REFERENCE_PATH).filter((f) => f.endsWith('.json'));
  const componentNames = new Set<string>();

  // Extract component names from file names
  files.forEach((file) => {
    const match = file.match(/^([a-z-]+)-(root|trigger|panel|item|header|popup|backdrop|portal|positioner|title|description|close|arrow|value|icon|indicator|thumb|track|control|list|tab|label|error|validity|legend|group|group-label|item-indicator|item-text|scroll-up-arrow|scroll-down-arrow|checkbox-item|checkbox-item-indicator|radio-group|radio-item|radio-item-indicator|submenu-trigger|provider|viewport|scrollbar|corner|increment|decrement|scrub-area|scrub-area-cursor|popup)\.json$/);
    if (match) {
      const componentName = match[1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
      componentNames.add(componentName);
    }
  });

  const componentInfos = (await Promise.all(
    Array.from(componentNames).map((name) => getComponentDetails(name))
  )).filter((info): info is ComponentInfo => info !== null);

  if (category && category !== 'all') {
    return componentInfos.filter((c) => c.category === category);
  }

  return componentInfos;
}

/**
 * Get detailed information about a specific component
 */
export async function getComponentDetails(componentName: string): Promise<ComponentInfo | null> {
  const normalizedName = componentName.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
  const files = readdirSync(REFERENCE_PATH).filter((f) =>
    f.startsWith(normalizedName + '-')
  );

  if (files.length === 0) {
    return null;
  }

  const parts: ComponentPart[] = [];
  const metadata = COMPONENT_METADATA[componentName] || {
    category: 'utility' as ComponentCategory,
    documentationUrl: `https://anchorui.com/react/components/${normalizedName}`,
    requiredParts: [],
    optionalParts: [],
  };

  // Parse all part files
  for (const file of files) {
    try {
      const partData = JSON.parse(
        readFileSync(join(REFERENCE_PATH, file), 'utf-8')
      );
      const partName = extractPartName(file, normalizedName);
      parts.push(parseComponentPart(partData, partName, componentName));
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
    }
  }

  // Sort parts: Root first, then alphabetically
  parts.sort((a, b) => {
    if (a.name === 'Root') return -1;
    if (b.name === 'Root') return 1;
    return a.name.localeCompare(b.name);
  });

  return {
    name: componentName,
    displayName: componentName,
    description: parts.find((p) => p.name === 'Root')?.description || `${componentName} component`,
    category: metadata.category,
    parts,
    documentationUrl: metadata.documentationUrl,
    accessibility: getAccessibilityInfo(componentName, parts, metadata),
    composition: getCompositionInfo(componentName, parts, metadata),
  };
}

/**
 * Get information about a specific component part
 */
export async function getComponentPartInfo(
  componentName: string,
  partName: string
): Promise<ComponentPart | null> {
  const details = await getComponentDetails(componentName);
  if (!details) {
    return null;
  }
  return details.parts.find((p) => p.name === partName) || null;
}

/**
 * Parse component part from JSON data
 */
function parseComponentPart(
  data: any,
  partName: string,
  componentName: string
): ComponentPart {
  const props: PropInfo[] = Object.entries(data.props || {}).map(([name, prop]: [string, any]) => ({
    name,
    type: prop.type || 'unknown',
    description: prop.description || '',
    required: prop.default === undefined && name !== 'className' && name !== 'render',
    default: prop.default,
  }));

  return {
    name: partName,
    displayName: partName,
    description: data.description || '',
    elementType: inferElementType(partName, props, componentName),
    props,
    required: partName === 'Root' || COMPONENT_METADATA[componentName]?.requiredParts.includes(partName),
    dataAttributes: data.dataAttributes || {},
    cssVariables: data.cssVariables || {},
  };
}

/**
 * Infer HTML element type from part name and props
 */
function inferElementType(partName: string, props: PropInfo[], componentName: string): string {
  if (partName.includes('Trigger') || partName.includes('Button') || partName.includes('Close')) {
    return 'button';
  }
  if (partName.includes('Input') || partName.includes('Control')) {
    return 'input';
  }
  if (partName.includes('Label') || partName.includes('Legend')) {
    return 'label';
  }
  if (partName.includes('Panel') || partName.includes('Popup') || partName.includes('Content')) {
    return 'div';
  }
  if (partName.includes('Item')) {
    return 'div';
  }
  if (partName.includes('Arrow')) {
    return 'div';
  }
  if (partName.includes('Track')) {
    return 'div';
  }
  if (partName.includes('Thumb')) {
    return 'div';
  }
  if (partName.includes('Indicator')) {
    return 'div';
  }
  return 'div';
}

/**
 * Extract part name from filename
 */
function extractPartName(file: string, componentName: string): string {
  return file
    .replace(`${componentName}-`, '')
    .replace('.json', '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

/**
 * Get accessibility information
 */
function getAccessibilityInfo(
  componentName: string,
  parts: ComponentPart[],
  metadata: ComponentMetadata
): AccessibilityInfo {
  const ariaAttributes = metadata.ariaAttributes || [];
  const keyboardNavigation = metadata.keyboardNavigation || [];
  const requirements: string[] = [];
  const warnings: string[] = [];

  // Component-specific accessibility rules
  if (componentName === 'Accordion') {
    requirements.push('Each accordion item must have a trigger and panel');
    requirements.push('Trigger must have aria-controls pointing to panel id');
  } else if (componentName === 'Dialog' || componentName === 'AlertDialog') {
    requirements.push('Must have a Title component for accessibility');
    requirements.push('Focus must be trapped when modal');
    warnings.push('Ensure focus returns to trigger when closed');
  } else if (componentName === 'Menu' || componentName === 'Select') {
    requirements.push('Must have at least one Item');
    requirements.push('Keyboard navigation must loop through items');
  } else if (componentName === 'Slider') {
    requirements.push('Must have aria-labelledby or aria-label');
    requirements.push('Must specify min, max, and optionally step');
  }

  return {
    ariaAttributes,
    keyboardNavigation,
    screenReaderSupport: ['ARIA attributes', 'Semantic HTML', 'Focus management'],
    requirements,
    warnings,
  };
}

/**
 * Get composition information
 */
function getCompositionInfo(
  componentName: string,
  parts: ComponentPart[],
  metadata: ComponentMetadata
): CompositionInfo {
  const requiredParts = metadata.requiredParts || ['Root'];
  const optionalParts = metadata.optionalParts || [];
  const allPartNames = parts.map((p) => p.name);
  const actualRequired = requiredParts.filter((p) => allPartNames.includes(p));
  const actualOptional = optionalParts.filter((p) => allPartNames.includes(p));

  return {
    requiredParts: actualRequired,
    optionalParts: actualOptional,
    examples: getUsageExamples(componentName),
    donts: getDonts(componentName),
  };
}

/**
 * Get usage examples (basic structure - can be enhanced with actual demo parsing)
 */
function getUsageExamples(componentName: string): UsageExample[] {
  const examples: UsageExample[] = [
    {
      title: 'Basic Usage',
      code: generateBasicExample(componentName),
      description: 'Minimal example using default props',
      variant: 'basic',
      language: 'tsx',
    },
  ];

  // Add controlled example for components that support it
  if (supportsControlledState(componentName)) {
    examples.push({
      title: 'Controlled State',
      code: generateControlledExample(componentName),
      description: 'Example with controlled state management',
      variant: 'controlled',
      language: 'tsx',
    });
  }

  return examples;
}

/**
 * Generate basic usage example
 */
function generateBasicExample(componentName: string): string {
  const metadata = COMPONENT_METADATA[componentName];
  if (!metadata) {
    return `import { ${componentName} } from '@anchor-ui/react/${componentName.toLowerCase()}';

<${componentName}.Root>
  {/* Add component parts */}
</${componentName}.Root>`;
  }

  const requiredParts = metadata.requiredParts.filter((p) => p !== 'Root');
  const partsCode = requiredParts
    .map((part) => {
      if (part === 'Trigger') {
        return `  <${componentName}.Trigger>Open</${componentName}.Trigger>`;
      }
      if (part === 'Item') {
        return `  <${componentName}.Item>Item</${componentName}.Item>`;
      }
      if (part === 'Panel' || part === 'Popup') {
        return `  <${componentName}.${part}>Content</${componentName}.${part}>`;
      }
      return `  <${componentName}.${part} />`;
    })
    .join('\n');

  return `import { ${componentName} } from '@anchor-ui/react/${componentName.toLowerCase()}';

<${componentName}.Root>
${partsCode}
</${componentName}.Root>`;
}

/**
 * Generate controlled state example
 */
function generateControlledExample(componentName: string): string {
  const metadata = COMPONENT_METADATA[componentName];
  const hasOpenState = ['Dialog', 'AlertDialog', 'Menu', 'Popover', 'Select', 'Tooltip', 'Collapsible'].includes(componentName);
  const hasValueState = ['Slider', 'NumberField', 'Checkbox', 'Radio', 'Switch', 'Tabs', 'Accordion'].includes(componentName);

  if (hasOpenState) {
    return `import * as React from 'react';
import { ${componentName} } from '@anchor-ui/react/${componentName.toLowerCase()}';

function Example() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <${componentName}.Root open={open} onOpenChange={setOpen}>
      <${componentName}.Trigger>Toggle</${componentName}.Trigger>
      <${componentName}.Portal>
        <${componentName}.Popup>Content</${componentName}.Popup>
      </${componentName}.Portal>
    </${componentName}.Root>
  );
}`;
  }

  if (hasValueState) {
    return `import * as React from 'react';
import { ${componentName} } from '@anchor-ui/react/${componentName.toLowerCase()}';

function Example() {
  const [value, setValue] = React.useState(null);
  
  return (
    <${componentName}.Root value={value} onValueChange={setValue}>
      {/* Add component parts */}
    </${componentName}.Root>
  );
}`;
  }

  return generateBasicExample(componentName);
}

/**
 * Check if component supports controlled state
 */
function supportsControlledState(componentName: string): boolean {
  return [
    'Dialog',
    'AlertDialog',
    'Menu',
    'Popover',
    'Select',
    'Tooltip',
    'Collapsible',
    'Slider',
    'NumberField',
    'Checkbox',
    'Radio',
    'Switch',
    'Tabs',
    'Accordion',
  ].includes(componentName);
}

/**
 * Get "don't" rules for component
 */
function getDonts(componentName: string): string[] {
  const commonDonts = [
    'Do not add inline styles - use className or CSS',
    'Do not break component composition',
    'Do not remove required ARIA attributes',
    'Do not use uncontrolled state when controlled is needed',
  ];

  const specificDonts: Record<string, string[]> = {
    Dialog: ['Do not nest dialogs without proper focus management'],
    Menu: ['Do not use Menu.Item outside of Menu.Popup'],
    Select: ['Do not use Select.Item outside of Select.Popup'],
    Slider: ['Do not set min equal to max'],
  };

  return [...commonDonts, ...(specificDonts[componentName] || [])];
}

