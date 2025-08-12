# WordPress MCP Server Documentation

The WordPress MCP Client npm package includes a built-in MCP server that allows Claude Desktop and other MCP clients to communicate with WordPress sites.

## How It Works

The MCP server acts as a bridge between MCP clients (like Claude Desktop) and your WordPress site's REST API:

```
Claude Desktop → MCP Server (Node.js) → WordPress REST API
```

## Using the Built-in Server

### With the CLI Tool (Automatic)

When you use `mcp-site add`, it automatically configures Claude Desktop to use the built-in server:

```bash
mcp-site add https://yoursite.com --name "My Site"
```

This creates a configuration like:
```json
{
  "mcpServers": {
    "wordpress-yoursite-com": {
      "command": "npx",
      "args": ["-y", "@abnerjezweb/wordpress-mcp-client", "serve", "https://yoursite.com"]
    }
  }
}
```

### Manual Usage

You can also run the server directly:

```bash
# If installed globally
wordpress-mcp-server https://yoursite.com

# Using npx
npx @abnerjezweb/wordpress-mcp-client serve https://yoursite.com

# From the package
npm run serve https://yoursite.com
```

## Server Features

### Available Tools

The server exposes these tools to MCP clients:

1. **discovery** - Get available endpoints and capabilities
2. **business** - Retrieve business information
3. **contact** - Get contact details
4. **services** - List services/products
5. **search** - Search content with query parameters

### Protocol Support

- JSON-RPC 2.0 communication
- MCP Protocol version 0.1.0
- Supports standard MCP methods:
  - `initialize`
  - `tools/list`
  - `tools/call`

### Error Handling

The server includes comprehensive error handling:
- Network errors
- Invalid responses
- Authentication failures
- Timeout handling

## Technical Details

### Implementation

The server is implemented in pure Node.js with no external dependencies:
- Uses Node's built-in `https` module for API requests
- Uses `readline` for JSON-RPC communication
- Lightweight and fast

### File Locations

- Server binary: `bin/wordpress-mcp-server`
- Entry point: `scripts/mcp-serve.js`
- Configuration manager: `scripts/mcp-config-manager.js`

### Environment Variables

You can also pass the site URL via environment variable:

```bash
WORDPRESS_SITE_URL=https://yoursite.com wordpress-mcp-server
```

## Troubleshooting

### Server won't start

1. Check Node.js is installed: `node --version`
2. Verify the site URL is correct
3. Test the WordPress API endpoint: `curl https://yoursite.com/wp-json/llmr/mcp/v1/discovery`

### Claude Desktop can't connect

1. Restart Claude Desktop after adding a site
2. Check the configuration file: `~/.config/claude/claude_desktop_config.json`
3. Look for error messages in Claude Desktop's developer console

### API errors

1. Ensure the LLM Ready plugin is installed and activated on your WordPress site
2. Check that the MCP endpoints are accessible
3. Verify there are no security plugins blocking the API

## Security Considerations

- The server only makes HTTPS requests
- No credentials are stored
- Read-only access to public WordPress data
- Respects WordPress site permissions

## Contributing

The MCP server is open source and part of the wordpress-mcp-client package. Contributions are welcome!