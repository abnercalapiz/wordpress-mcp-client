# Manual MCP Configuration Guide

This guide explains how to manually configure WordPress MCP Client with various MCP clients like Claude Desktop and Roo Code.

## Why Manual Configuration?

Manual configuration gives you full control over:
- Exact paths and commands
- Custom environment variables
- Multiple site configurations
- Debugging and troubleshooting

## Prerequisites

1. Install the WordPress MCP Client globally:
```bash
npm install -g @abnerjezweb/wordpress-mcp-client
```

2. Find the installation path:
```bash
npm list -g @abnerjezweb/wordpress-mcp-client
```

This will show something like:
```
/usr/lib
└── @abnerjezweb/wordpress-mcp-client@1.0.9
```

## Claude Desktop Configuration

### 1. Locate Configuration File

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

### 2. Edit Configuration

Open the file and add your WordPress site:

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

### 3. Alternative Configurations

**Using the global command (if in PATH):**
```json
{
  "mcpServers": {
    "wordpress-mysite": {
      "command": "wordpress-mcp-server",
      "args": ["https://your-wordpress-site.com"]
    }
  }
}
```

**Using a wrapper script:**
```json
{
  "mcpServers": {
    "wordpress-mysite": {
      "command": "/home/user/wordpress-mcp-wrapper.sh",
      "args": ["https://your-wordpress-site.com"]
    }
  }
}
```

### 4. Multiple Sites

```json
{
  "mcpServers": {
    "wordpress-site1": {
      "command": "wordpress-mcp-server",
      "args": ["https://site1.com"]
    },
    "wordpress-site2": {
      "command": "wordpress-mcp-server",
      "args": ["https://site2.com"]
    }
  }
}
```

## Roo Code (VS Code) Configuration

### 1. Locate Configuration File

- **macOS**: `~/Library/Application Support/Code/User/settings.json`
- **Windows**: `%APPDATA%\Code\User\settings.json`
- **Linux**: `~/.config/Code/User/settings.json`

### 2. Edit Configuration

Add to your VS Code settings:

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
      "name": "My WordPress Site",
      "description": "WordPress MCP connection"
    }
  }
}
```

## Creating a Wrapper Script

Sometimes you need a wrapper script for better control:

### 1. Create the Script

Create `~/wordpress-mcp-wrapper.sh`:

```bash
#!/bin/bash
# WordPress MCP Server Wrapper

# Set any environment variables if needed
export NODE_PATH=/usr/lib/node_modules

# Log for debugging (optional)
echo "Starting WordPress MCP Server for $1" >> ~/mcp-debug.log

# Run the server
exec node /usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server "$@"
```

### 2. Make it Executable

```bash
chmod +x ~/wordpress-mcp-wrapper.sh
```

### 3. Use in Configuration

```json
{
  "mcpServers": {
    "wordpress-mysite": {
      "command": "/home/user/wordpress-mcp-wrapper.sh",
      "args": ["https://your-wordpress-site.com"]
    }
  }
}
```

## Testing Your Configuration

### 1. Test the Server Directly

```bash
# Test if the server starts
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | \
  wordpress-mcp-server https://your-site.com
```

You should see a response with `protocolVersion`.

### 2. Use the Helper Tool

```bash
# Generate configuration
mcp-site generate https://your-site.com --name "My Site" --client claude

# Test server
mcp-site test https://your-site.com

# Show configuration examples
mcp-site show-config claude
```

## Troubleshooting

### Server Not Found

If Claude/Roo can't find the server:

1. Use absolute paths
2. Check file permissions
3. Try using `node` with full path to script
4. Create a wrapper script in your home directory

### Permission Denied

```bash
# Check permissions
ls -la /usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/

# Make sure it's executable
chmod +x /usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server
```

### Debugging

Create a debug wrapper that logs information:

```bash
#!/bin/bash
echo "=== MCP Debug ===" >> ~/mcp-debug.log
echo "Date: $(date)" >> ~/mcp-debug.log
echo "PWD: $(pwd)" >> ~/mcp-debug.log
echo "User: $(whoami)" >> ~/mcp-debug.log
echo "PATH: $PATH" >> ~/mcp-debug.log
echo "Args: $@" >> ~/mcp-debug.log

exec node /usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server "$@"
```

## Common Issues and Solutions

### Issue: "No MCP servers running"

**Solution 1**: Use full absolute paths
```json
{
  "command": "/usr/bin/node",
  "args": ["/usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server", "..."]
}
```

**Solution 2**: Check if running in restricted environment (Snap, Flatpak)
- May need to use wrapper scripts
- May need to install in user directory

### Issue: Server starts but can't connect to WordPress

**Solution**: Verify WordPress site has LLM Ready plugin active
```bash
curl https://your-site.com/wp-json/llmr/mcp/v1/discovery
```

## Best Practices

1. **Use descriptive IDs**: `wordpress-clientname` instead of `wordpress-site1`
2. **Test configurations**: Always test after changes
3. **Keep backups**: Save working configurations
4. **Use absolute paths**: Avoid PATH-related issues
5. **Check logs**: Enable debug logging when troubleshooting

## Next Steps

After configuration:
1. Restart your MCP client (Claude Desktop, VS Code)
2. Look for your WordPress site in the MCP connections
3. Test with queries like "What services does my site offer?"

For more help, see the [Troubleshooting Guide](./TROUBLESHOOTING.md).