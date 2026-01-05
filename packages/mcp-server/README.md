# Anchor UI MCP Server

Model Context Protocol (MCP) server for Anchor UI component discovery and validation. This server enables AI IDEs like Cursor and VS Code to understand Anchor UI components, their props, usage patterns, and guardrails.

## Features

- **Component Discovery**: List all available Anchor UI components by category
- **Props Understanding**: Get detailed information about component props, types, and descriptions
- **Usage Examples**: Retrieve code examples for basic, controlled, and custom usage
- **Guardrails**: Validate code against Anchor UI best practices and prevent common mistakes
- **Accessibility**: Understand ARIA attributes and keyboard navigation requirements
- **Composition Rules**: Learn required and optional component parts

## Installation

Install from npm:

```bash
npm install @anchor-ui/mcp-server
```

Or install globally:

```bash
npm install -g @anchor-ui/mcp-server
```

## Usage

### As MCP Server

The server communicates via stdio using the MCP protocol. Configure it in your IDE:

**Cursor Configuration** (`~/.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "anchor-ui": {
      "command": "npx",
      "args": ["-y", "@anchor-ui/mcp-server"]
    }
  }
}
```

Or if installed globally:
```json
{
  "mcpServers": {
    "anchor-ui": {
      "command": "anchor-ui-mcp"
    }
  }
}
```

**VS Code Configuration** (via MCP extension):
```json
{
  "mcp.servers": {
    "anchor-ui": {
      "command": "npx",
      "args": ["-y", "@anchor-ui/mcp-server"]
    }
  }
}
```

### Development

```bash
# Build
pnpm build

# Run in development mode
pnpm dev

# Start server
pnpm start
```

## Available Tools

### `list_components`
List all available Anchor UI components, optionally filtered by category.

**Parameters:**
- `category` (optional): Filter by category (`layout`, `form`, `overlay`, `navigation`, `feedback`, `utility`, or `all`)

**Example:**
```json
{
  "category": "form"
}
```

### `get_component`
Get detailed information about a specific component.

**Parameters:**
- `componentName` (required): Name of the component (e.g., "Dialog", "Accordion")

**Example:**
```json
{
  "componentName": "Dialog"
}
```

### `get_component_part`
Get information about a specific part of a component.

**Parameters:**
- `componentName` (required): Name of the component
- `partName` (required): Name of the part (e.g., "Root", "Trigger", "Panel")

**Example:**
```json
{
  "componentName": "Dialog",
  "partName": "Trigger"
}
```

### `get_usage_examples`
Get usage examples for a component.

**Parameters:**
- `componentName` (required): Name of the component
- `variant` (optional): Type of example (`basic`, `controlled`, `custom`, `composition`)

**Example:**
```json
{
  "componentName": "Dialog",
  "variant": "controlled"
}
```

### `validate_code`
Validate code against Anchor UI guardrails.

**Parameters:**
- `code` (required): Code to validate
- `componentName` (optional): Component name for context-specific validation

**Example:**
```json
{
  "code": "<Dialog.Root><Dialog.Trigger>Open</Dialog.Trigger></Dialog.Root>",
  "componentName": "Dialog"
}
```

### `get_guardrails`
Get all guardrail rules for Anchor UI.

**Parameters:** None

## Guardrails

The MCP server enforces the following guardrails:

### Errors (Must Fix)
- ❌ No inline styles - use className or CSS
- ❌ Do not override ARIA attributes unnecessarily
- ❌ Do not break component composition
- ❌ Do not manipulate DOM directly
- ❌ Do not prevent default keyboard behavior
- ❌ Include all required component parts

### Warnings (Should Fix)
- ⚠️ Consider using controlled state instead of useState
- ⚠️ Avoid CSS-in-JS libraries (use plain CSS/Tailwind)

### Suggestions (Best Practices)
- 💡 Use render prop function for type safety
- 💡 Use className as function to access component state
- 💡 Use data attributes provided by Anchor UI

## Architecture

The MCP server is a **read-only consumer** of Anchor UI's existing architecture:

- **Reads** from `docs/reference/generated/*.json` (component metadata)
- **Reads** from `docs/src/app/(public)/(content)/react/components/` (usage examples)
- **Parses** component structure from source files (read-only)
- **Provides** MCP API for AI tools

No modifications to:
- Component implementations
- Build system
- Documentation structure
- Published APIs

## Component Categories

- **Layout**: Accordion, Collapsible, Tabs
- **Form**: Checkbox, Radio, Switch, Input, NumberField, Slider, Field, Fieldset, Form, Toggle, ToggleGroup
- **Overlay**: Dialog, AlertDialog, Menu, Popover, Select, Tooltip, PreviewCard
- **Navigation**: Tabs
- **Feedback**: Progress
- **Utility**: Separator, ScrollArea, DirectionProvider

## License

MIT

## Related

- [Anchor UI Documentation](https://anchorui.com)
- [Model Context Protocol](https://modelcontextprotocol.io)

