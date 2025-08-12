# WordPress MCP Auto-Add Feature

Automatically add WordPress sites to your MCP client configurations (Claude Desktop, Roo Code, and more) with a simple command.

## Overview

The WordPress MCP Client now includes a powerful CLI tool that automatically adds WordPress sites to various MCP client configurations. No more manual JSON editing!

## Features

- 🚀 **Automatic Configuration** - Add sites to Claude Desktop, Roo Code, etc. with one command
- 🔍 **Site Validation** - Automatically validates WordPress sites have MCP endpoints
- 📋 **Multi-Client Support** - Add to multiple clients simultaneously
- 🎯 **Interactive Mode** - User-friendly prompts for easy setup
- 🛠️ **Management Tools** - List, remove, and validate sites

## Installation

### Global Installation (Recommended)

```bash
npm install -g @abnerjezweb/wordpress-mcp-client
```

After global installation, you can use the `mcp-site` command from anywhere:

```bash
mcp-site add https://example.com
```

### Local Installation

If installed locally in a project:

```bash
npm install @abnerjezweb/wordpress-mcp-client
```

Use with npx:

```bash
npx mcp-site add https://example.com
```

## Quick Start

### Add a Site to Claude Desktop

```bash
# Simple - adds to Claude Desktop by default
mcp-site add https://yoursite.com

# With custom name
mcp-site add https://yoursite.com --name "My WordPress Site"
```

### Add to Multiple Clients

```bash
# Add to both Claude Desktop and Roo Code
mcp-site add https://yoursite.com --clients claude roo
```

### Interactive Mode

For a guided experience:

```bash
mcp-site interactive
```

## Commands

### `add <url>` - Add a WordPress Site

Add a WordPress site to MCP client configurations.

```bash
mcp-site add <url> [options]
```

**Options:**
- `-c, --clients <clients...>` - Target clients (claude, roo, custom) [default: claude]
- `-i, --id <id>` - Custom site ID (auto-generated if not provided)
- `-n, --name <name>` - Custom site name
- `--skip-validation` - Skip site validation
- `--custom-path <path>` - Path to custom config file

**Examples:**

```bash
# Add to Claude Desktop with auto-generated ID
mcp-site add https://myblog.com

# Add to multiple clients with custom name
mcp-site add https://shop.com --clients claude roo --name "My Shop"

# Add with custom ID
mcp-site add https://docs.com --id docs-site --name "Documentation"

# Skip validation (faster but less safe)
mcp-site add https://internal.com --skip-validation
```

### `list` - List Configured Sites

Display all WordPress sites configured in a client.

```bash
mcp-site list [options]
```

**Options:**
- `-c, --client <client>` - Target client (claude, roo) [default: claude]

**Examples:**

```bash
# List sites in Claude Desktop
mcp-site list

# List sites in Roo Code
mcp-site list --client roo
```

### `remove <siteId>` - Remove a Site

Remove a WordPress site from configuration.

```bash
mcp-site remove <siteId> [options]
```

**Options:**
- `-c, --client <client>` - Target client (claude, roo) [default: claude]

**Examples:**

```bash
# Remove from Claude Desktop
mcp-site remove myblog-com

# Remove from Roo Code
mcp-site remove myblog-com --client roo
```

### `validate <url>` - Validate a Site

Check if a WordPress site has proper MCP endpoints.

```bash
mcp-site validate <url>
```

**Examples:**

```bash
# Validate a site
mcp-site validate https://example.com

# Output shows endpoint availability and capabilities
```

### `interactive` - Interactive Mode

Launch interactive mode with prompts.

```bash
mcp-site interactive
# or
mcp-site i
```

## Client Configuration Locations

The tool automatically finds and updates the correct configuration files:

### Claude Desktop
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

### Roo Code (VS Code)
- **macOS**: `~/Library/Application Support/Code/User/settings.json`
- **Windows**: `%APPDATA%\Code\User\settings.json`
- **Linux**: `~/.config/Code/User/settings.json`

### Custom
- Specify any path with `--custom-path`

## Usage Scenarios

### Scenario 1: Agency Managing Multiple Client Sites

