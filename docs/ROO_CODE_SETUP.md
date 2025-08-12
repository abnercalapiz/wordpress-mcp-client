# Roo Code Setup Guide

This guide explains how to use WordPress MCP Client with Roo Code (VS Code extension).

## Overview

Roo Code is a VS Code extension that supports the Model Context Protocol (MCP). The WordPress MCP Client can automatically configure Roo Code to connect to your WordPress sites.

## Automatic Setup

### 1. Install the npm package globally

```bash
npm install -g @abnerjezweb/wordpress-mcp-client
```

### 2. Add your WordPress site to Roo Code

```bash
# Basic command
mcp-site add https://yoursite.com --client roo --name "My WordPress Site"

# Add to both Claude and Roo
mcp-site add https://yoursite.com --clients claude roo --name "My Site"

# With custom ID
mcp-site add https://yoursite.com --client roo --id mysite --name "My Site"
```

### 3. Reload VS Code

After adding a site, reload VS Code for the changes to take effect:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Developer: Reload Window"
- Press Enter

## How It Works

The WordPress MCP Client configures Roo Code to use the built-in MCP server:

```json
{
  "roo.mcpServers": {
    "wordpress-yoursite-com": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@abnerjezweb/wordpress-mcp-client", "serve", "https://yoursite.com"],
      "name": "My WordPress Site",
      "description": "WordPress MCP connection to My WordPress Site"
    }
  }
}
```

## Using in Roo Code

Once configured, you can use Roo Code to interact with your WordPress site:

1. Open the Roo Code panel in VS Code
2. Your WordPress site will appear in the available connections
3. You can ask questions like:
   - "What services does my site offer?"
   - "Search for articles about SEO"
   - "Show me the contact information"

## Managing Sites

### List configured sites

```bash
mcp-site list --client roo
```

### Remove a site

```bash
mcp-site remove site-id --client roo
```

## Manual Configuration

If you prefer to configure manually, edit your VS Code settings.json:

1. Open VS Code Settings (JSON)
2. Add or modify the `roo.mcpServers` section:

```json
{
  "roo.mcpServers": {
    "wordpress-mysite": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@abnerjezweb/wordpress-mcp-client", "serve", "https://mysite.com"],
      "name": "My Site",
      "description": "WordPress MCP connection"
    }
  }
}
```

## Server Types

Roo Code supports two types of MCP servers:

### 1. STDIO Server (Recommended)
- Uses standard input/output for communication
- Automatically managed by Roo Code
- Used by default when you run `mcp-site add`

### 2. HTTP Server (Alternative)
For advanced users who want to run a persistent HTTP server:

```bash
# Start HTTP server on port 3000
wordpress-mcp-server-roo 3000 https://yoursite.com
```

Then configure in settings.json:
```json
{
  "roo.mcpServers": {
    "wordpress-mysite": {
      "type": "http",
      "url": "http://localhost:3000",
      "name": "My Site"
    }
  }
}
```

## Troubleshooting

### Sites not appearing in Roo Code

1. Make sure you've reloaded VS Code after adding sites
2. Check that Roo Code extension is installed and enabled
3. Verify the configuration in VS Code settings

### Connection errors

1. Test your WordPress site's MCP endpoints:
   ```bash
   curl https://yoursite.com/wp-json/llmr/mcp/v1/discovery
   ```
2. Ensure the LLM Ready plugin is installed on your WordPress site
3. Check VS Code developer console for error messages

### Configuration location

VS Code settings are typically stored at:
- **macOS**: `~/Library/Application Support/Code/User/settings.json`
- **Windows**: `%APPDATA%\Code\User\settings.json`
- **Linux**: `~/.config/Code/User/settings.json`

## Features Available

When connected, you can access:
- **Discovery**: Available endpoints and capabilities
- **Business**: Company information
- **Contact**: Contact details and hours
- **Services**: Products and services offered
- **Search**: Full-text content search

## Best Practices

1. Use descriptive names for your sites
2. Test the connection after adding each site
3. Keep the npm package updated for latest features
4. Use the interactive mode (`mcp-site interactive`) if unsure

## Support

- Report issues: [GitHub Issues](https://github.com/abnerjezweb/wordpress-mcp-client/issues)
- Documentation: See the main README.md
- WordPress plugin: Ensure LLM Ready is installed and activated