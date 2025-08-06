#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

class FigmaMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'figma-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_file',
          description: 'Get Figma file data',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The Figma file key',
              },
              token: {
                type: 'string',
                description: 'Figma API token',
              },
            },
            required: ['fileKey', 'token'],
          },
        },
        {
          name: 'get_file_nodes',
          description: 'Get specific nodes from a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The Figma file key',
              },
              nodeIds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of node IDs to retrieve',
              },
              token: {
                type: 'string',
                description: 'Figma API token',
              },
            },
            required: ['fileKey', 'nodeIds', 'token'],
          },
        },
        {
          name: 'get_team_projects',
          description: 'Get all projects for a team',
          inputSchema: {
            type: 'object',
            properties: {
              teamId: {
                type: 'string',
                description: 'The Figma team ID',
              },
              token: {
                type: 'string',
                description: 'Figma API token',
              },
            },
            required: ['teamId', 'token'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_file':
            return await this.getFile(args.fileKey, args.token);
          
          case 'get_file_nodes':
            return await this.getFileNodes(args.fileKey, args.nodeIds, args.token);
          
          case 'get_team_projects':
            return await this.getTeamProjects(args.teamId, args.token);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async getFile(fileKey, token) {
    const response = await axios.get(`${FIGMA_API_BASE}/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': token,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async getFileNodes(fileKey, nodeIds, token) {
    const ids = nodeIds.join(',');
    const response = await axios.get(
      `${FIGMA_API_BASE}/files/${fileKey}/nodes?ids=${ids}`,
      {
        headers: {
          'X-Figma-Token': token,
        },
      }
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async getTeamProjects(teamId, token) {
    const response = await axios.get(
      `${FIGMA_API_BASE}/teams/${teamId}/projects`,
      {
        headers: {
          'X-Figma-Token': token,
        },
      }
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Figma MCP server running on stdio');
  }
}

const server = new FigmaMCPServer();
server.run().catch(console.error);