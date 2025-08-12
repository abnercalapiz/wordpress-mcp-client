# WordPress MCP Configuration Examples

This folder contains example configurations for connecting to WordPress sites using the Model Context Protocol (MCP).

## Manual Configuration Examples

### Claude Desktop

Create or edit `~/.config/claude/claude_desktop_config.json` (Linux/Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "wordpress-mysite": {
      "command": "node",
      "args": [
        "/usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server",
        "https://your-wordpress-site.com"
      ]
    }
  }
}
```

### Roo Code (VS Code)

Add to your VS Code settings.json:

```json
{
  "roo.mcpServers": {
    "wordpress-mysite": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server",
        "https://your-wordpress-site.com"
      ],
      "name": "My WordPress Site"
    }
  }
}
```

## Generate Configuration

Use the CLI tool to generate configurations:

```bash
# For Claude Desktop
mcp-site generate https://your-site.com --name "My Site" --client claude

# For Roo Code
mcp-site generate https://your-site.com --name "My Site" --client roo
```

## Prerequisites

Before using these configurations:

1. **Install the package**: `npm install -g @abnerjezweb/wordpress-mcp-client`
2. **WordPress Site**: Ensure you have a WordPress site accessible via HTTPS
3. **LLM Ready Plugin**: Install and activate the LLM Ready plugin on your WordPress site
4. **MCP Endpoints**: Verify endpoints are accessible at `/wp-json/llmr/mcp/v1/`

## Testing Your Configuration

Test if your WordPress MCP endpoints are working:

```bash
# Test the MCP server
mcp-site test https://your-domain.com

# Test WordPress endpoints directly
curl https://your-domain.com/wp-json/llmr/mcp/v1/discovery
curl https://your-domain.com/wp-json/llmr/mcp/v1/business
```

## Multiple Sites

To add multiple sites, simply add more entries to the mcpServers object:

```json
{
  "mcpServers": {
    "wordpress-site1": {
      "command": "node",
      "args": [
        "/usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server",
        "https://site1.com"
      ]
    },
    "wordpress-site2": {
      "command": "node",
      "args": [
        "/usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server",
        "https://site2.com"
      ]
    }
  }
}
```

## Need Help?

- See the [Manual Setup Guide](../../docs/MANUAL_SETUP.md)
- Check the main [documentation](../../README.md)
- Review [troubleshooting guide](../../docs/TROUBLESHOOTING.md)
- Explore [usage examples](../../docs/EXAMPLES.md)