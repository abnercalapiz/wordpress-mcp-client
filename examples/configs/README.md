# WordPress MCP Configuration Examples

This folder contains example configurations for connecting to WordPress sites using the Model Context Protocol (MCP).

## Configuration Files

### 1. Single Site Configuration
**File**: `claude-desktop-config.json`

This configuration shows how to connect a single WordPress site to Claude Desktop.

**Usage**:
1. Copy this file to your Claude Desktop configuration location:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/claude/claude_desktop_config.json`

2. Replace `https://your-domain.com` with your actual WordPress site URL

3. Restart Claude Desktop

### 2. Multi-Site Configuration
**File**: `claude-desktop-config-multisite.json`

This configuration demonstrates how to connect multiple WordPress sites to Claude Desktop.

**Features**:
- Configure multiple WordPress sites in one config
- Each site has its own MCP server instance
- Sites can be accessed independently in Claude

**Example Setup**:
- `wordpress-main-site`: Your main corporate website
- `wordpress-blog`: Your company blog
- `wordpress-shop`: Your e-commerce site

**Usage**:
1. Copy and modify the multi-site config file
2. Replace the example URLs with your actual WordPress sites
3. Add or remove sites as needed
4. Each site needs a unique identifier (e.g., `wordpress-main-site`, `wordpress-blog`)

**What both configurations enable**:
- Search WordPress content
- Access business information
- View contact details
- List services/products
- Discover available endpoints

## How to Use with NPM Package

If you're using the `@abnerjezweb/wordpress-mcp-client` npm package:

```javascript
const { WordPressMCPClient } = require('@abnerjezweb/wordpress-mcp-client');

// Initialize client
const client = new WordPressMCPClient({
  baseUrl: 'https://your-domain.com/wp-json/llmr/mcp/v1'
});

// Use the client
const business = await client.business();
console.log(business);
```

## Prerequisites

Before using these configurations:

1. **WordPress Site**: Ensure you have a WordPress site accessible via HTTPS
2. **LLM Ready Plugin**: Install and activate the LLM Ready plugin on your WordPress site
3. **MCP Endpoints**: Verify endpoints are accessible at `/wp-json/llmr/mcp/v1/`

## Testing Your Configuration

Test if your WordPress MCP endpoints are working:

```bash
# Test discovery endpoint
curl https://your-domain.com/wp-json/llmr/mcp/v1/discovery

# Test business endpoint
curl https://your-domain.com/wp-json/llmr/mcp/v1/business
```

## Need Help?

- See the main [documentation](../../README.md)
- Check the [MCP Client Setup Guide](../../MCP_CLIENT_SETUP_GUIDE.md)
- Review [troubleshooting guide](../../docs/TROUBLESHOOTING.md)
- Explore [usage examples](../../docs/EXAMPLES.md)