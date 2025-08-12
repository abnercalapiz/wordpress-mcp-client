#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { version } = require('../package.json');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration examples
const CONFIG_EXAMPLES = {
  claude: {
    name: 'Claude Desktop',
    configPath: {
      darwin: '~/Library/Application Support/Claude/claude_desktop_config.json',
      win32: '%APPDATA%\\Claude\\claude_desktop_config.json',
      linux: '~/.config/claude/claude_desktop_config.json'
    },
    example: {
      mcpServers: {
        "wordpress-your-site": {
          command: "node",
          args: [
            "/path/to/wordpress-mcp-client/bin/wordpress-mcp-server",
            "https://your-wordpress-site.com"
          ]
        }
      }
    }
  },
  roo: {
    name: 'Roo Code (VS Code)',
    configPath: {
      darwin: '~/Library/Application Support/Code/User/settings.json',
      win32: '%APPDATA%\\Code\\User\\settings.json',
      linux: '~/.config/Code/User/settings.json'
    },
    example: {
      "roo.mcpServers": {
        "wordpress-your-site": {
          type: "stdio",
          command: "node",
          args: [
            "/path/to/wordpress-mcp-client/bin/wordpress-mcp-server",
            "https://your-wordpress-site.com"
          ],
          name: "Your WordPress Site",
          description: "WordPress MCP connection"
        }
      }
    }
  }
};

program
  .name('mcp-site')
  .description('WordPress MCP Manual Configuration Helper')
  .version(version);

program
  .command('show-config [client]')
  .description('Show manual configuration instructions')
  .action((client) => {
    showManualConfig(client);
  });

program
  .command('generate <url>')
  .description('Generate configuration JSON for a WordPress site')
  .option('-n, --name <name>', 'Site name')
  .option('-c, --client <client>', 'Target client (claude, roo)', 'claude')
  .action((url, options) => {
    generateConfig(url, options);
  });

program
  .command('test <url>')
  .description('Test if MCP server works with a WordPress site')
  .action(async (url) => {
    await testServer(url);
  });

program.parse(process.argv);

function showManualConfig(client) {
  console.log(chalk.blue('\n📘 WordPress MCP Manual Configuration Guide\n'));

  if (!client) {
    // Show all clients
    Object.keys(CONFIG_EXAMPLES).forEach(key => {
      showClientConfig(key);
      console.log('');
    });
  } else if (CONFIG_EXAMPLES[client]) {
    showClientConfig(client);
  } else {
    console.error(chalk.red(`Unknown client: ${client}`));
    console.log('Available clients: claude, roo');
  }
}

function showClientConfig(client) {
  const config = CONFIG_EXAMPLES[client];
  const platform = os.platform();
  const configPath = config.configPath[platform] || config.configPath.linux;

  console.log(chalk.green(`=== ${config.name} ===`));
  console.log(chalk.yellow('\nConfiguration file location:'));
  console.log(`  ${configPath}`);
  
  console.log(chalk.yellow('\nConfiguration format:'));
  console.log(JSON.stringify(config.example, null, 2));

  console.log(chalk.yellow('\nSteps to configure:'));
  console.log('1. Install WordPress MCP Client globally:');
  console.log(chalk.cyan('   npm install -g @abnerjezweb/wordpress-mcp-client'));
  
  console.log('\n2. Find the installation path:');
  console.log(chalk.cyan('   npm list -g @abnerjezweb/wordpress-mcp-client'));
  
  console.log('\n3. Edit your configuration file and add the mcpServers section');
  console.log('4. Replace "/path/to/wordpress-mcp-client" with the actual path');
  console.log('5. Replace "https://your-wordpress-site.com" with your site URL');
  console.log('6. Restart', config.name);
}

function generateConfig(url, options) {
  const { name, client } = options;
  
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }

  const siteId = url
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const siteName = name || `WordPress - ${new URL(url).hostname}`;

  // Find global node_modules path
  const npmRoot = require('child_process')
    .execSync('npm root -g')
    .toString()
    .trim();
  
  const serverPath = path.join(npmRoot, '@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server');

  let config;
  if (client === 'claude') {
    config = {
      mcpServers: {
        [`wordpress-${siteId}`]: {
          command: "node",
          args: [serverPath, url]
        }
      }
    };
  } else if (client === 'roo') {
    config = {
      "roo.mcpServers": {
        [`wordpress-${siteId}`]: {
          type: "stdio",
          command: "node",
          args: [serverPath, url],
          name: siteName,
          description: `WordPress MCP connection to ${siteName}`
        }
      }
    };
  } else {
    config = {
      [`wordpress-${siteId}`]: {
        command: "node",
        args: [serverPath, url],
        name: siteName
      }
    };
  }

  console.log(chalk.green('\n✅ Generated configuration:\n'));
  console.log(JSON.stringify(config, null, 2));

  console.log(chalk.yellow('\n📋 To use this configuration:'));
  console.log('1. Copy the JSON above');
  console.log('2. Open your MCP client\'s configuration file');
  console.log('3. Merge this configuration with existing settings');
  console.log('4. Save and restart your MCP client');

  if (client === 'claude') {
    const platform = os.platform();
    const configPath = CONFIG_EXAMPLES.claude.configPath[platform] || CONFIG_EXAMPLES.claude.configPath.linux;
    console.log(chalk.cyan(`\nClaude Desktop config location: ${configPath}`));
  } else if (client === 'roo') {
    const platform = os.platform();
    const configPath = CONFIG_EXAMPLES.roo.configPath[platform] || CONFIG_EXAMPLES.roo.configPath.linux;
    console.log(chalk.cyan(`\nRoo Code config location: ${configPath}`));
  }
}

async function testServer(url) {
  console.log(chalk.blue(`\n🧪 Testing MCP server with ${url}...\n`));

  const { spawn } = require('child_process');
  const serverProcess = spawn('wordpress-mcp-server', [url]);

  let output = '';
  let errorOutput = '';

  serverProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  serverProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  // Send initialize request
  serverProcess.stdin.write(JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {}
  }) + '\n');

  setTimeout(() => {
    serverProcess.kill();
    
    if (output.includes('protocolVersion')) {
      console.log(chalk.green('✅ Server is working correctly!'));
      console.log(chalk.yellow('\nServer response:'));
      console.log(output);
    } else {
      console.log(chalk.red('❌ Server test failed'));
      if (errorOutput) {
        console.log(chalk.yellow('\nError output:'));
        console.log(errorOutput);
      }
    }
  }, 2000);
}

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}