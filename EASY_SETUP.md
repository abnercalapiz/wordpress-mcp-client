# 🚀 Easy WordPress MCP Setup for Claude Desktop

This is the **simplest way** to add your WordPress sites to Claude Desktop!

## Prerequisites

1. **Node.js** installed on your computer
2. **Claude Desktop** installed
3. Your WordPress site has the **LLM Ready** plugin activated

## Quick Setup (2 Steps!)

### Step 1: Download the Scripts

```bash
# Clone or download this repository
git clone https://github.com/abnerjezweb/wordpress-mcp-client.git
cd wordpress-mcp-client/scripts
```

### Step 2: Add Your Site

```bash
# Add your WordPress site
node easy-mcp-setup.js https://yoursite.com "Your Site Name"

# Examples:
node easy-mcp-setup.js https://www.newcastleseo.com.au "Newcastle SEO"
node easy-mcp-setup.js https://blog.company.com "Company Blog"
```

That's it! 🎉

## What Happens Next?

1. **Restart Claude Desktop**
2. Start asking Claude about your site:
   - "What services does Newcastle SEO offer?"
   - "Search my site for articles about WordPress"
   - "What's the contact email on my website?"

## How It Works

The setup creates a simple bridge between Claude Desktop and your WordPress site:

```
Claude Desktop → Node.js Script → Your WordPress Site
```

## Manual Setup (Alternative Method)

If you prefer to set it up manually:

1. Copy `wordpress-mcp-server.js` to a permanent location (e.g., `~/scripts/`)
2. Edit `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-wordpress-site": {
      "command": "node",
      "args": ["/path/to/wordpress-mcp-server.js", "https://yoursite.com"]
    }
  }
}
```

## Adding Multiple Sites

Just run the command multiple times:

```bash
node easy-mcp-setup.js https://site1.com "Site 1"
node easy-mcp-setup.js https://site2.com "Site 2"
node easy-mcp-setup.js https://site3.com "Site 3"
```

## Troubleshooting

### Claude can't connect to the server
1. Make sure Node.js is installed: `node --version`
2. Check the WordPress site has LLM Ready plugin active
3. Try the site URL in your browser: `https://yoursite.com/wp-json/llmr/mcp/v1/discovery`

### "Command not found" error
Make sure you're in the correct directory containing the scripts:
```bash
cd wordpress-mcp-client/scripts
```

### Site not responding
Verify your WordPress site's MCP endpoints are working:
```bash
curl https://yoursite.com/wp-json/llmr/mcp/v1/discovery
```

## Removing a Site

Edit `~/.config/claude/claude_desktop_config.json` and remove the site entry, then restart Claude Desktop.

## What Can You Ask Claude?

Once configured, you can ask Claude natural questions about your site:

- **Business Info**: "What does my website say about our company?"
- **Services**: "List all the services on my website with their prices"
- **Contact**: "What's the contact information on my site?"
- **Search**: "Find all blog posts about SEO on my website"
- **Content**: "Search for articles about WordPress security"

## Need Help?

1. Check that your WordPress site has the LLM Ready plugin installed
2. Verify the MCP endpoints are accessible
3. Make sure Node.js is properly installed
4. Restart Claude Desktop after making changes

---

**That's all you need!** No complex configuration, no package installations. Just two simple scripts that work.