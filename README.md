# Figma MCP Practice

A Model Context Protocol (MCP) server for interacting with the Figma API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. The MCP server has been configured and is running with Claude.

## Usage

The Figma MCP server provides three main tools:

### 1. get_file
Retrieves complete Figma file data.
- **fileKey**: The Figma file key (from the file URL)
- **token**: Your Figma Personal Access Token

### 2. get_file_nodes
Gets specific nodes from a Figma file.
- **fileKey**: The Figma file key
- **nodeIds**: Array of node IDs to retrieve
- **token**: Your Figma Personal Access Token

### 3. get_team_projects
Lists all projects in a Figma team.
- **teamId**: The Figma team ID
- **token**: Your Figma Personal Access Token

## Getting Started

1. Get your Figma Personal Access Token from your Figma Account Settings
2. Find the file key from any Figma file URL (e.g., in `https://www.figma.com/file/ABC123XYZ/My-Design`, the key is `ABC123XYZ`)
3. Use the MCP tools through Claude to interact with Figma

## MCP Server Status

Run `claude mcp list` to check the server status. The server should show as "✓ Connected".