```bash
# Add all client sites to Claude Desktop
mcp-site add https://client1.com --name "Client 1 - Corporate"
mcp-site add https://client2.com --name "Client 2 - E-commerce"
mcp-site add https://client3.com --name "Client 3 - Blog"

# List all sites
mcp-site list
```

### Scenario 2: Development Workflow

```bash
# Add development and production sites
mcp-site add https://mysite.local --name "Dev Site" --id dev
mcp-site add https://staging.mysite.com --name "Staging" --id staging
mcp-site add https://mysite.com --name "Production" --id prod

# Work with different environments in Claude
```

### Scenario 3: Multi-Tool Setup

```bash
# Add site to all your tools at once
mcp-site add https://company.com --clients claude roo --name "Company Site"
```

## NPM Scripts

If you're working within the project directory:

```bash
# Add a site
npm run mcp:add https://example.com

# List sites
npm run mcp:list

# Remove a site
npm run mcp:remove site-id

# Validate a site
npm run mcp:validate https://example.com

# Interactive mode
npm run mcp:interactive
```

## Troubleshooting

### "Site validation failed"

**Causes:**
- LLM Ready plugin not installed/activated
- Incorrect URL
- Site not accessible

**Solution:**
```bash
# Check if MCP endpoints exist
mcp-site validate https://yoursite.com

# Skip validation if you're sure
mcp-site add https://yoursite.com --skip-validation
```

### "Permission denied" when writing config

**Solution:**
- Run with appropriate permissions
- Check file ownership
- Ensure config directory exists

### Changes not appearing in Claude Desktop

**Solution:**
1. Completely quit Claude Desktop (not just close window)
2. Restart Claude Desktop
3. Sites should now appear

## Advanced Usage

### Custom Configuration Files

Create a custom config file for your team:

```bash
# Add sites to a shared config
mcp-site add https://site1.com --clients custom --custom-path ./team-sites.json
mcp-site add https://site2.com --clients custom --custom-path ./team-sites.json

# Share team-sites.json with your team
```

### Programmatic Usage

You can also use the configuration manager programmatically:

```javascript
const MCPConfigManager = require('@abnerjezweb/wordpress-mcp-client/scripts/mcp-config-manager');

const manager = new MCPConfigManager();

// Add a site programmatically
await manager.addSite('https://example.com', {
  clients: ['claude', 'roo'],
  siteName: 'My Site',
  siteId: 'my-site'
});

// List sites
const sites = manager.listSites('claude');
console.log(sites);
```

### Batch Operations

Create a script to add multiple sites:

```javascript
const sites = [
  { url: 'https://site1.com', name: 'Site 1' },
  { url: 'https://site2.com', name: 'Site 2' },
  { url: 'https://site3.com', name: 'Site 3' }
];

for (const site of sites) {
  await manager.addSite(site.url, {
    clients: ['claude'],
    siteName: site.name
  });
}
```

## Security Considerations

1. **Validation** - Always validate sites unless you trust the source
2. **HTTPS** - Use HTTPS URLs for security
3. **Public Endpoints** - MCP endpoints are public by default
4. **Config Files** - Keep your config files secure

## Best Practices

1. **Use Descriptive Names** - Help identify sites easily in your MCP client
2. **Consistent IDs** - Use a naming convention for site IDs
3. **Regular Cleanup** - Remove unused sites with `mcp-site remove`
4. **Validate First** - Always validate new sites before adding

## FAQ

### Can I add password-protected sites?

Currently, the MCP endpoints are public. Password-protected sites would need custom authentication handling.

### Does this work with WordPress Multisite?

Yes, but each site in the network needs its own entry if they have separate MCP endpoints.

### Can I export/import configurations?

Yes, you can use custom config files:
```bash
# Export to custom file
mcp-site add https://site.com --clients custom --custom-path ./export.json

# Share export.json with others
```

### How do I update the CLI tool?

```bash
# Global update
npm update -g @abnerjezweb/wordpress-mcp-client

# Local update
npm update @abnerjezweb/wordpress-mcp-client
```

---

For more information, see the main [documentation](../README.md) or [troubleshooting guide](./TROUBLESHOOTING.md).