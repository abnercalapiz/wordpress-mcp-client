# MCP Configuration Examples

This folder contains example configurations for connecting to WordPress sites using the WordPress MCP Client.

## Available Examples

### 1. Claude Desktop Configuration
- **File**: `claude-desktop-config.json`
- **Purpose**: Connect your WordPress site to Claude Desktop app
- **Usage**: Copy to your Claude Desktop config location and update the URL

### 2. Simple MCP Configuration
- **File**: `mcp-simple-config.json`
- **Purpose**: Basic MCP setup with minimal endpoints
- **Best for**: Getting started quickly

### 3. Search-Focused Configuration
- **File**: `mcp-search-config.json`
- **Purpose**: Optimized for content search functionality
- **Best for**: Sites with lots of searchable content

### 4. Full Tools Configuration
- **File**: `mcp-tools-config.json`
- **Purpose**: Complete MCP setup with all available tools
- **Best for**: Advanced users wanting full functionality

### 5. Connection Examples
- **File**: `mcp-connection.json`
- **Purpose**: Shows different connection methods
- **Best for**: Understanding connection options

## How to Use

1. Choose the configuration that best fits your needs
2. Copy the JSON file
3. Replace `https://your-domain.com` with your actual WordPress site URL
4. Add to your AI tool's configuration:
   - **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
   - **Other tools**: Check their documentation

## Using with the NPM Package

```javascript
const { WordPressMCPClient } = require('@abnerjezweb/wordpress-mcp-client');

// Example: Using the simple configuration
const client = new WordPressMCPClient({
  baseUrl: 'https://your-domain.com',
  apiPath: '/wp-json/llmready/v1/mcp'
});

// Make requests
const response = await client.request('tools/list');
console.log(response);
```

## Need Help?

- See the [WordPress MCP Client documentation](https://github.com/abnercalapiz/wordpress-mcp-client)
- Check the [LLM Ready plugin documentation](https://your-domain.com/wp-admin/admin.php?page=llmready-mcp)