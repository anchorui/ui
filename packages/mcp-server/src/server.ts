#!/usr/bin/env node
/**
 * Anchor UI MCP Server
 * Provides component discovery, props understanding, usage examples, and guardrails for AI IDEs
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  getComponentList,
  getComponentDetails,
  getComponentPartInfo,
} from './components.js';
import { validateCode, getGuardrails } from './guardrails.js';

const SERVER_NAME = 'anchor-ui-mcp';
const SERVER_VERSION = '1.0.0';

class AnchorUIMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_components',
          description: 'List all available Anchor UI components, optionally filtered by category',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                enum: [
                  'layout',
                  'form',
                  'overlay',
                  'navigation',
                  'feedback',
                  'utility',
                  'all',
                ],
                description:
                  'Filter components by category. Use "all" or omit to get all components.',
              },
            },
          },
        },
        {
          name: 'get_component',
          description:
            'Get detailed information about a specific Anchor UI component including all parts, props, accessibility, and composition rules',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description:
                  'Name of the component (e.g., "Accordion", "Dialog", "Menu")',
              },
            },
            required: ['componentName'],
          },
        },
        {
          name: 'get_component_part',
          description:
            'Get information about a specific part of a component (e.g., Root, Trigger, Panel)',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: 'Name of the component',
              },
              partName: {
                type: 'string',
                description:
                  'Name of the part (e.g., "Root", "Trigger", "Panel", "Popup")',
              },
            },
            required: ['componentName', 'partName'],
          },
        },
        {
          name: 'get_usage_examples',
          description:
            'Get usage examples for a component (basic, controlled, custom, composition)',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: 'Name of the component',
              },
              variant: {
                type: 'string',
                enum: ['basic', 'controlled', 'custom', 'composition'],
                description: 'Type of example to retrieve',
              },
            },
            required: ['componentName'],
          },
        },
        {
          name: 'validate_code',
          description:
            'Validate code against Anchor UI guardrails and best practices',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'Code to validate',
              },
              componentName: {
                type: 'string',
                description:
                  'Optional: Component name for context-specific validation',
              },
            },
            required: ['code'],
          },
        },
        {
          name: 'get_guardrails',
          description:
            'Get all guardrail rules for Anchor UI to prevent common mistakes',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_components': {
            const category = (args?.category as string) || 'all';
            const components = await getComponentList(
              category === 'all' ? undefined : (category as any)
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(components, null, 2),
                },
              ],
            };
          }

          case 'get_component': {
            const componentName = args?.componentName as string;
            if (!componentName) {
              throw new Error('componentName is required');
            }
            const component = await getComponentDetails(componentName);
            if (!component) {
              throw new Error(`Component "${componentName}" not found`);
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(component, null, 2),
                },
              ],
            };
          }

          case 'get_component_part': {
            const componentName = args?.componentName as string;
            const partName = args?.partName as string;
            if (!componentName || !partName) {
              throw new Error('componentName and partName are required');
            }
            const part = await getComponentPartInfo(componentName, partName);
            if (!part) {
              throw new Error(
                `Part "${partName}" not found in component "${componentName}"`
              );
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(part, null, 2),
                },
              ],
            };
          }

          case 'get_usage_examples': {
            const componentName = args?.componentName as string;
            const variant = args?.variant as string;
            if (!componentName) {
              throw new Error('componentName is required');
            }
            const component = await getComponentDetails(componentName);
            if (!component) {
              throw new Error(`Component "${componentName}" not found`);
            }
            let examples = component.composition.examples;
            if (variant) {
              examples = examples.filter((e) => e.variant === variant);
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(examples, null, 2),
                },
              ],
            };
          }

          case 'validate_code': {
            const code = args?.code as string;
            const componentName = args?.componentName as string;
            if (!code) {
              throw new Error('code is required');
            }
            const result = validateCode(code, componentName);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_guardrails': {
            const guardrails = getGuardrails();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(guardrails, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });

    // List resources (component reference files)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      try {
        const components = await getComponentList();
        return {
          resources: components.map((comp) => ({
            uri: `anchor-ui://component/${comp.name}`,
            name: comp.displayName,
            description: comp.description,
            mimeType: 'application/json',
          })),
        };
      } catch (error) {
        return {
          resources: [],
        };
      }
    });

    // Read resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      const componentName = uri.replace('anchor-ui://component/', '');
      try {
        const component = await getComponentDetails(componentName);
        if (!component) {
          throw new Error(`Component "${componentName}" not found`);
        }
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(component, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // Log to stderr so it doesn't interfere with MCP protocol
    console.error('Anchor UI MCP server running on stdio');
  }
}

// Start the server
const server = new AnchorUIMCPServer();
server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

